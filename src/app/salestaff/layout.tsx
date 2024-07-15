'use client'
import { Inter } from "next/font/google";
import Sidebar from "./Sidebar";
import NavbarStaff from "../../components/TopNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthService from "@/dbUtils/Auth/AuthService";
import React, { useEffect, useState } from "react";
import NotFound from "../not-found";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [role, setRole] = useState<string | null>(null);

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
             <NavbarStaff role = {role}/>
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
