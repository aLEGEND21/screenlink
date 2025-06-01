"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { copyRoomCode, copyRoomUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Maximize2 } from "lucide-react";
import Link from "next/link";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export default function ViewMockupPage() {
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<any | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [upstreamRoomId, setUpstreamRoomId] = useState<string | null>(null);

  // Load the room ID from the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get("roomId");
    if (roomId) {
      setUpstreamRoomId(roomId);
    }
  }, [window.location.search]);

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen().catch((error) => {
        console.error("Error attempting to enable fullscreen:", error);
      });
    }
  };

  useEffect(() => {
    // Initialize the peer
    peerRef.current = new Peer("receiver-id", {
      debug: 2, // Log errors and warnings
    });

    // Set initial connecting status
    setStatus("connecting");

    // Wait for peer to be fully open before connecting
    peerRef.current.on("open", (id) => {
      // Connect to the sharer
      connectionRef.current = peerRef.current!.connect(upstreamRoomId!);

      // Wait for the upstream connection to call this peer
      peerRef.current!.on("call", (call) => {
        call.answer();

        // Update the video element once the call is answered with a stream
        call.on("stream", (stream: MediaStream) => {
          streamRef.current = stream;
          setStatus("connected");
        });

        // Handle errors with the call
        call.on("error", (err) => {
          console.error("Call error:", err);
          setError("Error in media connection");
          setStatus("disconnected");
        });
      });
    });

    // Handle peer connection errors
    peerRef.current.on("error", (err) => {
      console.error("Peer connection error:", err);
      setError("Peer connection error");
      setStatus("disconnected");
    });

    // Clean up the video stream and peer connection on unmount
    return () => {
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
      setStatus("disconnected");
    };
  }, [upstreamRoomId]);

  // Video setup effect
  useEffect(() => {
    if (status === "connected" && streamRef.current && videoRef.current) {
      // Only set srcObject if it hasn't been set yet
      if (!videoRef.current.srcObject) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    }
  }, [status]);

  return (
    <div className="container mx-auto max-w-5xl px-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Room:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono font-medium">{upstreamRoomId}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-1"
                onClick={() => copyRoomCode(upstreamRoomId!)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div
              className={`ml-2 h-2.5 w-2.5 rounded-full ${
                status === "connected"
                  ? "bg-green-500"
                  : status === "connecting"
                    ? "animate-pulse bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
            <span className="text-muted-foreground text-sm capitalize">
              {status}
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Viewing Shared Screen</CardTitle>
            <CardDescription>
              You are viewing a shared screen for room{" "}
              <strong>{upstreamRoomId}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted aspect-video overflow-hidden rounded-md">
              {status === "connected" ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <p className="text-muted-foreground">
                    {status === "connecting"
                      ? "Connecting..."
                      : "Waiting for connection..."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-muted-foreground text-sm">
              Connected to shared screen
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => copyRoomUrl(upstreamRoomId!)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Room Link
              </Button>
              <Button variant="outline" onClick={handleFullscreen}>
                <Maximize2 className="mr-2 h-4 w-4" />
                Full Screen
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
