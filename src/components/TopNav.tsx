import React, { useState, useRef, useEffect } from "react";
import AuthService from "@/dbUtils/Auth/AuthService";
import { useRouter } from "next/navigation";

type TopNavProps = {
  role: any;
};
const NavbarStaff: React.FC<TopNavProps> = ({ role }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLLIElement>(null);
  const router = useRouter();
  const name = sessionStorage.getItem("username");

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
            <div className="p-2 md:flex items-center text-left">
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="32.000000pt"
                height="32.000000pt"
                viewBox="0 0 128.000000 128.000000"
                preserveAspectRatio="xMidYMid meet"
                className="mr-2"
              >
                <g
                  transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  stroke="none"
                >
                  <path d="M654 1210 c-81 -12 -153 -40 -192 -74 -55 -48 -75 -103 -83 -236 -5 -63 -11 -134 -15 -158 -6 -40 -2 -48 56 -139 l61 -96 -8 -61 -8 -60 -168 -52 c-92 -28 -170 -54 -173 -57 -3 -3 0 -23 6 -46 19 -70 21 -71 318 -71 l264 0 -6 23 c-3 12 -6 34 -6 48 0 25 -3 27 -62 31 -35 3 -74 11 -88 17 -24 12 -25 15 -22 89 2 42 6 79 8 81 2 2 21 -8 42 -23 59 -41 117 -37 179 13 66 53 93 84 149 171 54 84 52 71 36 280 -9 130 -24 176 -62 203 -11 8 -28 38 -39 68 l-18 54 -59 1 c-32 1 -82 -2 -110 -6z m-39 -226 c51 -4 114 -2 145 4 52 11 56 10 77 -13 23 -26 43 -102 43 -165 0 -21 5 -42 10 -45 16 -10 12 -50 -7 -76 -10 -13 -27 -42 -38 -64 -25 -49 -128 -153 -161 -161 -13 -3 -35 -3 -49 0 -33 8 -134 111 -160 161 -11 22 -28 51 -37 64 -20 26 -24 66 -8 76 6 3 10 32 10 63 1 65 16 140 32 160 7 8 21 11 32 8 12 -4 62 -9 111 -12z" />
                  <path d="M950 511 c-46 -15 -85 -39 -116 -73 -54 -57 -69 -95 -69 -178 0 -83 15 -121 69 -178 53 -57 101 -77 186 -77 57 0 84 5 115 22 47 25 95 74 121 123 26 49 26 171 0 220 -26 49 -74 98 -121 122 -43 22 -144 33 -185 19z m133 -283 l-88 -88 -57 57 c-57 56 -58 58 -39 76 18 18 19 18 60 -7 l42 -27 65 56 c64 54 67 55 86 39 18 -17 16 -20 -69 -106z" />
                </g>
              </svg>
              <div>
                <p className="font-bold">{name}</p>
                <h5 className="text-sm font-semibold text-gray-800">{role}</h5>
                <p className="text-xs text-gray-500"></p>
              </div>
            </div>
          </button>
          {isUserMenuOpen && (
            <ul className="dropdown-menu absolute top-full right-0 mt-1 shadow-md shadow-black/5 z-30 py-1.5 rounded-md bg-white border border-gray-100 w-48">
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
