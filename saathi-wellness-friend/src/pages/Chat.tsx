import React from "react";
import ChatInterface from "@/components/ChatInterface";
import NavigationHeader from "@/components/NavigationHeader";

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationHeader />
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;
