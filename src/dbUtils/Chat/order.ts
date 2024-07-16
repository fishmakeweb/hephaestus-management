import axios from "@/dbUtils/axiosAuth";



export interface CusOrderMessageDTO{
  customOrderId: string;
  username: string;
  startDate: string;
  finishDate: string;
  orderStatus: string;
  prepaid: number;
  fullpaid: number;
}
export interface OrderMessageDTO{
  orderId: number;
  username: string;
  orderStatus: string;
  orderDate: string;
  totalPrice: number;
}

export const fetchOrderMessage = async () : Promise<OrderMessageDTO[]> => {
  const response = await axios.get<OrderMessageDTO[]>(`/chat/orderlist`);
  return response.data;
}

export const fetchCusOrderMessage = async () : Promise<CusOrderMessageDTO[]> => {
  const response = await axios.get<CusOrderMessageDTO[]>(`/chat/customorderlist`);
  return response.data;
}