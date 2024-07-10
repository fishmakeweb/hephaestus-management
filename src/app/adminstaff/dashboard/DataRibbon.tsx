import React from "react";
import DataCard from "./DataCard";

type DataRibbonProps = {
  totalSales: number;
  totalRevenue: string;
  avgRevenue: string;
  totalCustomer: number;
};

const DataRibbon: React.FC<DataRibbonProps> = ({ totalSales, totalRevenue, avgRevenue, totalCustomer }) => {
  return (
    <div className="flex ml-10 mt-4 justify-center items-center space-x-8">
      <DataCard title="Total Sales" value={totalSales} />
      <DataCard title="Total Revenue" value={totalRevenue} />
      <DataCard title="Avg Order Revenue" value={avgRevenue} />
      <DataCard title="Customers" value={totalCustomer} />
    </div>
  );
}

export default DataRibbon;
