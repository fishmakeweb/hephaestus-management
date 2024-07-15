
import axios from "@/dbUtils/axiosAuth"
import { User } from "lucide-react";

export interface User {
    userId: number;
    fullName: string;
    email: string;
    address: string;
    registeredDate: Date;
    username: string;
}

export interface Category {
    categoryId: number;
    categoryName : string;
    orderCount : number;
    categoryImg : string;
}

export async function fetchAllCustomers(): Promise<User[]> {
    try {
        const response = await axios.get<User[]>('/admin/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await axios.get<Category[]>('/categories/order-count');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function fetchTop1Cate(): Promise<Category> {
    try {
        const response = await axios.get<Category>('/categories/top-order-count');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}
