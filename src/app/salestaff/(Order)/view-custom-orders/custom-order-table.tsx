import { CustomOrder, fetchAllCustomOrders, updateAtr, verifyOrders, } from '@/dbUtils/Sales/ManageOrders';
import React, { useEffect, useState } from 'react';

export default function CustomOrderTable() {
    const [orders, setOrders] = useState<CustomOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingOrder, setEditingOrder] = useState<CustomOrder | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const rowsPerPage = 10;
    const totalPages = Math.ceil(orders.length / rowsPerPage);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const response = await fetchAllCustomOrders();
        setOrders(response);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleVerifyStatus = async (customOrderId : number) => {
        await verifyOrders(customOrderId);
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
            console.log(selectedDate);
            await updateAtr(editingOrder.customOrderId, editingOrder.fullpaid, editingOrder.description, selectedDate);
            fetchOrders();
            setEditingOrder(null);
        }
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = orders.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="mt-40 mx-14">
            <table className="min-w-full divide-y divide-gray-200 border-collapse border border-black w-full">
                <thead>
                    <tr>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Username</th>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Finish Date</th>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Order Status</th>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Order Description</th>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Pre-paid Price</th>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Full-paid Price</th>
                        <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentRows.map((customOrder) => (
                        <tr key={customOrder.customOrderId}>
                            <td className="px-6 py-3 whitespace-no-wrap">{customOrder.customOrderId}</td>
                            <td className="px-6 py-3 whitespace-no-wrap">{customOrder.username}</td>
                            <td className="px-6 py-3 whitespace-no-wrap">{new Date(customOrder.startDate).toLocaleDateString()}</td>
                            <td className="px-6 py-3 whitespace-no-wrap">{customOrder.finishDate ? new Date(customOrder.finishDate).toLocaleDateString() : ''}</td>
                            <td className="px-6 py-3 whitespace-no-wrap">{customOrder.orderStatus.statusDescription}</td>
                            <td className="px-6 py-3 whitespace-no-wrap">{customOrder.description}</td>
                            <td className="px-6 py-3 whitespace-no-wrap">${customOrder.prepaid.toFixed(2)}</td>
                            <td className="px-6 py-3 whitespace-no-wrap">${customOrder.fullpaid.toFixed(2)}</td>
                            <td className="px-6 py-3 whitespace-no-wrap">
                                <button
                                    className="inline-block bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 mr-2 rounded"
                                    onClick={() => handleEditOrder(customOrder)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleVerifyStatus(customOrder.customOrderId)}
                                >
                                    Verify
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
            {editingOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-md w-1/2">
                        <h2 className="text-2xl mb-4">Edit Order</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullpaid">
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="finishDate">
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
                                    className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingOrder(null)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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