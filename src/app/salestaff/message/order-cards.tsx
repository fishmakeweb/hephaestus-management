import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import Link from "next/link";
import { OrderMessageDTO } from "@/dbUtils/Chat/order";

interface OrderCardsProps {
  orderData: OrderMessageDTO[];
}

const OrderCards: React.FC<OrderCardsProps> = ({ orderData }) => {
  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-h-[50vh] overflow-y-auto mb-8  scrollbar-thin">
      <div className="flex flex-wrap justify-center gap-4">
        {orderData.map((order) => (
          <Card
            key={order.orderId}
            className="w-full bg-white rounded-lg shadow-md"
          >
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-semibold">
                  Mã đơn hàng: {order.orderId}
                </p>
                <p className="text-sm text-default-500">
                  Ngày:{" "}
                  {new Date(order.orderDate).toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-lg font-semibold">
                Trạng thái: {order.orderStatus}
              </p>
              <p className="text-lg font-semibold">
                Tổng giá: {order.totalPrice} VNĐ
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Link
                href={`/salestaff/message/support-order/${order.orderId}`}
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

export default OrderCards;
