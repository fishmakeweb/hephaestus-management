"use client"

import AuthGuard from "@/components/auth-guard";
import CustomOrderTable from "./custom-order-table";

export default function OrderPage() {
    return (
        <AuthGuard allowedRoles={['ROLE_SALESTAFF']}>
            <div className="text-center mt-10">
                <h1 className="text-3xl font-bold mb-4">View Custom Orders</h1>
            </div>
            <CustomOrderTable />
        </AuthGuard>
    );
}