"use client";

import { useEffect, useRef } from "react";
import Peer from "peerjs";

const ShareScreen = () => {
  const peerRef = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Cleanup function to stop sharing when the component unmounts
  useEffect(() => {
    return () => {
      stopSharing();
    };
  }, []);

  const stopSharing = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
  };

  const handleStartShare = async () => {
    if (!peerRef.current) {
      // Hardcoded ID for simplicity
      peerRef.current = new Peer("sharer-id", {
        debug: 2, // Log errors and warnings
      });
    }

    // Create the MediaStream for screen sharing
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    streamRef.current = stream;

    // Display the stream in the video element
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    // Handle when user stops sharing via browser UI
    stream.getVideoTracks()[0].addEventListener("ended", () => {
      stopSharing();
    });

    // Wait for connection from viewers and call the viewer
    // We must call the viewer since a valid stream must be provided to the call function, which
    // the viewer does not have access to until the sharer calls them.
    peerRef.current.on("connection", (conn) => {
      peerRef.current!.call(conn.peer, stream);
    });
  };

  return (
    <>
      <button onClick={handleStartShare}>Start Screen Share</button>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          maxHeight: "80vh",
          backgroundColor: "#000",
          display: "block",
          marginTop: "15px",
        }}
      />
    </>
  );
};

export default ShareScreen;
