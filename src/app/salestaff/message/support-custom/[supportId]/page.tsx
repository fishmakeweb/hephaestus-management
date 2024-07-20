"use client";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "@/dbUtils/axios";
import AuthService from "@/dbUtils/Auth/AuthService";
import { CustomOrderChatMessage } from "@/dbUtils/Chat/custom-types";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function Chat() {
  const { supportId } = useParams<{ supportId: string }>();
  const [chatMessages, setChatMessages] = useState<CustomOrderChatMessage[]>(
    []
  );
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    fetchChatHistory();
  }, [supportId]);

  useEffect(() => {
    let client: Client;
    const socket = new SockJS("https://api.hephaestus.store/custom-order-chat");
    client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      onConnect: () => {
        client.subscribe(
          `/topic/custom-orders/${supportId}`,
          (message: any) => {
            const receivedMessage: CustomOrderChatMessage = JSON.parse(
              message.body
            );
            setChatMessages((prevMessages) => [
              ...prevMessages,
              receivedMessage,
            ]);
          }
        );
      },
    });
    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [supportId]);

  const fetchChatHistory = async () => {
    const response = await axios.get<CustomOrderChatMessage[]>(
      `https://api.hephaestus.store/api/chat/custom-order-history/${supportId}`,
      {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
      }
    );
    setChatMessages(response.data);
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "" && stompClient) {
      const timestamp = new Date().toISOString();
      const username = AuthService.getUserName();
      const chatMessage = {
        message: newMessage.trim(),
        username: "(Staff)" + username,
        timestamp: timestamp,
      };
      stompClient.publish({
        destination: `/app/custom-order-chat/${supportId}`,
        body: JSON.stringify(chatMessage),
      });
      setNewMessage("");
    }
  };

  return (
    <>
      <div className="mt-4 bg-white shadow-lg rounded-lg p-1 sm:p-2 w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-auto">
    <h3 className="text-lg font-semibold mb-1 sm:mb-2">Custom Order Support Box</h3>
    <div className="chat-box border border-gray-300 rounded-lg p-1 sm:p-2 max-h-60 overflow-auto">
      <ul className="space-y-1 sm:space-y-2">
        {chatMessages.map((msg) => (
          <li key={msg.id} className="break-words">
            <strong>{msg.username}:</strong> {msg.message}
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-2 sm:mt-3 flex space-x-1 sm:space-x-2 w-full">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow p-1 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-indigo-300"
        onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
      />
      <button
        onClick={sendMessage}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded transition-colors duration-150 ease-in-out"
      >
        Send
      </button>
    </div>
  </div>
    </>
  );
}
