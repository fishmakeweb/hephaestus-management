'use client'
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import NavbarStaff from "@/components/TopNav";
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
                    <div className="w-full">
                        <div className="w-full">
                        <NavbarStaff />
                        </div>
                        <div className="flex justify-center">
                            <div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>

            </body>
        </html>
    );
}