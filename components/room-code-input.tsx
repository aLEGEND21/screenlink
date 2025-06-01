"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export function RoomCodeInput() {
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setIsLoading(true);
    router.push(`/view?roomId=${roomCode.trim().toUpperCase()}`);
  };

  return (
    <form
      onSubmit={handleJoinRoom}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        type="text"
        placeholder="Enter room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="text-base"
        maxLength={6}
      />
      <Button type="submit" disabled={!roomCode || isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-1">
            Joining
            <span className="animate-pulse">...</span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            Join <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
