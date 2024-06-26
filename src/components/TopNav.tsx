import React, { useState, useRef, useEffect } from "react";
import AuthService from "@/dbUtils/Auth/AuthService";
import { useRouter, usePathname } from "next/navigation";
import {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"; // Adjust the import path accordingly
import { X } from "lucide-react"; // Make sure this import matches your setup
import Link from 'next/link'; // Ensure you're using the correct Link component from your setup

const NavbarStaff: React.FC<{}> = () => {
    const staff = JSON.parse(localStorage.getItem('user') || '{}');

    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState<boolean>(false);
    const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState<boolean>(false);
    const userMenuRef = useRef<HTMLLIElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        router.push("/");
    };

    const onToggleSidebar = () => {
        setIsSheetOpen(!isSheetOpen);
    };

    const toggleProductsDropdown = () => {
        setIsProductsDropdownOpen(!isProductsDropdownOpen);
    };

    const toggleSalesDropdown = () => {
        setIsSalesDropdownOpen(!isSalesDropdownOpen);
    };


    return (
        <div className="py-2 px-6 bg-white flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
            <button
                type="button"
                className="text-lg text-gray-900 font-semibold sidebar-toggle"
                onClick={onToggleSidebar}
            >
                ☰
            </button>
            <button className="flex-1 text-center ml-32 text-2xl font-bold text-gray-900">
                H E P H A E S T U S
            </button>
            <ul className="ml-auto flex items-center">
                {/* User Menu Dropdown */}
                <li className="dropdown ml-3 relative" ref={userMenuRef}>
                    <button
                        type="button"
                        className="dropdown-toggle flex items-center"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-8 h-8 rounded block object-cover align-middle">
                            <path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 
                            192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM128 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM80 432c0-44.2 35.8-80 80-80h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16z" />
                        </svg>
                        <div className="p-2 md:block text-left">
                            <h2 className="text-base font-semibold text-gray-800">{staff.fullName}</h2>
                            <p className="text-xs text-gray-500">{staff.role.roleName}</p>
                        </div>
                    </button>
                    {isUserMenuOpen && (
                        <ul className="dropdown-menu absolute top-full right-0 mt-1 shadow-md shadow-black/5 z-30 py-1.5 rounded-md bg-white border border-gray-100 w-48">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-800 hover:text-black hover:bg-gray-100"
                                >
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-800 hover:text-black hover:bg-gray-100"
                                >
                                    Settings
                                </a>
                            </li>
                            <li>
                                <button
                                    role="menuitem"
                                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </button>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>H E P H A E S T U S</SheetTitle>
                    </SheetHeader>
                    <SheetDescription>
                        {AuthService.isAdmin() && (
                            <ul className="mt-4">
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
                                <span className="text-gray-400 font-bold">PERSONAL</span>
                                <li className="mb-1 group">
                                    <a
                                        href=""
                                        className={`flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-600 hover:text-gray-100 rounded-md ${pathname === '/calendar' ? 'bg-black text-white' : ''}`}
                                    >
                                        <i className="ri-calendar-event-line mr-3 text-lg" />
                                        <span className="text-sm">Calendar</span>
                                    </a>
                                </li>
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
                        )}
                        {AuthService.isSales() && (
                            <ul className="mt-4">
                                <span className="text-gray-400 font-bold">SALES</span>
                                <li className="mb-1 group">
                                    <a
                                        href=""
                                        className={`flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-600 hover:text-gray-100 rounded-md ${pathname === '/salestaff' ? 'bg-black text-white' : ''}`}
                                    >
                                        <i className="ri-home-2-line mr-3 text-lg" />
                                        <span className="text-sm">Messages</span>
                                    </a>
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
                                                href="/viewDiamond"
                                                className={`text-gray-800 text-sm py-2 px-3 flex items-center hover:bg-gray-600 hover:text-white rounded-md ${pathname === '/viewDiamond' ? 'bg-black text-white' : ''}`}
                                            >
                                                - View Diamond
                                            </Link>
                                        </li>
                                        <li className="mb-4">
                                            <Link
                                                href="/viewJewelry"
                                                className={`text-gray-800 text-sm py-2 px-3 flex items-center hover:bg-gray-600 hover:text-white rounded-md ${pathname === '/viewJewelry' ? 'bg-black text-white' : ''}`}
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
                                        className={`flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-600 hover:text-gray-100 rounded-md ${pathname === '/calendar' ? 'bg-black text-white' : ''}`}
                                    >
                                        <i className="ri-calendar-event-line mr-3 text-lg" />
                                        <span className="text-sm">Calendar</span>
                                    </a>
                                </li>
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
                        )}
                        <SheetClose className="absolute top-4 right-4">
                            <X className="h-4 w-4" />
                        </SheetClose>
                    </SheetDescription>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default NavbarStaff;
