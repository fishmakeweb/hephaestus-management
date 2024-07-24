import { Staff } from "@/dbUtils/Admin/StaffManage";
import React, { useState } from "react";

interface UsersTableProps {
  staffList: Staff[];
  onDelete: (staffId: string) => void;
  onUpdate: (staff: Staff) => void;
}

const StaffTable: React.FC<UsersTableProps> = ({ staffList, onDelete, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;

  const username = sessionStorage.getItem('username') || '';
  const filteredStaffList = staffList.filter((s) => s.username !== username);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredStaffList.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredStaffList.length / rowsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelUser = (staffId: string) => {
    onDelete(staffId);
  };

  const handleUpdateUser = (staff: Staff) => {
    onUpdate(staff);
  };

  return (
    <div className="mt-8">
      <table className="min-w-full divide-y divide-gray-200 border-collapse border border-black w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Mã Nhân Viên</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Họ và Tên</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Tên Đăng Nhập</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Vai Trò</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Hành Động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentRows.map((staff) => (
            <tr key={staff.staffId}>
              <td className="px-6 py-3 whitespace-no-wrap">{staff.staffId}</td>
              <td className="px-6 py-3 whitespace-no-wrap">{staff.fullName}</td>
              <td className="px-6 py-3 whitespace-no-wrap">{staff.email}</td>
              <td className="px-6 py-3 whitespace-no-wrap">{staff.username}</td>
              <td className="px-6 py-3 whitespace-no-wrap">{staff.role.roleName}</td>
              <td className="px-6 py-3 whitespace-no-wrap">
                <div className="flex flex-col space-y-2">
                  <button
                    className="inline-block w-[8vw] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleUpdateUser(staff)}
                  >
                    Cập Nhật
                  </button>
                  <button
                    className="inline-block w-[8vw] bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelUser(staff.staffId)}
                  >
                    Xóa
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Trước
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default StaffTable;
