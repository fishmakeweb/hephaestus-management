import React, { useState } from 'react';
import StaffManage from '@/dbUtils/Admin/StaffManage';

interface AddStaffFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onClose, onSuccess }) => {
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'ROLE_SALESTAFF'
  });

  const staffManager = new StaffManage();

  const handleChangeAddUser = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await staffManager.addStaff(newUser.fullName, newUser.email, newUser.username, newUser.password, newUser.role);
      setNewUser({
        fullName: '',
        email: '',
        username: '',
        password: '',
        role: 'ROLE_SALESTAFF'
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add Staff</h2>
        <form onSubmit={handleAddUserSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">Full Name</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="fullName"
              value={newUser.fullName}
              onChange={handleChangeAddUser}
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChangeAddUser}
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChangeAddUser}
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChangeAddUser}
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
            <select
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="role"
              value={newUser.role}
              onChange={handleChangeAddUser}
            >
              <option value="ROLE_SALESTAFF">Sales</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffForm;
