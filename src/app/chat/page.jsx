"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import socketService from "../../../utils/socket/socketService";
import dynamic from "next/dynamic";

const ChatWindow = dynamic(() => import("../components/ChatWindow"), {
  ssr: false,
});
const MessageInput = dynamic(() => import("../components/MessageInput"), {
  ssr: false,
});
const UserList = dynamic(() => import("../components/UserList"), {
  ssr: false,
});

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [room, setRoom] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  const socketRef = useRef(null);
  const sentMessageIdsRef = useRef(new Set());

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (showChat && token && !socketRef.current) {
      const socket = socketService.connect(token);
      socketRef.current = socket;

      if (!socket) {
        console.error("Socket connection failed!");
        return;
      }

      socket.emit("join_chat", room);

      socket.on("chat_history", (chatHistory) => setMessages(chatHistory));
      socket.on("online_users", (users) => setOnlineUsers(users));
      socket.on("offline_users", (users) => setOfflineUsers(users));

      socket.on("receive_message", (message) => {
        const messageId = `${message.timestamp}-${message.content}`;
        if (sentMessageIdsRef.current.has(messageId)) {
          return;
        }

        setMessages((prev) => [...prev, message]);
      });

      socket.on("disconnect", (disconnectedUser) => {
        setOfflineUsers((prev) => [...prev, disconnectedUser]);
      });

      socket.on("typing", (userId) => {
        setTypingUsers((prev) =>
          !prev.includes(userId) ? [...prev, userId] : prev
        );
      });

      socket.on("stop_typing", (userId) => {
        setTypingUsers((prev) => prev.filter((id) => id !== userId));
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [showChat, token, room]);

  const onSendMessage = (content) => {
    if (!content.trim() || !socketRef.current) return;

    const timestamp = Date.now();
    const messageData = { content, room, timestamp };

    console.log("📤 Sending message:", messageData);

    const messageId = `${timestamp}-${content}`;
    sentMessageIdsRef.current.add(messageId);

    socketRef.current.emit("send_message", messageData);
  };

  const joinRoom = () => {
    if (room) setShowChat(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Real-time Chat App</h1>
        {user && (
          <div className="flex items-center">
            <span className="mr-4">Logged in as {user?.Name || "Guest"}</span>
            <button
              onClick={() => {
                dispatch(logout());
                router.push("/");
              }}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {!showChat ? (
        <div className="p-6 text-center">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="p-2 mb-4 border border-gray-300 rounded w-full"
          />
          <button
            onClick={joinRoom}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="flex flex-1">
          <UserList
            users={onlineUsers}
            offlineUser={offlineUsers}
            typingUsers={typingUsers}
          />
          <div className="flex flex-col flex-1">
            <ChatWindow
              messages={messages}
              setMessages={setMessages}
              onSendMessage={onSendMessage}
              currentUser={user}
              room={room}
            />
          </div>
        </div>
      )}
    </div>
  );
}
