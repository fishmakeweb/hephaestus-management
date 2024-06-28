import React, { useState, useEffect } from "react";
import ManageProductUtils from "@/dbUtils/Sales/ManageProducts";
import { useRouter } from "next/navigation";
import UpdateJewelry from "./updateJewelry";
import AuthService from "@/dbUtils/Auth/AuthService";

interface Jewelry {
    jewelryId: number;
    name: string;
    diamond: {
        shape: {
            shapeDescription: string;
        };
    } | null;
    material: {
        materialName: string;
    };
    category: {
        categoryName: string;
    };
    size: {
        sizeNumber: number;
        unit: string;
    };
    price: number;
    img: string;
    quantity: number;
    date: string;
}

const ViewAllJewelry: React.FC = () => {
    const router = useRouter();
    const productManager = new ManageProductUtils();
    const [jewelry, setJewelry] = useState<Jewelry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [editingJewelryId, setEditingJewelryId] = useState<number | null>(null);
    const [showActionOverlay, setShowActionOverlay] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

    const fetchJewelry = async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await productManager.fetchJewelryPagination(page);
            const jewelry = response?.data;
            setJewelry(jewelry.content);
            setTotalPages(jewelry.totalPages);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch jewelry data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJewelry(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleEditClick = (jewelryId: number) => {
        if (editingJewelryId === jewelryId && showActionOverlay) {
            setShowActionOverlay(false);
            setEditingJewelryId(null);
        } else {
            setEditingJewelryId(jewelryId);
            setShowActionOverlay(true);
        }
    };

    const handleActionClick = (action: string) => {
        setShowActionOverlay(false);
        if (action === "update") {
            setShowUpdateForm(true);
        } else if (action === "delete") {
            setShowDeleteConfirmation(true);
        }
    };

    const handleDelete = async (jewelryId: number | null) => {
        if (jewelryId === null) return;
        try {
            await productManager.deleteJewelry(jewelryId);
            setShowDeleteConfirmation(false);
            fetchJewelry(currentPage);
        } catch (error) {
            console.error("Delete jewelry failed:", error);
        }
    };

    const handleCloseForm = () => {
        setShowUpdateForm(false);
        setEditingJewelryId(null);
    };

    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            handleCloseForm();
        }
    };

    const handleOverlayClick = () => {
        setShowActionOverlay(false);
        setEditingJewelryId(null);
    };

    const handleAdd = () => {
        router.push("/adminstaff/addJewelry");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <section className="container-fluid px-4 mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mt-4">
                    <div>
                        <div className="flex items-center gap-x-3">
                            <h2 className="text-lg font-medium text-gray-800">
                                Jewelry
                            </h2>
                            <span className="px-3 py-1 text-base text-blue-600 bg-blue-100 rounded-full">
                                {jewelry.length} products
                            </span>
                        </div>
                    </div>
                    {AuthService.isAdmin() && (
                        <div className="flex items-center gap-x-3">
                            <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-gray-800 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-black"
                                onClick={handleAdd}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col mt-6">
                    <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-sm font-normal rtl:text-right text-gray-500"
                                    >
                                        <button className="flex items-center gap-x-3 focus:outline-none">
                                            <span>Products</span>
                                            <svg
                                                className="h-3"
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M2.5 4.5L5 7.5L7.5 4.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.25"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                                    >
                                        Category
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                                    >
                                        Size
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                                    >
                                        Price
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                                    >
                                        Quantity
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative py-3.5 px-4"
                                    >
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jewelry.map((item) => (
                                    <tr key={item.jewelryId}>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <img
                                                    className="object-cover w-10 h-10 rounded-lg"
                                                    src={item.img}
                                                    alt={item.name}
                                                />
                                                <div className="flex items-center gap-x-2">
                                                    <h2 className="font-medium text-gray-800">
                                                        {item.name}
                                                    </h2>
                                                    {item.diamond && (
                                                        <small className="text-sm font-light text-gray-600">
                                                            - {item.diamond.shape.shapeDescription}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60">
                                                <h2 className="text-sm font-normal text-emerald-500">
                                                    {item.category.categoryName}
                                                </h2>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {item.size.sizeNumber} {item.size.unit}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {item.date}
                                        </td>
                                        {AuthService.isAdmin() && (
                                            <td className="px-1 py-2 text-base text-center">
                                                <button
                                                    className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100"
                                                    onClick={() => handleEditClick(item.jewelryId)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                                        />
                                                    </svg>
                                                </button>
                                                {editingJewelryId === item.jewelryId && showActionOverlay && (
                                                    <div
                                                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                                            onClick={() => handleActionClick("update")}
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                                            onClick={() => handleActionClick("delete")}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center py-3 px-4 bg-gray-50">
                            <div>
                                <button
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <button
                                    className="px-3 py-1.5 ml-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                            <span className="text-sm font-normal text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
                    </div>
                </div>
            </section >

            {editingJewelryId && showUpdateForm && (
                <UpdateJewelry jewelryId={editingJewelryId} onClose={handleCloseForm} />
            )}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md text-center">
                        <h2 className="text-xl font-semibold mb-4">
                            Are you sure you want to delete?
                        </h2>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => handleDelete(editingJewelryId)}
                        >
                            Yes
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={() => setShowDeleteConfirmation(false)}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
export default ViewAllJewelry;
