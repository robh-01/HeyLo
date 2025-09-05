import type { GlobalMessageType } from "@/utils/types";

export default function GlobalMessage({
  message,
}: {
  message: GlobalMessageType;
}) {
  return (
    <div>
      <strong>{message.sender}</strong>: {message.content}{" "}
      <em>({new Date(message.timestamp).toLocaleTimeString()})</em>
    </div>
  );
}
