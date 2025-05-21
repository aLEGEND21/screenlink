"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const ShareScreen = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io();
  });

  const handleStartShare = async () => {
    try {
      // Request screen sharing with only video (no audio)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false, // Change to false since we're not using audio
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9", // Remove opus
      });

      mediaRecorder.ondataavailable = (event) => {
        if (socketRef.current) {
          socketRef.current.emit("screen-data", event.data);
        }
      };

      mediaRecorder.start(100); // Send data every second

      socketRef.current!.emit("start-screen-share");
      console.log("Screen sharing started");

      // Add stop handling
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.onended = () => {
          console.log("Track ended");
          mediaRecorder.stop();
          if (socketRef.current) {
            socketRef.current.emit("share-ended");
          }
        };
      });
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  return (
    <>
      <button onClick={handleStartShare}>Start Screen Share</button>
    </>
  );
};

export default ShareScreen;
