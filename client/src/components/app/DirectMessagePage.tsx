import FriendsListContainer from "@/components/app/FriendsListContainer";
import ChatMessageBox from "@/components/app/ChatMessageBox";
import { useState } from "react";

export default function DirectMessagePage() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="direct-message-page-container flex gap-4">
      <FriendsListContainer handleFriendSelection={setSelectedFriend} />
      <ChatMessageBox selectedFriendId={selectedFriend} />
    </div>
  );
}
