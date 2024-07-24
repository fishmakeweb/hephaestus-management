import axios from "@/dbUtils/axiosAuth";
import { Diamond } from "@/app/salestaff/(viewproduct)/viewdiamond/diamondTable";
export interface Category {
    categoryId:number;
    categoryName:string;
}

export interface Material {
    materialId:number;
    materialName:string;
}
export interface Size {
    sizeId:number;
    type:string;
    sizeNumber:number;
    unit:string;
}

export interface Shape {
    shapeId: number;
    shapeDescription: string;
}

export interface CustomJewelry {
    id: number;
    category: Category;
    material: Material;
    diamond: Diamond | null;
    shape: Shape;
    size: Size;
    price: number;
    note: string;
}


interface OrderStatus {
  statusId: number;
  statusDescription: string;
}

export interface CustomOrderData {
  customOrderId: number;
  username: string;
  orderStatus: OrderStatus;
  customJewelry: CustomJewelry;
  prepaid: number;
  fullpaid: number;
  description: string;
  startDate: string;
  finishDate: string;
}


export const fetchOrder = async (): Promise<CustomOrderData[]> => {
  const response = await axios.get<CustomOrderData[]>("/customer/get-customorder");
  return response.data;
};

export const createCustomOrder = async (customJewelry : CustomJewelry) => {
  try {
   const response = await axios.post("/customer/create-customorder", customJewelry);
    return response.data; // Assuming your API returns some data
  } catch (error) {
    console.error("Error creating custom order:", error);
    throw error; // Propagate the error
  }
};

export const fetchCusOrder = async (customOrderId: number): Promise<CustomOrderData> => {
  const response = await axios.get<CustomOrderData>(`/public/custom-orders/${customOrderId}`);
  return response.data;
};

export const deleteCusOrder = async (customOrderId: number) =>{
  try {
    await axios.delete(`/customer/delete-customorder/${customOrderId}`);
  } catch (error) {
    console.error("Lỗi xóa: ", error);
  }
  
}

export const requestCancelCusOrder = async (customOrderId: number) =>{
  try {
    await axios.put(`/customer/request-cancel/${customOrderId}`);
  } catch (error) {
    console.error("Lỗi gửi yêu cầu hủy đơn: ", error)
  }
  
}



