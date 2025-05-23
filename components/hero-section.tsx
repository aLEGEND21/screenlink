"use client";

import { RoomCodeInput } from "@/components/room-code-input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MonitorUp, Users } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-10 py-20 md:py-32">
      <div className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Share Your Screen{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>
            <p className="text-muted-foreground mt-6 text-xl md:text-2xl">
              No downloads, no sign-ups. Just share your screen with a simple
              link.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
          >
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/share">
                <MonitorUp className="mr-2 h-5 w-5" /> Start Sharing
              </Link>
            </Button>
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur"></div>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="relative h-12 px-8 backdrop-blur-sm"
              >
                <Link href="#join-room">
                  <Users className="mr-2 h-5 w-5" /> Join a Room
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
            id="join-room"
          >
            <div className="bg-card mx-auto max-w-md rounded-xl border p-6 shadow-md">
              <h2 className="mb-4 text-xl font-medium">
                Join an existing room
              </h2>
              <div className="flex justify-center">
                <RoomCodeInput />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background gradient elements */}
      <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
    </section>
  );
}
