import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

interface DataCardProps {
  title: string;
  value: number | string;
}

const DataCard: React.FC<DataCardProps> = ({ title, value }) => {
  return (
    <Card className="max-w-[400px] bg-white py-2 px-10 border border-solid border-gray-200">
      <CardHeader className="flex">
        <div className="flex flex-col">
          <p className="font-bold">{title}</p>
        </div>
      </CardHeader>
      <CardBody>
        <p className="font-bold">{value}</p>
      </CardBody>
    </Card>
  );
}

export default DataCard;
