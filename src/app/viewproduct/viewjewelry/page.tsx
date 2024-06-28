"use client"

import React from 'react';
import AuthGuard from '@/components/auth-guard';
import NavbarStaff from '@/components/TopNav';
import ViewAllJewelry from './viewAllJewelry';

const ViewJewelry = () => {
  return (
    <AuthGuard allowedRoles={['ROLE_SALESTAFF','ROLE_ADMIN']}>
      <div>
      <NavbarStaff />
       <ViewAllJewelry />
      </div>
    </AuthGuard>
  )
}

export default ViewJewelry