'use client'

import React, { useEffect, useState } from "react";
import { Diamond, columns } from './diamondTable';
import { DataTable } from "@/components/data-table";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";
import AuthGuard from "@/components/auth-guard";
import NavbarStaff from "@/components/TopNav";

export default function DiamondPage() {
    const productManager = new AddProductUtils();
    const [data, setData] = useState([]);

    const fetchDiamonds = async () => {
        const response = await productManager.fetchAllDiamonds();
        setData(response?.data);
    }

    useEffect(() => {
        fetchDiamonds();
    }, []);

    return (
        <AuthGuard allowedRoles={['ROLE_SALESTAFF', 'ROLE_ADMIN']}>
            <NavbarStaff />
            <section className="py-24">
                <div className="container">
                    <DataTable
                        columns={columns}
                        data={data}
                    />
                </div>
            </section>
        </AuthGuard>
    )
}
