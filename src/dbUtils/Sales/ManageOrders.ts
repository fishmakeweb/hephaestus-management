import { Category, Material, Shape, Size } from "@/app/adminstaff/(addproduct)/addJewelry/formAddJewelry";
import { Diamond } from "@/app/adminstaff/(addproduct)/addJewelry/formAddJewelry";
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
const getToken = () => sessionStorage.getItem("token");

// SECURE DONE
export async function fetchAllOrders(): Promise<Order[]> {
    try {
        const response = await axios.get<Order[]>('/orders',
            {
                headers: { Authorization: `Bearer ${getToken()}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

// SECURE DONE
export async function fetchAllCustomOrders(): Promise<CustomOrder[]>{
    try{
        const response = await axios.get<CustomOrder[]>('/custom-orders',
            {
                headers: { Authorization: `Bearer ${getToken()}` },
            }
        );
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
        await axios.put(`/custom-orders/updateAtr/${customOrderId}`, updateData,
            {
                headers: { Authorization: `Bearer ${getToken()}` },
            }
        );
    } catch (error) {
        console.error('Error updating order:', error);
    }
};

// SECURE DONE
export async function verifyOrders(customOrderId : number) {
    try {
        const token = getToken();
        await axios.post(`/confirmCustomOrder/${customOrderId}`,{}, {
            headers: { Authorization: `Bearer ${token}` },
          });
    } catch (error) {
        console.error('Error verifying order:', error);
    }
}

// SECURE DONE
export async function verifyCancelOrders(customOrderId : number) {
    try {
        const token = getToken();
        await axios.post(`/confirmCancelCustomOrder/${customOrderId}`,{}, {
            headers: { Authorization: `Bearer ${token}` },
          });
    } catch (error) {
        console.error('Error verifying cancel order:', error);
    }
}

export async function filterCOrders(orderStatusId : number) : Promise<CustomOrder[]> {
    try {
        const response = await axios.get<CustomOrder[]>(`/custom-orders/filter-custom-orderstatus/${orderStatusId}`);
        return response.data;
    } catch (error) {
        console.error('Error verifying order:', error);
        throw error;
    }
}
