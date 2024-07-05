import axios from '@/dbUtils/axios';

class ManageProductUtils {
    async fetchJewelryPagination(page: number) {
        try {
            const response = await axios.get(`/jewelry/page?page=${page}&size=8`);
            return response;
        } catch (error) {
            console.error("Failed to fetch jewelry data: ", error);
        }
    }

    async deleteJewelry(jewelryId: any) {
        try {
            await axios.delete(`/secure/jewelry/${jewelryId}`);
        } catch (error) {
            console.error("Failed to delete jewelry: ", error);
        }
    }

    async findJewelry(jewelryId: any) {
        try {
            const response = await axios.get(`/jewelry/${jewelryId}`);
            return response;
        } catch (error) {
            console.error("Failed to find jewelry: ", error);
        }
    }

    async updateJewelry(jewelryId: any, jewelryName: any, jewelryUrl: any, jewelryPrice: any, jewelryQuantity: any, selectedMaterial: any,  selectedCategory: any, selectedSize: any, selectedDiamond: any,selectedShape: any) {
        const jewelryData = {
            name: jewelryName,
            img: jewelryUrl,
            price: jewelryPrice,
            quantity: jewelryQuantity,
            date: new Date(), // Add the current date
            material: {
                materialId: selectedMaterial,
            },
            shape:{
                shapeId: selectedShape,
            },
            category: {
                categoryId: selectedCategory,
            },
            size: {
                sizeId: selectedSize,
            },
            diamond: selectedDiamond ? { diamondId: selectedDiamond } : null,
        };
        try {
            const response = await axios.put(`/secure/jewelry/${jewelryId}`, jewelryData);
            console.log("Update jewelry response: ", response.data);
            return true;
        } catch (error) {
            console.error("Failed to update jewelry: ", error);
        }
    }

    async findDiamond(diamondId: any) {
        try {
            const response = await axios.get(`/diamonds/${diamondId}`);
            return response;
        } catch (error) {
            console.error("Failed to find diamond: ", error);
        }
    }

    async updateDiamond(diamondId: any, measurement: any, color: any, cut: any, carat: any, clarity: any, price: any, img: any) {
        const diamondData = {
            measurement: { measurementId: measurement },
            color: { colorId: color },
            cut: { cutId: cut },
            carat: { caratId: carat },
            clarity: { clarityId: clarity },
            price: price,
            img: img,
        };
        try {
            const response = await axios.put(`/secure/diamonds/${diamondId}`, diamondData);
            console.log("Update diamond response: ", response.data);
            return true;
        } catch (error) {
            console.error("Failed to update diamond: ", error);
        };
    }
}

export default ManageProductUtils;