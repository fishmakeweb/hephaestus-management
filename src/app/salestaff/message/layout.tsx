"use client";
import React, { useState, useEffect } from "react";
import {
  fetchOrderMessage,
  OrderMessageDTO,
  CusOrderMessageDTO,
  fetchCusOrderMessage,
} from "@/dbUtils/Chat/order";
import OrderCards from "./order-cards";
import CusOrderCards from "./view-custom-form";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [orderData, setOrderData] = useState<OrderMessageDTO[]>([]);
  const [customOrderData, setCustomOrderData] = useState<CusOrderMessageDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrderMessage();
        console.log("Fetched order data:", data);
        setOrderData(data);
        const customData = await fetchCusOrderMessage();
        setCustomOrderData(customData);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 h-full flex flex-col lg:flex-row p-4">
        <div className="w-full w-1/3">
          <div>
            <p className="text-xl text-center font-semibold mb-4">Orders</p>
            <OrderCards orderData={orderData} />
          </div>
          <div>
          <p className="text-xl  font-semibold  text-center mb-4">
              Custom Orders
            </p>
            <CusOrderCards customOrderData={customOrderData} />
          </div>
        </div>
        <div className="flex-1 mx-8">{children}</div>
    </div>
  );
}
