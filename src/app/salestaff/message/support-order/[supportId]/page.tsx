"use client"
import { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'next/navigation';
import axios from '@/dbUtils/axios';
import AuthService from '@/dbUtils/Auth/AuthService';
import { OrderChatMessage } from '@/dbUtils/Chat/types';

const Page: React.FC = () => {
  const { supportId } = useParams<{ supportId: string }>();
  const [chatMessages, setChatMessages] = useState<OrderChatMessage[]>([]);
  const stompClientRef = useRef<Client | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await axios.get<OrderChatMessage[]>(`https://api.hephaestus.store/api/chat/history/${supportId}`, {
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
      });
      setChatMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }, [supportId]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  useEffect(() => {
    const socket = new SockJS('https://api.hephaestus.store/chat');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      onConnect: () => {
        stompClientRef.current?.subscribe(`/topic/orders/${supportId}`, (message: any) => {
          const receivedMessage: OrderChatMessage = JSON.parse(message.body);
          setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
    });
    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [supportId]);

  const sendMessage = useCallback(() => {
    if (newMessage.trim() !== '' && stompClientRef.current) {
      const timestamp = new Date().toISOString();
      const username = AuthService.getUserName();
      const chatMessage = {
        message: newMessage.trim(),
        username: '(Staff) ' + username,
        timestamp: timestamp,
      };
      stompClientRef.current.publish({
        destination: `/app/chat/${supportId}`,
        body: JSON.stringify(chatMessage),
      });
      setNewMessage('');
    }
  }, [newMessage, supportId]);

  return (
    <>
      <p className="text-xl font-semibold mb-4">Order Support Box</p>
      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="chat-box">
          <div className="messages">
            {chatMessages.map((msg) => (
              <p className="mb-2" key={msg.id}>
                <span className="bg-gray-300 text-black p-1">{msg.username}</span>: {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Page;
