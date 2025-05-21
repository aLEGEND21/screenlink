"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const ReceiveShare = () => {
  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const blobsQueue = useRef<Blob[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [codecError, setCodecError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize references and state
    blobsQueue.current = [];
    setIsConnected(false);
    setIsBuffering(false);
    setCodecError(null);

    // Initialize MediaSource if supported
    if (!window.MediaSource) {
      console.error("MediaSource API is not supported in this browser");
      return;
    }

    // Create new MediaSource instance
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;

    // Track if component is still mounted
    let isMounted = true;

    // Create video source from MediaSource
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(mediaSource);
    }

    // Handle source open event
    const handleSourceOpen = () => {
      if (!isMounted) return;

      console.log("[MediaSource] Source opened");

      try {
        // Try with video-only VP9 (without requiring audio)
        const sourceBuffer = mediaSource.addSourceBuffer(
          'video/webm; codecs="vp9"'
        );
        sourceBufferRef.current = sourceBuffer;
        setIsConnected(true);

        // Process queue when buffer updates are complete
        sourceBuffer.addEventListener("updateend", () => {
          if (!isMounted) return;

          setIsBuffering(false);

          if (blobsQueue.current.length > 0 && !sourceBuffer.updating) {
            processNextBlob();
          }
        });
      } catch (e) {
        console.error("[MediaSource] Error creating SourceBuffer:", e);

        // Try alternative codecs if the first one fails
        try {
          // Try with video-only VP8
          const sourceBuffer = mediaSource.addSourceBuffer(
            'video/webm; codecs="vp8"'
          );
          sourceBufferRef.current = sourceBuffer;
          setIsConnected(true);

          sourceBuffer.addEventListener("updateend", () => {
            if (!isMounted) return;
            setIsBuffering(false);
            if (blobsQueue.current.length > 0 && !sourceBuffer.updating) {
              processNextBlob();
            }
          });
        } catch (e2) {
          console.error(
            "[MediaSource] Error creating alternative SourceBuffer:",
            e2
          );
          setCodecError(
            "Your browser doesn't support the required video codec"
          );
        }
      }
    };

    // Listen for source open event
    mediaSource.addEventListener("sourceopen", handleSourceOpen);

    // Initialize Socket.IO connection
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[socket.io] Connected to server");
    });

    // Handle incoming screen data
    socket.on("screen-data", (data) => {
      if (!isMounted) return;

      console.log("[socket.io] Received screen data chunk");

      // Convert data to blob if needed
      const blob =
        data instanceof Blob
          ? data
          : new Blob([data], { type: "video/webm; codecs=vp9" });

      // Add to processing queue
      blobsQueue.current.push(blob);

      // Process if buffer is ready and not currently updating
      if (
        sourceBufferRef.current &&
        mediaSourceRef.current &&
        mediaSourceRef.current.readyState === "open" &&
        !sourceBufferRef.current.updating
      ) {
        processNextBlob();
      }
    });

    // Process next blob in queue
    const processNextBlob = () => {
      if (
        blobsQueue.current.length === 0 ||
        !sourceBufferRef.current ||
        !mediaSourceRef.current ||
        mediaSourceRef.current.readyState !== "open"
      ) {
        return;
      }

      const blob = blobsQueue.current.shift();
      if (!blob) return;

      setIsBuffering(true);

      // Convert blob to ArrayBuffer
      blob
        .arrayBuffer()
        .then((buffer) => {
          if (
            !isMounted ||
            !sourceBufferRef.current ||
            !mediaSourceRef.current ||
            mediaSourceRef.current.readyState !== "open" ||
            sourceBufferRef.current.updating
          ) {
            // Put back in queue if conditions aren't right
            blobsQueue.current.unshift(blob);
            setIsBuffering(false);
            return;
          }

          try {
            sourceBufferRef.current.appendBuffer(buffer);
          } catch (e) {
            console.error("[MediaSource] Error appending buffer:", e);
            setIsBuffering(false);
            setCodecError(
              "Error processing video data. Try reloading the page."
            );
          }
        })
        .catch((e) => {
          console.error(
            "[MediaSource] Error converting blob to ArrayBuffer:",
            e
          );
          setIsBuffering(false);
        });
    };

    // Clean up on component unmount
    return () => {
      isMounted = false;

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      if (mediaSourceRef.current) {
        try {
          if (mediaSourceRef.current.readyState === "open") {
            mediaSourceRef.current.endOfStream();
          }
          mediaSourceRef.current.removeEventListener(
            "sourceopen",
            handleSourceOpen
          );
        } catch (e) {
          console.error("[MediaSource] Error ending media stream:", e);
        }
      }

      // Clear references
      sourceBufferRef.current = null;
      mediaSourceRef.current = null;
      socketRef.current = null;
      blobsQueue.current = [];
    };
  }, []);

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h2>Received Screen Share</h2>
      {!isConnected && <p>Initializing connection...</p>}
      {codecError && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          <p>{codecError}</p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={() => console.log("Video metadata loaded")}
        onLoadedData={() => console.log("Video data loaded")}
        onPlay={() => console.log("Video playing")}
        onError={(e) => {
          const error = e.currentTarget.error;
          console.error("Video error:", error);
          setCodecError(`Error: ${error?.message || "Unknown video error"}`);
        }}
        style={{
          width: "100%",
          maxHeight: "80vh",
          backgroundColor: "#000",
          display: "block",
          marginTop: "15px",
        }}
      />

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current
                .play()
                .catch((e) => console.error("Force play error:", e));
            }
          }}
          disabled={!isConnected || !!codecError}
          style={{
            padding: "8px 16px",
            backgroundColor: isConnected && !codecError ? "#0070f3" : "#cccccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isConnected && !codecError ? "pointer" : "not-allowed",
          }}
        >
          Force Play
        </button>
        {isConnected && isBuffering && <p>Buffering video...</p>}
      </div>
    </div>
  );
};

export default ReceiveShare;
