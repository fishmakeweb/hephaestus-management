import React, { useState } from 'react';
import StaffManage, { Staff } from '@/dbUtils/Admin/StaffManage';

interface UpdateStaffFormProps {
  editingStaff: Staff;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateStaffForm: React.FC<UpdateStaffFormProps> = ({ editingStaff, onClose, onSuccess }) => {
  const [staff, setStaff] = useState(editingStaff);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const staffManager = new StaffManage();

  const validateInput = (name: string, value: string): string | null => {
    if (name.includes('role')) return null;
    if (/\s/.test(value)) {
      return 'No spaces allowed.';
    }
    if (/[^a-zA-Z0-9@.]/.test(value) && name !== 'fullName') {
      return 'No special characters allowed.';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);

    if (error) {
      setErrors({
        ...errors,
        [name]: error
      });
    } else {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    setStaff({
      ...staff,
      [name]: name === 'role' ? { roleName: value } : value
    });
    console.log(error);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      return;
    }

    try {
      const { staffId, fullName, email, role } = staff;
      await staffManager.updateStaff(staffId, fullName, email, role.roleName);
      onSuccess();
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Staff</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">Full Name</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="fullName"
              value={staff.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              value={staff.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
            <select
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="role"
              value={staff.role.roleName}
              onChange={handleChange}
              required
            >
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_SALESTAFF">Sales</option>
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStaffForm;
