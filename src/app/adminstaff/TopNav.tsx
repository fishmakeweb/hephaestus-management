import React, { useState, useRef, useEffect } from "react";
import AuthService from "@/dbUtils/Auth/AuthService";
import { useRouter, usePathname } from "next/navigation";

const NavbarStaff: React.FC<{}> = () => {
    const staff = JSON.parse(sessionStorage.getItem('user') || '{}');

    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
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
    return (
        <div className="bg-white flex justify-between shadow-md shadow-black/5 sticky top-0 left-0 w-full">
            <div className="w-full flex justify-center">
            <button className="text-center text-2xl font-bold text-gray-900">
                H E P H A E S T U S
            </button>
            </div>
            <ul className="mr-8 items-center">
                <li className="dropdown ml-3 relative" ref={userMenuRef}>
                    <button
                        type="button"
                        className="dropdown-toggle flex items-center"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        
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
        </div>
    );
};

export default NavbarStaff;
