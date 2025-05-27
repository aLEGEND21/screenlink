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
import { ExternalLink, ArrowLeft, Copy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ViewMockupPage() {
  const mockRoomId = "ABC123";
  const mockRoomUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/view/${mockRoomId}`;

  return (
    <div className="container max-w-5xl py-12 mx-auto px-10">
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
            <span className="text-sm text-muted-foreground">Room:</span>
            <span className="font-mono font-medium">{mockRoomId}</span>
            <div className="ml-2 h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm capitalize text-muted-foreground">
              Connected
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Viewing Shared Screen</CardTitle>
            <CardDescription>
              You are viewing a shared screen for room{" "}
              <strong>{mockRoomId}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-md bg-muted">
              <div className="flex h-full flex-col items-center justify-center space-y-4">
                <p className="text-muted-foreground">
                  Screen content will appear here
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Connected to shared screen
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {}}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Room Link
              </Button>
              <Button variant="outline" asChild>
                <Link href="/" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open New Session
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
