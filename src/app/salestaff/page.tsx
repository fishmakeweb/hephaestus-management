"use client"

import React from 'react'
import AuthGuard from '@/components/auth-guard';
import NavbarStaff from '@/components/TopNav';

export default function SaleStaff() {
  return (
    <AuthGuard allowedRoles={['ROLE_SALESTAFF']}>
      <div>
      <NavbarStaff />
        <h1>SaleStaff</h1>
      </div>
    </AuthGuard>
  )
}
