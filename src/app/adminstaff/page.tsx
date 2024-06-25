'use client'

import StaffManage from '@/dbUtils/Admin/StaffManage';
import React, { useState, useEffect } from 'react';
import AuthService from '@/dbUtils/Auth/AuthService';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';

const StaffPage = () => {
  const router = useRouter();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'ROLE_ADMIN' // Default role
  });

  const staffManager = new StaffManage();

  interface Staff {
    staffId: string;
    fullName: string;
    email: string;
    username: string;
    role: {
      roleName: string;
    };
  }

  useEffect(() => {
    document.title = "Admin Page";
    fetchStaffs();
  }, []);

  async function fetchStaffs() {
    try {
      const staffs = await staffManager.fetchStaffs();
      setStaffList(staffs);
    } catch (error) {
      console.error('Error fetching staffs:', error);
    }
  }

  const handleDelUser = async (staffId: string) => {
    await staffManager.deleteStaff(staffId);
    fetchStaffs();
  };

  const handleUpdateUser = (staff: Staff) => {
    setEditingStaff(staff);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      const { staffId, fullName, email, role } = editingStaff;
      await staffManager.updateStaff(staffId, fullName, email, role.roleName);
      setModalOpen(false);
      fetchStaffs();
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingStaff) {
      const { name, value } = e.target;
      setEditingStaff({
        ...editingStaff,
        [name]: name === 'role' ? { roleName: value } : value
      });
    }
  };

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
      await staffManager.addStaff(newUser.fullName, newUser.email, newUser.username, newUser.password, newUser.role); // Call addStaff function with username and password
      setAddingUser(false);
      setNewUser({  // Reset the form fields after submission
        fullName: '',
        email: '',
        username: '',
        password: '',
        role: 'ROLE_SALE'
      });
      fetchStaffs(); // Refresh the staff list
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  return (
    <AuthGuard>
      <div>
        <h1>Staff List</h1>
        <button
          onClick={handleLogout}
        >
          Logout
        </button>

        <div className="mt-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setAddingUser(true)}
          >
            Add User
          </button>
        </div>

        {addingUser && (
          <div className="mt-4">
            <h2>Add User</h2>
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
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_SALESTAFF">Sales</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mr-2 rounded"
                  onClick={() => setAddingUser(false)}
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
        )}

        {/* Existing Staff List */}
        <div className="mt-8">
          <table className="min-w-full divide-y divide-gray-200 border-collapse border border-black w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Staff ID</th>
                <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map(staff => (
                <tr key={staff.staffId} className="bg-white">
                  <td className="px-6 py-4 whitespace-no-wrap">{staff.staffId}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{staff.fullName}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{staff.email}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{staff.username}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{staff.role.roleName}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <button
                      className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
                      onClick={() => handleUpdateUser(staff)}
                    >
                      Update
                    </button>
                    <button
                      className="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDelUser(staff.staffId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Update */}
        {modalOpen && editingStaff && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-1/3">
              <h2 className="text-xl mb-4">Edit Staff</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">Full Name</label>
                  <input
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    type="text"
                    name="fullName"
                    value={editingStaff.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                  <input
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    type="email"
                    name="email"
                    value={editingStaff.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    name="role"
                    value={editingStaff.role.roleName}
                    onChange={handleChange}
                  >
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_SALESTAFF">Sales</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mr-2 rounded"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

export default StaffPage;
