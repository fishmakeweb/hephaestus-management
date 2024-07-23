"use client";

import CustomOrderTable from "./custom-order-table";

export default function OrderPage() {
  return (
    <>
      <div className="pb-5">
        <div className="text-center mt-10">
          <h1 className="text-3xl font-bold mb-4">Xem hóa đơn trang sức chế tác</h1>
        </div>
        <div className="max-w-screen-lg">
          <CustomOrderTable />
        </div>
      </div>
    </>
  );
}
