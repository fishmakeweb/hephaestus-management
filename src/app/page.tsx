"use client";

import { useState } from 'react';
import AuthService from '@/dbUtils/Auth/AuthService';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await AuthService.login(username, password);
      console.log(response);
      if (AuthService.isAuthenticated()) {
        if (AuthService.isStaff()) {
          if (AuthService.isAdmin()) {
            router.push('adminstaff/dashboard');
          } else if (AuthService.isSales()) {
            router.push('salestaff/view-orders');
          }
        }
      } else {
        setUsername('');
        setPassword('');
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      {/* component */}
      <div className="flex h-screen">
        {/* Right Pane */}
        <div className="w-full bg-gray-100 lg:w-full flex items-center justify-center">
          <button className="mx-auto text-2xl font-bold text-gray-900 absolute top-10 left-1/2 transform -translate-x-1/2">
            H E P H A E S T U S
            <br />
            M A N A G E M E N T
          </button>
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Login
            </h1>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Please inform your supervisor if you want accsess.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

