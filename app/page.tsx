"use client";

import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

const Home = () => {
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      // Create new socket connection
      socketRef.current = io();

      socketRef.current.on("connect", () => {
        console.log("[socket.io] Connected to server");
      });

      socketRef.current.on("message-receive", (data: string) => {
        setInput(data);
      });
    };

    socketInitializer();

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit("message-send", e.target.value);
    }
  };

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  );
};

export default Home;
