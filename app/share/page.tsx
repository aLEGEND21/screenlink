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
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Copy, MonitorStop, Share2 } from "lucide-react";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { copyRoomCode, copyRoomUrl } from "@/lib/utils";

const ShareScreen = () => {
  const peerRef = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");

  // NOTE: TEMP
  const roomId = "room-id-123";
  const roomUrl = `${roomId}`; // Replace with your actual URL logic
  const handleCopyLink = async () => {};
  const handleCopyCode = async () => {};

  // Cleanup function to stop sharing when the component unmounts
  useEffect(() => {
    return () => {
      stopSharing();
    };
  }, []);

  // Update the video element when the stream starts so it has time to render and the ref is valid
  useEffect(() => {
    if (status === "connecting" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [status]);

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
    setStatus("disconnected");
  };

  const startSharing = async () => {
    if (!peerRef.current) {
      peerRef.current = new Peer("sharer-id", {
        debug: 2,
      });
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    streamRef.current = stream;

    setStatus("connecting");

    stream.getVideoTracks()[0].addEventListener("ended", () => {
      stopSharing();
    });

    peerRef.current.on("connection", (conn) => {
      peerRef.current!.call(conn.peer, stream);
      setStatus("connected");
    });
  };

  return (
    <div className="container mx-auto max-w-7xl px-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 md:grid-cols-2"
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Share Your Screen</CardTitle>
            <CardDescription>
              Start sharing your screen and get a unique room code to share with
              others.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted aspect-video overflow-hidden rounded-md">
              {status === "disconnected" ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">
                    Click "Start Sharing" to begin
                  </p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {status === "disconnected" ? (
              <Button onClick={startSharing} className="w-full">
                Start Sharing
              </Button>
            ) : (
              <Button
                onClick={stopSharing}
                variant="destructive"
                className="w-full"
              >
                <MonitorStop className="mr-2 h-4 w-4" />
                Stop Sharing
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share With Others</CardTitle>
            <CardDescription>
              Share your unique room link or code with others so they can view
              your screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Room Status</p>
                <div className="flex items-center">
                  <div
                    className={`mr-2 h-2.5 w-2.5 rounded-full ${
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
              <Separator />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Room Code</p>
              <div className="flex items-center gap-2">
                <div className="bg-muted flex-1 rounded-md p-3 text-center font-mono text-lg tracking-widest">
                  {roomId || "------"}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!roomId}
                  onClick={() => copyRoomCode(roomId)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Room Link</p>
              <div className="flex items-center gap-2">
                <div className="bg-muted flex-1 truncate rounded-md p-3 font-mono text-sm">
                  {roomUrl || "Waiting for room..."}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!roomUrl}
                  onClick={() => copyRoomUrl(roomUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              variant="outline"
              disabled={!roomUrl}
              onClick={() => copyRoomUrl(roomUrl)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Copy & Share Link
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10"
      >
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-xl font-medium">Instructions</h3>
          <ol className="text-muted-foreground ml-6 list-decimal space-y-2">
            <li>
              Click the <strong>"Start Sharing"</strong> button above and select
              the screen or application you want to share.
            </li>
            <li>
              Share the generated room <strong>code</strong> or{" "}
              <strong>link</strong> with others who need to see your screen.
            </li>
            <li>
              They can enter the code on the home page or visit the link
              directly to view your screen.
            </li>
            <li>
              When you're done, click <strong>"Stop Sharing"</strong> to end the
              session.
            </li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareScreen;
