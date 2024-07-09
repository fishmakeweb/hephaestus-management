import React from "react";
import DataCard from "./DataCard";

type DataRibbonProps = {
  totalSales: number;
  totalValue: string;
  avgValue: string;
  totalCustomer: number;
};

const DataRibbon: React.FC<DataRibbonProps> = ({ totalSales, totalValue, avgValue, totalCustomer }) => {
  return (
    <div className="flex ml-10 mt-4 justify-center items-center space-x-8">
      <DataCard title="Total Sales" value={totalSales} />
      <DataCard title="Total Value" value={totalValue} />
      <DataCard title="Avg Order Value" value={avgValue} />
      <DataCard title="Customers" value={totalCustomer} />
    </div>
  );
}

export default DataRibbon;
