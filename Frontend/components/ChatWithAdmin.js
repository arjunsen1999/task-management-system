"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { decrypt } from "@/utils/crypto";

const socket = io("http://localhost:4000"); // your backend socket server

export default function ChatWithAdmin({ adminId }) {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  const user = JSON.parse(currentUser);

  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }
  }, [user?._id]);

  // Register socket and listen
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("register", user._id);

    socket.on("private_message", ({ senderId, message }) => {
      setMessages((prev) => [...prev, { senderId, message }]);
    });

    return () => {
      socket.off("private_message");
    };
  }, [currentUser?._id]);

  // Load chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/v1/chat/${adminId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setMessages(decrypt(data?.ciphertext));
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    if (adminId && token) fetchMessages();
  }, [adminId, token]);

  // Auto scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      senderId: user._id,
      receiverId: adminId,
      message: input,
      token,
    };

    socket.emit("private_message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="bg-white mt-6 p-4 border rounded-lg max-w-2xl mx-auto shadow-md">
      <h2 className="font-bold text-lg text-gray-800 mb-2">Chat with Admin</h2>
      <div
        ref={chatBoxRef}
        className="h-64 overflow-y-auto border border-gray-200 rounded p-2 mb-3"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.senderId === currentUser._id ? "text-right" : "text-left"
            }`}
          >
            <p className="text-xs text-gray-500">
              {msg.senderId === currentUser._id ? "You" : "Admin"}
            </p>
            <p
              className={`inline-block px-3 py-2 rounded ${
                msg.senderId === currentUser._id
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
