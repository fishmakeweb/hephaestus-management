"use client"

import React from 'react';
import NavbarStaff from '@/components/TopNav';
import FormAddJewelry from '@/app/adminstaff/(AddProduct)/addJewelry/formAddJewelry';
import AuthGuard from '@/components/auth-guard';

const AddJewelry = () => {
  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN']}>
    <div>
        <FormAddJewelry />
    </div>
    </AuthGuard>
  )
}

export default AddJewelry;