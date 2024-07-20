import React, { useEffect, useState } from "react";
import {
  CustomOrder,
  fetchAllCustomOrders,
  filterCOrders,
  updateAtr,
  verifyCancelOrders,
  verifyOrders,
} from "@/dbUtils/Sales/ManageOrders";

export default function CustomOrderTable() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState<CustomOrder | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filterOrder, setFilterOrder] = useState<CustomOrder[]>([]);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState<boolean>(false);
  const rowsPerPage = 6;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetchAllCustomOrders();
    setOrders(response);
    setFilterOrder([]); // Clear any existing filters
  };

  const filterCOrder = async (orderStatusId: number) => {
    try {
      const response = await filterCOrders(orderStatusId);
      setFilterOrder(response);
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
  };

  const handleFilterChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    if (selectedValue === 0) {
      await fetchOrders();
    } else {
      await filterCOrder(selectedValue);
    }
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleVerifyStatus = async (customOrderId: number, description: string) => {
    try {
      if (description.trim().match("PREPAID SUCCESSFULLY")) {
        await verifyOrders(customOrderId);
      } else if (description.trim().match("REQUEST CANCEL")) {
        await verifyCancelOrders(customOrderId);
      }
      setShowSuccessOverlay(true);
      setTimeout(() => setShowSuccessOverlay(false), 3000); // Hide overlay after 3 seconds
    } catch (error) {
      console.error("Error verifying status:", error);
    }
    fetchOrders();
  };

  const handleEditOrder = (order: CustomOrder) => {
    setEditingOrder(order);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingOrder) {
      const { name, value } = e.target;
      setEditingOrder({ ...editingOrder, [name]: value });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      await updateAtr(
        editingOrder.customOrderId,
        editingOrder.fullpaid,
        editingOrder.description,
        selectedDate
      );
      fetchOrders();
      setEditingOrder(null);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = (filterOrder.length > 0 ? filterOrder : orders).slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const totalPages = Math.ceil(
    (filterOrder.length > 0 ? filterOrder.length : orders.length) / rowsPerPage
  );

  return (
    <div className="mt-10">
      <div className="mb-4">
        <select onChange={handleFilterChange} className="p-2 border rounded">
          <option value="0">All Orders</option>
          <option value="2">Pending</option>
          <option value="3">Processing</option>
          <option value="4">Success</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border-collapse border border-black">
          <thead>
            <tr>
              <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Username
              </th>
              <th className="px-14 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-14 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Finish Date
              </th>
              <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Order Status
              </th>
              <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Order Description
              </th>
              <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Pre-paid Price
              </th>
              <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Full-paid Price
              </th>
              <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((customOrder) => (
              <tr key={customOrder.customOrderId}>
                <td className="px-6 py-3 whitespace-no-wrap">
                  {customOrder.customOrderId}
                </td>
                <td className="px-6 py-3 whitespace-no-wrap">
                  {customOrder.username}
                </td>
                <td className="px-6 py-3 whitespace-no-wrap">
                  {new Date(customOrder.startDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour12: false,
                  })}
                </td>
                <td className="px-6 py-3 whitespace-no-wrap">
                  {customOrder.finishDate
                    ? new Date(customOrder.finishDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour12: false,
                      })
                    : "No data"}
                </td>
                <td className="px-6 py-3 whitespace-no-wrap">
                  {customOrder.orderStatus.statusDescription}
                </td>
                <td className="px-6 py-3 whitespace-no-wrap">
                  {customOrder.description}
                </td>
                <td className="px-6 py-3 whitespace-no-wrap">
                  ${customOrder.prepaid.toFixed(2)}
                </td>
                <td className="px-6 py-3 whitespace-no-wrap">
                  ${customOrder.fullpaid.toFixed(2)}
                </td>
                <td className="px-6 py-3 whitespace-no-wrap flex space-x-2">
                  <button
                    className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEditOrder(customOrder)}
                  >
                    Edit
                  </button>
                  {customOrder.orderStatus.statusId === 3 && (
                    <button
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() =>
                        handleVerifyStatus(
                          customOrder.customOrderId,
                          customOrder.description
                        )
                      }
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Success</h2>
            <p>Email has been sent to the customer</p>
          </div>
        </div>
      )}
      {editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md w-1/2 overflow-y-auto">
            <h2 className="text-2xl mb-4">Edit Order</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={editingOrder.description}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fullpaid"
                >
                  Full-paid Price
                </label>
                <input
                  type="number"
                  name="fullpaid"
                  value={editingOrder.fullpaid}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="finishDate"
                >
                  Finish Date
                </label>
                <input
                  type="date"
                  name="finishDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
