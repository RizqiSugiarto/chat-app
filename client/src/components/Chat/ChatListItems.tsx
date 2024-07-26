import { Conversation } from "@/utils/types";
import React from "react";
import ChatListItem from "./ChatListItem";
import NoDataAvailable from "../shared/NoDataAvailable";
import { useConversationContext } from "@/hooks/useAllContextHooks";

const ChatListItems = () => {
  const {
    conversations,
    currentConversation,
    newMessagesInConversations,
    handleResetNewMessagesInConversation,
  } = useConversationContext()!;

  const getUniqueConversations = (conversations: Conversation[]) => {
    const seen = new Set<string>();
    return conversations.filter(conversation => {
      const duplicate = seen.has(conversation.id);
      seen.add(conversation.id);
      return !duplicate;
    });
  };

  const uniqueConversations = getUniqueConversations(conversations);

  if (uniqueConversations.length > 0) {
    return (
      <div>
        {uniqueConversations.map((conversation: Conversation) => (
          <ChatListItem
            key={conversation.id}
            conversation={conversation}
            currentConversation={currentConversation}
            handleResetNewMessagesInConversation={handleResetNewMessagesInConversation}
            newMessagesInConversations={newMessagesInConversations}
          />
        ))}
      </div>
    );
  }

  return <NoDataAvailable message="No chats found" />;
};

export default ChatListItems;
