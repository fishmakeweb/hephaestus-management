
// Sidebar.tsx
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from 'next/link';

const Sidebar: React.FC = () => {
    const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState<boolean>(false);
    const pathname = usePathname();
    // State to manage the open/close state of the sidebar
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const toggleProductsDropdown = () => {
        setIsProductsDropdownOpen(!isProductsDropdownOpen);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`bg-white text-white 
                    h-screen transition-all 
                    duration-300  border-2 border-black
                    ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
                {/* Sidebar content */}
                <div className="flex flex-col">
                    <div className="mt-4 text-center">
                        <a href="#"
                            className="text-black hover:text-gray-300">
                            H E P H A E S T U S
                        </a>
                    </div>

                    <ul className="mt-4 ml-6 mr-6">
                        <span className="text-gray-400 font-bold">ADMIN</span>
                        <li className="mb-1 group">
                            <Link
                                href="/adminstaff/dashboard"
                                className={`flex w-full font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-600 hover:text-gray-100 rounded-md ${pathname === '/adminstaff/dashboard' ? 'bg-black text-white' : ''}`}
                            >
                                <i className="bx bxl-blogger mr-3 text-lg" />
                                <span className="text-sm">Dashboard</span>
                            </Link>
                        </li>
                        <li className="mb-1 group">
                            <Link
                                href="/adminstaff/staffTable"
                                className={`flex w-full font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-600 hover:text-gray-100 rounded-md ${pathname === '/adminstaff/staffTable' ? 'bg-black text-white' : ''}`}
                            >
                                <i className="bx bxl-blogger mr-3 text-lg" />
                                <span className="text-sm">Staff</span>
                            </Link>
                        </li>
                        <li className="mb-1 group">
                            <button
                                onClick={toggleProductsDropdown}
                                className="flex w-full font-semibold items-center py-2 px-4 text-gray-900 hover:text-gray-100 hover:bg-gray-600 rounded-md"
                            >
                                <i className="bx bx-user mr-3 text-lg" />
                                <span className="text-sm">Products</span>
                                <i
                                    className={`ri-arrow-right-s-line ml-auto ${isProductsDropdownOpen ? "rotate-90" : ""}`}
                                />
                            </button>
                            <ul
                                className={`pl-7 mt-2 ${isProductsDropdownOpen ? "block" : "hidden"}`}
                            >
                                <li className="mb-4">
                                    <Link
                                        href="/adminstaff/Diamond"
                                        className={`text-gray-800 text-sm py-2 px-3 flex items-center hover:bg-gray-600 hover:text-white rounded-md ${pathname === '/adminstaff/Diamond' ? 'bg-black text-white' : ''}`}
                                    >
                                        - Diamond
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        href="/adminstaff/Jewelry"
                                        className={`text-gray-800 text-sm py-2 px-3 flex items-center hover:bg-gray-600 hover:text-white rounded-md ${pathname === '/adminstaff/Jewelry' ? 'bg-black text-white' : ''}`}
                                    >
                                        - Jewelry
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            {/* Main content */}
            <div className={`flex-1 
                        ${isOpen ? 'ml-0' : 'ml-0'}`}>
                <div className="ml-auto">
                    <button
                        className="bg-white hover:bg-gray-200 
                       text-black font-bold py-2 px-4"
                        onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
