'use client'
import { Inter } from "next/font/google";
import Sidebar from "./Sidebar";
import NavbarStaff from "../../components/TopNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Alert,AlertDescription,AlertTitle } from "@/components/ui/alert";
import AuthService from "@/dbUtils/Auth/AuthService";
import React, { useEffect, useState,useRef } from "react";
import NotFound from "../not-found";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [role, setRole] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        const userRole = await AuthService.checkRole(token);
        setRole(userRole);
      }
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/chat');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      onConnect: () => {
        client.subscribe('/topic/notifications', (message) => {
          setNotification(message.body);
          setShowNotification(true);
          audioRef.current = new Audio('https://diamondshop-img.ap-south-1.linodeobjects.com/facebookchat.mp3');
          audioRef.current.play();
          setTimeout(() => setShowNotification(false), 5000); // Hide after 5 seconds
        });
      },
      onDisconnect: () => {
        console.log("Disconnected");
      }
    });
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  if (role !== "ROLE_SALESTAFF") {
    return <NotFound />;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <ScrollArea className="h-screen w-full">
            <div className="w-full">
              <NavbarStaff role={role} />
              {showNotification && (
                <Alert  className="w-[15vw] bg-white fixed top-20 right-5 p-3 rounded-lg shadow-md transition-opacity duration-300 z-10">
                <AlertTitle className="underline">Notification</AlertTitle>
                <AlertDescription>{notification}</AlertDescription>
              </Alert>
              )}
            </div>
            <div className="flex justify-center">
              <div className="h-screen w-full">
                {children}
              </div>
            </div>
          </ScrollArea>
        </div>
      </body>
    </html>
  );
}
