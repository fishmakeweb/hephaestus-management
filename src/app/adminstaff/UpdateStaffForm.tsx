
import React, {useState} from 'react';
import StaffManage from '@/dbUtils/Admin/StaffManage';

interface UpdateStaffFormProps {
  editingStaff: Staff;
  onClose: () => void;
  onSuccess: () => void;
}

interface Staff {
  staffId: string;
  fullName: string;
  email: string;
  username: string;
  role: {
    roleName: string;
  };
}

const UpdateStaffForm: React.FC<UpdateStaffFormProps> = ({ editingStaff, onClose, onSuccess }) => {
  const [staff, setStaff] = useState(editingStaff);

  const staffManager = new StaffManage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStaff({
      ...staff,
      [name]: name === 'role' ? { roleName: value } : value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { staffId, fullName, email, role } = staff;
      await staffManager.updateStaff(staffId, fullName, email, role.roleName);
      onSuccess();
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  return (
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
              value={staff.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              type="email"
              name="email"
              value={staff.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              name="role"
              value={staff.role.roleName}
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
              onClick={onClose}
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
  );
};

export default UpdateStaffForm;
