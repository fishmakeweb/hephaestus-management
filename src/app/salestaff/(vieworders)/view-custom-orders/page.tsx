"use client";

import CustomOrderTable from "./custom-order-table";

export default function OrderPage() {
  return (
    <>
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold mb-4">View Custom Orders</h1>
      </div>
      <div className="mx-auto max-w-screen-lg">
        <CustomOrderTable />
      </div>
    </>
  );
}
