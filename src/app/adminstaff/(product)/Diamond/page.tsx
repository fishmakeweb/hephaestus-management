'use client'

import React, { useEffect, useState } from "react";
import { DiamondTable } from './diamondTable';
import { DataTable } from "./data-table";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";

export default function DiamondPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const productManager = new AddProductUtils();

        const fetchDiamonds = async () => {
            const response = await productManager.fetchAllDiamonds();
            setData(response?.data);
        };
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
