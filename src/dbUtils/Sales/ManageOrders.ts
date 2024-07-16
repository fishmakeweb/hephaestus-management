import { Category, Material, Shape, Size } from "@/dbUtils/jewelryAPI/types";
import { Diamond } from "@/app/adminstaff/(product)/Diamond/diamondTable";
import axios from "@/dbUtils/axiosAuth";

export interface OrderStatus {
  statusId: number;
  statusDescription: string;
}

export interface Order {
  orderId: number;
  username: string;
  orderDate: string;
  orderStatus: OrderStatus;
  totalPrice: number;
}

interface CustomJewelry {
  customJewelryId: number;
  diamond: Diamond;
  material: Material;
  category: Category;
  size: Size;
  shape: Shape;
  price: number;
  note: string;
}

export interface CustomOrder {
  customOrderId: number;
  username: string;
  orderStatus: OrderStatus;
  customJewelry: CustomJewelry;
  prepaid: number;
  fullpaid: number;
  description: string;
  startDate: Date;
  finishDate: Date | null;
}

// SECURE DONE
export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const response = await axios.get<Order[]>("/adminsale/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

// SECURE DONE
export async function fetchAllCustomOrders(): Promise<CustomOrder[]> {
  try {
    const response = await axios.get<CustomOrder[]>("/adminsale/custom-orders");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch custom orders: ", error);
    throw error;
  }
}

export async function updateAtr(
  customOrderId: number,
  fullPaid: any,
  description: any,
  finishDate: any
) {
  try {
    const updateData = {
      fullPaid: fullPaid,
      finishDate: finishDate,
      description: description,
    };
    await axios.put(
      `/sale/updateAtr/${customOrderId}`,
      updateData
    );
    
  } catch (error) {
    console.error("Error updating order:", error);
    console.log(customOrderId);
  }
}

// SECURE DONE
export async function verifyOrders(customOrderId: number) {
  try {
    await axios.post(
      `/sale/confirmCustomOrder/${customOrderId}`
    );
  } catch (error) {
    console.error("Error verifying order:", error);
  }
}

// SECURE DONE
export async function verifyCancelOrders(customOrderId: number) {
  try {
    await axios.post(
      `/sale/confirmCancelCustomOrder/${customOrderId}`
    );
  } catch (error) {
    console.error("Error verifying cancel order:", error);
  }
}

export async function filterCOrders(
  orderStatusId: number
): Promise<CustomOrder[]> {
  try {
    console.log(`Calling backend with orderStatusId: ${orderStatusId}`);
    const response = await axios.get<CustomOrder[]>(
      `/filter-custom-orderstatus/${orderStatusId}`
    );
    console.log("Backend response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error filtering orders:", error);
    throw error;
  }
}
