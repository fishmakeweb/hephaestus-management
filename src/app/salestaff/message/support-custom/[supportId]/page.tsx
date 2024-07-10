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
    const socket = new SockJS("http://localhost:8080/custom-order-chat");
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
      `http://localhost:8080/api/chat/custom-order-history/${supportId}`,
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
      <p className="text-xl  font-semibold mb-4">Custom Order Support Box</p>
      <div className="w-full bg-white  rounded-lg shadow-md">
        <div className="chat-box">
          <div className="messages">
            <ScrollArea className="h-[70vh]">
              {chatMessages.map((msg) => (
                <p className="mb-2" key={msg.id}>
                  <span className="bg-gray-300 text-black p-1">
                    {msg.username}
                  </span>
                  : {msg.message}
                </p>
              ))}
            </ScrollArea>
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Hello..."
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
