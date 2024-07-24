"use client";
import React, { useState, useEffect } from "react";
import { fetchCustomerProfileByUsername } from "@/dbUtils/Sales/order";
import { fetchCusOrder, CustomOrderData } from "@/dbUtils/Sales/customOrder";

export interface Profile {
  userId: number;
  fullName: string;
  email: string;
  address: string;
  username: string;
  registeredDate: string;
}

interface TrackedCustomOrderCardProps {
  customOrderId: string;
  username: string;
  orderStatus: string;
  onClose: () => void; // Add a prop to handle closing the form
}

const TrackedCustomOrderCard: React.FC<TrackedCustomOrderCardProps> = ({
  customOrderId,
  username,
  orderStatus,
  onClose,
}) => {
  const [formData, setFormData] = useState<CustomOrderData | null>(null);
  const [userData, setUserData] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile(username);
    getCustomOrderDetails(customOrderId);
  }, [customOrderId, username]);

  const getProfile = async (username: string) => {
    const data = await fetchCustomerProfileByUsername(username);
    console.log(data);
    setUserData(data);
  };

  const getCustomOrderDetails = async (customOrderId: string) => {
    const data = await fetchCusOrder(parseInt(customOrderId));
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
        <h1 className="text-xl font-semibold mb-4">
          Chi tiết đơn hàng {customOrderId}
        </h1>
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
        <h2 className="text-lg font-bold mb-2">
          Trạng thái đơn hàng : {orderStatus}{" "}
        </h2>
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Chi tiết sản phẩm chế tác</h2>
          {formData && (
            <div
              key={formData.customOrderId}
              className="py-3 flex items-center"
            >
              <div className="ml-3 flex-grow">
                <p className="text-md font-medium text-gray-900">
                  Loại: {formData.customJewelry.category.categoryName}
                </p>
                <p className="text-md font-medium text-gray-900">
                  Vật liệu: {formData.customJewelry.material.materialName}
                </p>
                <p className="text-md font-medium text-gray-900">
                  Hình dạng: {formData.customJewelry.shape.shapeDescription}
                </p>
                <p className="text-md font-medium text-gray-900">
                  Kích thước: {formData.customJewelry.size.sizeNumber}{" "}
                  {formData.customJewelry.size.unit}
                </p>
                {formData.customJewelry.diamond && (
                  <div>
                    <p className="text-md font-medium text-gray-900">
                      Kim cương:
                    </p>
                    <p className="text-md text-gray-700">
                      - Mã viên: {formData.customJewelry.diamond.diamondId}
                    </p>
                    <p className="text-md text-gray-700">
                      - Cut: {formData.customJewelry.diamond.cut.cutDescription}
                    </p>
                    <p className="text-md text-gray-700">
                      - Clarity:{" "}
                      {
                        formData.customJewelry.diamond.clarity
                          .clarityDescription
                      }
                    </p>
                    <p className="text-md text-gray-700">
                      - Color:{" "}
                      {formData.customJewelry.diamond.color.colorDescription}
                    </p>
                    <p className="text-md text-gray-700">
                      - Carat: {formData.customJewelry.diamond.carat.carat}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <p className="text-md font-semibold">
            Tổng giá tiền:{" "}
            {formData ? formData.customJewelry.price : "0"} VNĐ
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackedCustomOrderCard;
