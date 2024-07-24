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

interface OrderCardsProps {
  customOrderData: CusOrderMessageDTO[];
}

const CusOrderCards: React.FC<OrderCardsProps> = ({ customOrderData }) => {
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
                <p className="text-md font-semibold">
                  Mã đơn hàng: {customOrder.customOrderId}
                </p>
                <p className="text-sm text-default-500">
                  Ngày bắt đầu:{" "}
                  {new Date(customOrder.startDate).toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })} .
                  Ngày kết thúc:{" "}
                  {customOrder.finishDate
                    ? new Date(customOrder.finishDate).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    : "No data"}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-2">
              <p className="text-lg font-semibold">
                Trạng thái: {customOrder.orderStatus}
              </p>
              <p id="fullPaid" className="text-lg font-semibold">
                Trả trước: {customOrder.prepaid} VNĐ Trả đủ:
                {customOrder.fullpaid} VNĐ
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Link
                href={`/salestaff/message/support-custom/${customOrder.customOrderId}`}
                className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded"
              >
                Xem hộp hỗ trợ
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CusOrderCards;
