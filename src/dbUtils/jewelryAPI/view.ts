import { Jewelry } from "@/app/adminstaff/(product)/Jewelry/viewAllJewelry";
import axios from "@/dbUtils/axiosAuth";



export async function filterJewelryByCategory(categoryId: number): Promise<Jewelry[]> {
    try {
        const response = await axios.get<Jewelry[]>(`/adminsale/filter-category/${categoryId}`);
        return response.data;
    } catch (err) {
        console.error("Error filtering jewelry by category", err);
        throw err;
    }
}