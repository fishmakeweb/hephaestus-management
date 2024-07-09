'use client'; 

import StaffManage from '@/dbUtils/Admin/StaffManage';
import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/auth-guard';
import NavbarStaff from '@/components/TopNav';
import StaffTable from './StaffTable';
import AddStaffForm from './AddStaffForm';
import UpdateStaffForm from './UpdateStaffForm';

// Define the Staff interface
interface Staff {
  staffId: string;
  fullName: string;
  email: string;
  username: string;
  role: {
    roleName: string;
  };
}

export default function Page() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addingUser, setAddingUser] = useState(false);

  const staffManager = new StaffManage();

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
    try {
      await staffManager.deleteStaff(staffId);
      setStaffList(prevStaffList => prevStaffList.filter(staff => staff.staffId !== staffId));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const handleUpdateUser = (staff: Staff) => {
    setEditingStaff(staff);
    setModalOpen(true);
  };

  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN']}>
      <NavbarStaff />
      <div className="text-center mt-4">
        <h1 className="text-3xl font-bold mb-4">Staff Management</h1>
        <div className="flex justify-end my-4 mx-40">
          <button
            className="bg-black text-white font-bold py-2 px-4 rounded"
            onClick={() => setAddingUser(true)}
          >
            Add Staff +
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
    </AuthGuard>
  );
}
