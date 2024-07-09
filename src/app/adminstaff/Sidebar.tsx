// Sidebar.tsx
import React, { useState, useRef, useEffect } from "react";
import AuthService from "@/dbUtils/Auth/AuthService";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import Link from 'next/link';

const Sidebar: React.FC = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState<boolean>(false);
    const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState<boolean>(false);
    const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    // State to manage the open/close state of the sidebar
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const onToggleSidebar = () => {
        setIsSheetOpen(!isSheetOpen);
    };

    const toggleProductsDropdown = () => {
        setIsProductsDropdownOpen(!isProductsDropdownOpen);
    };

    const toggleSalesDropdown = () => {
        setIsSalesDropdownOpen(!isSalesDropdownOpen);
    };

    const toogleOrderDropdown = () => {
        setIsOrdersDropdownOpen(!isOrdersDropdownOpen);
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
                                <a
                                    href="#"
                                    className={`flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-600 hover:text-gray-100 rounded-md ${pathname === '/' ? 'bg-black text-white' : ''}`}
                                >
                                    <i className="ri-home-2-line mr-3 text-lg" />
                                    <span className="text-sm">Dashboard</span>
                                </a>
                            </li>
                            <li className="mb-1 group">
                                <Link
                                    href="/adminstaff"
                                    className={`flex w-full font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-600 hover:text-gray-100 rounded-md ${pathname === '/adminstaff' ? 'bg-black text-white' : ''}`}
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
                                            href="/adminstaff/adddiamond"
                                            className={`text-gray-800 text-sm py-2 px-3 flex items-center hover:bg-gray-600 hover:text-white rounded-md ${pathname === '/adminstaff/adddiamond' ? 'bg-black text-white' : ''}`}
                                        >
                                            - Diamond
                                        </Link>
                                    </li>
                                    <li className="mb-4">
                                        <Link
                                            href="/adminstaff/addJewelry"
                                            className={`text-gray-800 text-sm py-2 px-3 flex items-center hover:bg-gray-600 hover:text-white rounded-md ${pathname === '/adminstaff/addJewelry' ? 'bg-black text-white' : ''}`}
                                        >
                                            - Jewelry
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="mb-1 group">
                                <button
                                    onClick={toggleSalesDropdown}
                                    className="flex w-full font-semibold items-center py-2 px-4 text-gray-900 hover:text-gray-100 hover:bg-gray-600 rounded-md"
                                >
                                    <i className="bx bx-user mr-3 text-lg" />
                                    <span className="text-sm">View Products</span>
                                    <i
                                        className={`ri-arrow-right-s-line ml-auto ${isSalesDropdownOpen ? "rotate-90" : ""}`}
                                    />
                                </button>
                                <ul
                                    className={`pl-7 mt-2 ${isSalesDropdownOpen ? "block" : "hidden"}`}
                                >
                                    <li className="mb-4">
                                        <Link
                                            href="/adminstaff/viewdiamond"
                                            className={`text-gray-800 text-sm py-2 px-3 flex items-center hover:bg-gray-600 hover:text-white rounded-md ${pathname === '/viewproduct/viewdiamond' ? 'bg-black text-white' : ''}`}
                                        >
                                            - View Diamond
                                        </Link>
                                    </li>
                                    <li className="mb-4">
                                        <Link
                                            href="/adminstaff/viewjewelry"
                                            className={`text-gray-800 text-sm py-2 px-3 flex items-center hover:bg-gray-600 hover:text-white rounded-md ${pathname === '/viewproduct/viewjewelry' ? 'bg-black text-white' : ''}`}
                                        >
                                            - View Jewelry
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <span className="text-gray-400 font-bold">PERSONAL</span>
                            <li className="mb-1 group">
                                <a
                                    href=""
                                    className={`flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-600 hover:text-gray-100 rounded-md ${pathname === '/accountsettings' ? 'bg-black text-white' : ''}`}
                                >
                                    <i className="ri-settings-2-line mr-3 text-lg" />
                                    <span className="text-sm">Account Settings</span>
                                </a>
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
