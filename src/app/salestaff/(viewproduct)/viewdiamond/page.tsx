'use client'

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DiamondTable } from './diamondTable';
import { DataTable } from "@/components/data-table";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";

export default function DiamondPage() {
    const productManager = useMemo(() => new AddProductUtils(), []); 
    const [data, setData] = useState([]);

    const fetchDiamonds = useCallback(async () => {
        const response = await productManager.fetchAllDiamonds();
        setData(response?.data);
    }, [productManager]);

    useEffect(() => {
        fetchDiamonds();
    }, [fetchDiamonds]); 

    return (
        <>
            <section className="py-24">
                <div className="container">
                    <DataTable
                        columns={DiamondTable}
                        data={data}
                    />
                </div>
            </section>
        </>
    )
}
