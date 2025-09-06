import { useEffect, useState } from "react";
import FriendTile from "@/components/app/UserTile";

export default function FriendsListContainer({
  handleFriendSelection,
}: {
  handleFriendSelection?: (string: any) => unknown;
}) {
  const [friends, setFriends] = useState<unknown[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    async function fetchFriends() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/friends`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }
        const data = await response.json();
        setFriends(data.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
    fetchFriends();
  }, []);

  return (
    <div className="friends-list-container">
      <h1 className="text-2xl font-bold mb-4">Connected Friends</h1>
      <div className="friends-list overflow-y-auto max-h-[400px]">
        {friends.length > 0 ? (
          <ul>
            {friends.map((friend: any) => (
              <li
                key={friend.id}
                onClick={() => handleFriendSelection?.(friend.id)}
              >
                <FriendTile type="normalTile" user={friend} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No friends found.</p>
        )}
      </div>
    </div>
  );
}
