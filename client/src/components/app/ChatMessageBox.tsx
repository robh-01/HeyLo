import { useEffect, useState } from "react";
export default function ChatMessageBox({
  selectedFriendId,
}: {
  selectedFriendId: string | null;
}) {
  const [chat, setChat] = useState<null | {
    username: string;
    messages: unknown[];
  }>(null);

  useEffect(() => {
    async function fetchChat() {
      if (selectedFriendId) {
        // Fetch chat messages for the selected friend
        const chatResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/messages/${encodeURIComponent(selectedFriendId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (chatResponse.ok) {
          const chatData = await chatResponse.json();
          setChat(chatData.data); // Display chat data as formatted JSON
        } else {
          console.log("Failed to load chat.");
        }
      } else {
        console.log("No friend selected.");
      }
    }
    fetchChat();
  }, [selectedFriendId]);

  if (!selectedFriendId) {
    return (
      <div className="chat-message-box flex-1 p-4 border border-gray-300 rounded">
        <p className="text-gray-500">Select a friend to start chatting.</p>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="chat-message-box flex-1 p-4 border border-gray-300 rounded">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }
  return (
    <>
      <div className="chat-message-box flex-1 p-4 border border-gray-300 rounded">
        <h2 className="text-xl font-bold mb-4">{chat.username}</h2>
      </div>
    </>
  );
}
