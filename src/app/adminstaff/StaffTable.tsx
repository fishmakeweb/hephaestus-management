import React, { useState } from "react";

interface Staff {
  staffId: string;
  fullName: string;
  email: string;
  username: string;
  role: {
    roleName: string;
  };
}

interface UsersTableProps {
  staffList: Staff[];
  onDelete: (staffId: string) => void;
  onUpdate: (staff: Staff) => void;
}

const StaffTable: React.FC<UsersTableProps> = ({ staffList, onDelete, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = staffList.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(staffList.length / rowsPerPage);

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
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Staff ID</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Full Name</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Username</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 bg-black text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">Action</th>
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
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StaffTable;
