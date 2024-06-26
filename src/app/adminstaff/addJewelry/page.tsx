"use client"

import React from 'react';
import NavbarStaff from '@/components/TopNav';
import FormAddJewelry from '@/app/adminstaff/addJewelry/formAddJewelry';
import AuthGuard from '@/components/auth-guard';

const AddJewelry = () => {
  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN']}>
    <NavbarStaff />
    <div>
        <FormAddJewelry />
    </div>
    </AuthGuard>
  )
}

export default AddJewelry;