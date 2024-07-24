import axios from "@/dbUtils/axiosAuth";

interface Size {
  sizeId: number;
  type: string;
  sizeNumber: number;
  unit: string;
}

interface Material {
  materialId: number;
  materialName: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

interface Jewelry {
  jewelryId: number;
  diamond: null | any;
  name: string;
  material: Material;
  category: Category;
  size: Size;
  img: string;
  price: number;
  quantity: number;
  date: string;
}

interface Product {
  productId: number;
  diamond: null | any;
  jewelry: Jewelry;
}

export interface OrderDetail {
  id: number;
  jewelry: Jewelry;
  orderId: number;
  quantity: number;
}

interface OrderStatus {
  statusId: number;
  statusDescription: string;
}

export interface OrderData {
  orderId: number;
  username: string;
  orderDate: string;
  orderStatus: OrderStatus;
  totalPrice: number;
}

export const fetchOrder = async (): Promise<OrderData[]> => {
  const response = await axios.get<OrderData[]>("/customer/getorder");
  return response.data;
};

export const fetchOrderDetail = async (orderId: number): Promise<OrderDetail[]> => {
  const response = await axios.get<OrderDetail[]>(`/public/order_details/${orderId}`);
  return response.data;
};

export const fetchCustomerProfileByUsername = async (username: string) => {
  const response = await axios.get(`/adminsale/customer-profile?username=${username}`);
  return response.data;

};