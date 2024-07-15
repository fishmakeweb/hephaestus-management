'use client'

import React, { useEffect, useState } from "react";
import { Diamond, DiamondTable } from './diamondTable';
import { DataTable } from "./data-table";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";

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
            <section className="py-24">
                <div className="container">
                    <DataTable
                        columns={DiamondTable}
                        data={data}
                    />
                </div>
            </section>
    )
}
