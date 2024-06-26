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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl mb-4">Add User</h2>
        <form onSubmit={handleAddUserSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">Full Name</label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              type="text"
              name="fullName"
              value={newUser.fullName}
              onChange={handleChangeAddUser}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChangeAddUser}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChangeAddUser}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChangeAddUser}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              name="role"
              value={newUser.role}
              onChange={handleChangeAddUser}
            >
              <option value="ROLE_SALESTAFF">Sales</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mr-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
