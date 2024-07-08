"use client"

import React from 'react';
import FormAddDiamond from '@/app/adminstaff/adddiamond/formAddDiamond';
import AuthGuard from '@/components/auth-guard';

const AddDiamond = () => {
  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN']}>
    <div>
        <FormAddDiamond />
    </div>
    </AuthGuard>
  )
}

export default AddDiamond