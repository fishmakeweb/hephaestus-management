import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import Link from "next/link";
import { CusOrderMessageDTO } from "@/dbUtils/Chat/order";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderCardsProps {
  customOrderData: CusOrderMessageDTO[];
}

const CusOrderCards: React.FC<OrderCardsProps> = ({
  customOrderData,

}) => {


  if (!customOrderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-h-[50vh] overflow-y-auto scrollbar-thin">
      <div className="flex flex-wrap justify-center gap-4">
        {customOrderData.map((customOrder) => (
          <Card
            key={customOrder.customOrderId}
            className="w-full bg-white rounded-lg shadow-md"
          >
            <CardHeader className="flex gap-3">
            <div className="flex flex-col">
                  <p className="text-md font-semibold">Order ID: {customOrder.customOrderId}</p>
                  <p className="text-sm text-default-500">Start Date: {customOrder.startDate} . Finish Date: {customOrder.finishDate}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-2">
              <p className="text-lg font-semibold">
                Status: {customOrder.orderStatus}
              </p>
              <p id="fullPaid" className="text-lg font-semibold">
                Prepaid: ${customOrder.prepaid} Fullpaid: ${customOrder.fullpaid}
              </p> 
            </CardBody>
            <Divider />
            <CardFooter>
              <Link
                href={`/salestaff/message/support-custom/${customOrder.customOrderId}`}
                className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded"
              >
                View Support Box
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CusOrderCards;
