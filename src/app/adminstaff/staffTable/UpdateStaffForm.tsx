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

  const validateFullName = (fullName: string): string | null => {
    if (/[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰÝỴỶỸĐđâấầẩẫậăắằẳẵặêếềểễệôốồổỗộơớờởỡợưứừửữựỲỴỶỸýỳỷỹ ]/.test(fullName)) {
      return 'Không được phép có ký tự đặc biệt.';
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return 'Vui lòng nhập email.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      return 'Email không hợp lệ.';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let error = null;

    if (name === 'fullName') {
      error = validateFullName(value);
    } else if (name === 'email') {
      error = validateEmail(value);
    }

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
      console.error('Lỗi khi cập nhật nhân viên:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Chỉnh Sửa Nhân Viên</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">Họ và Tên</label>
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">Vai Trò</label>
            <select
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="role"
              value={staff.role.roleName}
              onChange={handleChange}
              required
            >
              <option value="ROLE_ADMIN">Quản Trị Viên</option>
              <option value="ROLE_SALESTAFF">Nhân Viên Bán Hàng</option>
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg mr-2"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStaffForm;
