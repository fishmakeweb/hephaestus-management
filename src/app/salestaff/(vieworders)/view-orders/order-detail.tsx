"use client";
import React, { useState, useEffect } from "react";
import {
  fetchCustomerProfileByUsername,
  fetchOrderDetail,
  OrderDetail,
} from "@/dbUtils/Sales/order";

export interface Profile {
  userId: number;
  fullName: string;
  email: string;
  address: string;
  username: string;
  registeredDate: string;
}

interface TrackedOrderCardProps {
  orderId: string;
  username: string;
  orderStatus: string;
  onClose: () => void; // Add a prop to handle closing the form
}

const TrackedOrderCard: React.FC<TrackedOrderCardProps> = ({
  orderId,
  username,
  orderStatus,
  onClose,
}) => {
  const [formData, setFormData] = useState<OrderDetail[]>([]);
  const [userData, setUserData] = useState<Profile | null>(null);
  useEffect(() => {
    getProfile(username);
    getOrderDetails(orderId);
  }, [orderId, username]);

  const getProfile = async (username: string) => {
    const data = await fetchCustomerProfileByUsername(username);
    console.log(data);
    setUserData(data);
  };

  const getOrderDetails = async (orderId: string) => {
    const data = await fetchOrderDetail(parseInt(orderId));
    setFormData(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h1 className="text-xl font-semibold mb-4">Chi tiết đơn hàng  {orderId}</h1>
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Thông tin của khách hàng</h2>
          <div>
            <p>
              <strong>Họ và tên:</strong> {userData?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {userData?.address}
            </p>
            <p>
              <strong>Ngày đăng kí:</strong>{" "}
              {userData
                ? new Date(userData.registeredDate)
                    .toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .charAt(0)
                    .toUpperCase() +
                  new Date(userData.registeredDate)
                    .toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .slice(1)
                : ""}
            </p>
          </div>
        </div>
          <h2 className="text-lg font-bold mb-2">Trạng thái đơn hàng : {orderStatus} </h2>              
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">
            Danh sách sản phẩm của đơn hàng
          </h2>
          <div>
            {formData.map((detail) => (
              <div key={detail.id} className="py-3 flex items-center">
                <img
                  loading="lazy"
                  src={detail.jewelry.img}
                  alt={detail.jewelry.name}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="ml-3 flex-grow">
                  <p className="text-md font-medium text-gray-900">
                    {detail.jewelry.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Giá tiền: ${detail.jewelry.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Số lượng: {detail.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-md font-semibold">
            Tổng giá tiền:{" "}
            {formData
              .reduce(
                (total, detail) =>
                  total + detail.jewelry.price * detail.quantity,
                0
              )
              .toFixed(2)}{" "}
            VNĐ
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackedOrderCard;
