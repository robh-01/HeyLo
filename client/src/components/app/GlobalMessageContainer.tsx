import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/App";

import type { GlobalMessageType } from "@/utils/types";
import GlobalMessage from "@/components/app/GlobalMessage";

export default function GlobalMessageContainer() {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<GlobalMessageType[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("global message", (message: GlobalMessageType) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("global message");
    };
  }, [socket]);

  function keyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && socket) {
      const messageContent = (e.target as HTMLInputElement).value;
      const message: GlobalMessageType = {
        sender: "You",
        content: messageContent,
        timestamp: new Date().toISOString(),
      };

      socket.emit("global message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      (e.target as HTMLInputElement).value = "";
    }
  }

  return (
    <div>
      <h2>Global Messages</h2>
      {messages.map((msg, index) => (
        <GlobalMessage key={index} message={msg} />
      ))}
      <input
        type="text"
        placeholder="Type a message..."
        onKeyDown={keyDownHandler}
      />
    </div>
  );
}
