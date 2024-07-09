"use client"

import React from 'react';
import FormAddDiamond from '@/app/adminstaff/(addproduct)/adddiamond/formAddDiamond';
import AuthGuard from '@/components/auth-guard';

const AddDiamond = () => {
  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN']}>
        <FormAddDiamond />
    </AuthGuard>
  )
}

export default AddDiamond