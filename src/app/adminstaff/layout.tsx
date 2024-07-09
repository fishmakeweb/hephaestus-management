'use client'
import { Inter } from "next/font/google";
import Sidebar from "./Sidebar";
import NavbarStaff from "./TopNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex">
                    <Sidebar />
                    <ScrollArea className="h-screen w-full">
                        <div className="w-full">
                        <NavbarStaff />
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