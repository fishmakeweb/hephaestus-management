"use client"

import React from 'react';
import FormAddJewelry from '@/app/adminstaff/(AddProduct)/addJewelry/formAddJewelry';
import AuthGuard from '@/components/auth-guard';

const AddJewelry = () => {
  return (
    <AuthGuard allowedRoles={['ROLE_ADMIN']}>
        <FormAddJewelry />
    </AuthGuard>
  )
}

export default AddJewelry;