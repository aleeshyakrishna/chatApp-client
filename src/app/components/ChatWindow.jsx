import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  messages,
  onSendMessage,
  currentUser,
  room,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 shadow-md flex items-center">
        <div className="flex-1 flex items-center justify-center">
          <h1 className="font-semibold text-lg">Room {room}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {console.log(messages, room, currentUser, "--------------------")}

        {messages
          .filter((msg) => msg.chatId === room)
          .map((msg) => {
            const isSystemMessage = msg.type === "system";
            const isSentByCurrentUser = msg.sender?._id === currentUser?.userId;
            const messageDate = new Date(msg.createdAt).toLocaleString();

            if (isSystemMessage) {
              return (
                <div key={msg._id} className="flex justify-center my-2">
                  <div className="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-full">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isSentByCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 max-w-xs md:max-w-md lg:max-w-lg rounded-lg shadow-sm ${
                    isSentByCurrentUser
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSentByCurrentUser ? "bg-blue-400" : "bg-gray-200"
                      }`}
                    >
                      <span className="text-xs font-bold">
                        {msg.sender?.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <span className="font-medium">{msg.sender?.name}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <span
                    className={`block text-xs mt-2 text-right ${
                      isSentByCurrentUser ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {messageDate}
                  </span>
                </div>
              </div>
            );
          })}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shadow-md">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
