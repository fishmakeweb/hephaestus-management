"use client"

import { useState } from 'react';
import AuthService from '@/dbUtils/Auth/AuthService';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(username, password);
      console.log(response);
      if (AuthService.isAuthenticated()) {
        if (AuthService.isStaff()) {
          router.push('/adminstaff');
        } 
      } else {
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <main>
      <h1>Login di</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
