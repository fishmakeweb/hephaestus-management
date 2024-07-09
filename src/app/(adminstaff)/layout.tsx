import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });


export default function AdminStaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>admin{children}</div>
  );
}
