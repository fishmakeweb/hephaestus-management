import { Category, Material, Shape, Size } from "@/app/adminstaff/(AddProduct)/addJewelry/formAddJewelry";
import { Diamond } from "@/app/viewproduct/viewdiamond/diamondTable";
import axios from "@/dbUtils/axios";

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
export async function fetchAllOrders(): Promise<Order[]> {
    try {
        const response = await axios.get<Order[]>('/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function fetchAllCustomOrders(): Promise<CustomOrder[]>{
    try{
        const response = await axios.get<CustomOrder[]>('/custom-orders');
        return response.data;
    }catch(error){
        console.error("Failed to fetch custom orders: ", error);
        throw error;
    }
    
}

export async function updateAtr(customOrderId : number ,fullPaid : any, description : any, finishDate: any){
    try {
        const updateData = {
            fullPaid : fullPaid,
            finishDate : finishDate,
            description : description
        };
        await axios.put(`/custom-orders/updateAtr/${customOrderId}`, updateData);
    } catch (error) {
        console.error('Error updating order:', error);
    }
};


export async function verifyOrders(customOrderId : number) {
    try {
        await axios.put(`/custom-orders/verifyOrders/${customOrderId}`);
    } catch (error) {
        console.error('Error verifying order:', error);
    }
}

