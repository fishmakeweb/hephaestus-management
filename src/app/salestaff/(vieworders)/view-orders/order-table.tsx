import { Order, fetchAllOrders } from "@/dbUtils/Sales/ManageOrders";
import React, { useEffect, useState } from "react";

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(orders.length / rowsPerPage);

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

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = orders.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="mt-40">
      <table className="min-w-full divide-y divide-gray-200 border-collapse border border-black w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Order Date
            </th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Order Status
            </th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Total Price
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentRows.map((order) => (
            <tr key={order.orderId}>
              <td className="px-6 py-3 whitespace-no-wrap">{order.orderId}</td>
              <td className="px-6 py-3 whitespace-no-wrap">{order.username}</td>
              <td className="px-6 py-3 whitespace-no-wrap">
                {new Date(order.orderDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>
              <td className="px-6 py-3 whitespace-no-wrap">
                {order.orderStatus.statusDescription}
              </td>
              <td className="px-6 py-3 whitespace-no-wrap">
                ${order.totalPrice.toFixed(2)}
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
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
