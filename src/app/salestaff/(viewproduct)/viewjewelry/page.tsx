"use client"

import React from 'react';
import AuthGuard from '@/components/auth-guard';
import ViewAllJewelry from './viewAllJewelry';

const ViewJewelry = () => {
  return (
    <AuthGuard allowedRoles={['ROLE_SALESTAFF']}>
      <div>
       <ViewAllJewelry />
      </div>
    </AuthGuard>
  )
}

export default ViewJewelry