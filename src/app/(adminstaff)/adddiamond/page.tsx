"use client"

import React from 'react';
import NavbarStaff from '@/components/TopNav';
import FormAddDiamond from '@/app/(adminstaff)/adddiamond/formAddDiamond';
import AuthGuard from '@/components/auth-guard';

const AddDiamond = () => {
  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN']}>
    <NavbarStaff />
    <div>
        <FormAddDiamond />
    </div>
    </AuthGuard>
  )
}

export default AddDiamond