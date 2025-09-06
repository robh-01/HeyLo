import { UserRoundPlus } from "lucide-react";

export default function UserSearchTile({
  user,
}: {
  user: { id: string; username: string };
}) {
  async function handleRequest() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ toId: user.id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send chat request");
      }
    } catch (error) {
      console.error("Error sending chat request:", error);
    }
  }

  return (
    <div className="user-search-tile flex items-center p-2 border-b">
      <div className="avatar-placeholder w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
        <span className="text-xl text-white">
          {user.username.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="user-info flex-1 flex items-center justify-between">
        <p className="username font-semibold">{user.username}</p>
        <button
          onClick={handleRequest}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <UserRoundPlus />
        </button>
      </div>
    </div>
  );
}
