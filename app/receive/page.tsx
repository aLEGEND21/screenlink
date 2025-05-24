"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const ReceiveShare = () => {
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the peer
    peerRef.current = new Peer("receiver-id", {
      debug: 2, // Log errors and warnings
    });

    // Wait for peer to be fully open before connecting
    peerRef.current.on("open", (id) => {
      console.log("My peer ID is:", id);

      // Now that peer is open, connect to the sharer
      const ROOM_ID = "sharer-id"; // Hardcoded ID for simplicity
      try {
        connectionRef.current = peerRef.current!.connect(ROOM_ID);

        connectionRef.current.on("open", () => {
          console.log("Connected to sharer");
          setIsConnected(true);
        });

        peerRef.current!.on("call", (call) => {
          call.answer();
          console.log("Call answered");
          call.on("stream", (stream: MediaStream) => {
            console.log("Received stream from sharer");
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          });
          call.on("error", (err) => {
            console.error("Call error:", err);
            setError("Error in media connection");
          });
        });
      } catch (err) {
        console.error("Failed to create connection:", err);
        setError("Failed to create connection");
      }
    });

    peerRef.current.on("error", (err) => {
      console.error("Peer connection error:", err);
      setError("Peer connection error");
    });

    // Proper cleanup function
    return () => {
      console.log("Cleaning up receiver");
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      if (connectionRef.current) {
        connectionRef.current.close();
        connectionRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h2>Received Screen Share</h2>
      {!isConnected && !error && <p>Initializing connection...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={() => console.log("Video metadata loaded")}
        onError={(e) => console.error("Video error:", e)}
        style={{
          width: "100%",
          maxHeight: "80vh",
          backgroundColor: "#000",
          display: "block",
          marginTop: "15px",
        }}
      />
    </div>
  );
};

export default ReceiveShare;
