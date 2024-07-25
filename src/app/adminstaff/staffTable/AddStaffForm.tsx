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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

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

  const handleChangeAddUser = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      return;
    }

    try {
      const response = await staffManager.addStaff(newUser.fullName, newUser.email, newUser.username, newUser.password, newUser.role);
      if(response.error){
        setGeneralError(response.error);
        return;
      }
      setNewUser({
        fullName: '',
        email: '',
        username: '',
        password: '',
        role: 'ROLE_SALESTAFF'
      });
      setGeneralError(null);
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi thêm nhân viên:', error);
      setGeneralError('Tên đăng nhập hoặc email đã tồn tại.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Thêm Nhân Viên</h2>
        <form onSubmit={handleAddUserSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">Họ và Tên</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="fullName"
              value={newUser.fullName}
              onChange={handleChangeAddUser}
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
              value={newUser.email}
              onChange={handleChangeAddUser}
              required
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">Tên Đăng Nhập</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChangeAddUser}
              required
            />
            {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Mật Khẩu</label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChangeAddUser}
              required
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">Vai Trò</label>
            <select
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="role"
              value={newUser.role}
              onChange={handleChangeAddUser}
            >
              <option value="ROLE_SALESTAFF">Nhân viên bán hàng</option>
              <option value="ROLE_ADMIN">Quản trị viên</option>
            </select>
          </div>
          {generalError && <div className="text-red-500 text-sm mb-5">{generalError}</div>}
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
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffForm;
