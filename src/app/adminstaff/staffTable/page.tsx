'use client';

import StaffManage, { Staff } from '@/dbUtils/Admin/StaffManage';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import StaffTable from './StaffTable';
import AddStaffForm from './AddStaffForm';
import UpdateStaffForm from './UpdateStaffForm';

export default function Page() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const staffManager = useMemo(() => new StaffManage(), []);

  const fetchStaffs = useCallback(async () => {
    try {
      const staffs = await staffManager.fetchStaffs();
      const username = sessionStorage.getItem('username') || '';
      const filteredStaffList = staffs.filter((staff : Staff) => staff.username !== username);
      setStaffList(filteredStaffList);
    } catch (error) {
      console.error('Lỗi load nhân viên:', error);
    }
  }, [staffManager]);

  useEffect(() => {
    document.title = "Admin Page";
    fetchStaffs();
  }, [fetchStaffs]);

  const handleDelUser = async (staffId: string) => {
    try {
      await staffManager.deleteStaff(staffId);
      setStaffList(prevStaffList => prevStaffList.filter(staff => staff.staffId !== staffId));
    } catch (error) {
      console.error("Lỗi xóa nhân viên:", error);
    }
  };

  const handleUpdateUser = (staff: Staff) => {
    setEditingStaff(staff);
    setModalOpen(true);
  };
  return (
    <div className="text-center mt-4">
      <h1 className="text-3xl font-bold mb-4">Quản lý nhân viên</h1>
      <div className="flex justify-end my-4 mx-40">
        <button
          className="bg-black text-white font-bold py-2 px-4 rounded"
          onClick={() => setAddingUser(true)}
        >
          Thêm nhân viên +
        </button>
      </div>

      {addingUser && (
        <AddStaffForm
          onClose={() => setAddingUser(false)}
          onSuccess={() => {
            setAddingUser(false);
            fetchStaffs();
          }}
        />
      )}

      <div className="mx-auto max-w-screen-lg">
        <StaffTable
          staffList={staffList}
          onDelete={(staffId) => {
            handleDelUser(staffId);
          }}
          onUpdate={handleUpdateUser}
        />
      </div>

      {modalOpen && editingStaff && (
        <UpdateStaffForm
          editingStaff={editingStaff}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            fetchStaffs();
          }}
        />
      )}
    </div>
  );
}
