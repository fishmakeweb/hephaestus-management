import { useState } from "react";
import { Order, fetchAllOrders } from "@/dbUtils/Sales/ManageOrders";
import React, { useEffect } from "react";
import TrackedOrderCard from "./order-detail"; // Import the component
interface SelectedOrder {
  orderId: string;
  username: string;
  orderStatus: string; // Add more properties as needed
}
export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(
    null
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetchAllOrders();
    const filteredOrders = response.filter(
      (order) => order.orderStatus.statusId !== 1
    );
    setOrders(filteredOrders);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleViewDetail = (orderId: any, username: any, orderStatus : any) => {
    setSelectedOrder({ orderId, username, orderStatus });
  };
  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = orders.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="mt-40">
      <table className="min-w-full divide-y divide-gray-200 border-collapse border border-black w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Mã đơn hàng
            </th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Ngày mua
            </th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Tổng giá
            </th>
            <th className="px-8 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Xem chi tiết đơn
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentRows.map((order) => (
            <tr key={order.orderId}>
              <td className="px-6 py-3 whitespace-no-wrap">{order.orderId}</td>
              <td className="px-6 py-3 whitespace-no-wrap">{order.username}</td>
              <td className="px-6 py-3 whitespace-no-wrap">
                {(() => {
                  const dateString = new Date(order.orderDate).toLocaleString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  );
                  return (
                    dateString.charAt(0).toUpperCase() + dateString.slice(1)
                  );
                })()}
              </td>
              <td className="px-6 py-3 whitespace-no-wrap">
                {order.orderStatus.statusDescription}
              </td>
              <td className="px-6 py-3 whitespace-no-wrap">
                {order.totalPrice} VNĐ
              </td>
              <td className="px-8 py-3 whitespace-no-wrap">
                <button
                  className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-6 rounded"
                  onClick={() =>
                    handleViewDetail(order.orderId, order.username, order.orderStatus.statusDescription)
                  }
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Trước
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Tiếp
        </button>
      </div>
      {selectedOrder && (
        <TrackedOrderCard
          orderId={selectedOrder.orderId}
          username={selectedOrder.username}
          orderStatus={selectedOrder.orderStatus}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
