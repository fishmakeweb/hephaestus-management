import axios from '@/dbUtils/axios';

class AddProductUtils {

    async fetchAllDiamondAtribute() {
        try {
            const response = await axios.get("/diamonds/all");
            return response;
        } catch (error) {
            console.error('Error fetching diamonds: ', error);
        }
    }

    async handleFileChange(event: any) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrl = response.data; 
            return imageUrl;
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
    }

    async saveDiamondToDB( measurement: any, color: any, cut: any, carat: any, clarity: any, gia: any, price: any, img: any) {
        const diamondData = {
            measurement: { measurementId: measurement },
            color: { colorId: color },
            cut: { cutId: cut },
            carat: { caratId: carat },
            clarity: { clarityId: clarity },
            gia: { issueDate: gia },
            price: price,
            img: img,
        };
        try {
            const response = await axios.post("/secure/diamonds", diamondData);
            console.log('Save diamond successfull: ', response);
            return true;
        } catch (error) {
            console.error("Add diamond failed:", error);
            return false;
        }
    };

    async updateDiamondStatus(diamondId:any){
        try {
            const response = await axios.put(`/secure/set/diamonds/${diamondId}`);
            console.log('Update diamond status successfull: ', response);
            return true;
        } catch (error) {
            console.error("Update diamond status failed:", error);
            return false;
        }
    }
    async fetchAllJewelryAtribute() {
        try {
            const response = await axios.get("/jewelry/all");
            return response;
        } catch (error) {
            console.error('Error fetching jewelry attributes: ', error);
        }
    }

    async fetchAllDiamonds() {
        try {
            const response = await axios.get("/diamonds");
            return response;
        } catch (error) {
            console.error('Error fetching jewelry attributes: ', error);
        }
    }

    async jewelryUniqueName(jewelryName: any) {
        try {
            const response = await axios.get(`/jewelry/check-name/${jewelryName}`);
            return response;
        } catch (error) {
            console.error("Error checking jewelry name:", error);
        }
    }

    async saveJewelryToDB(jewelryName: any, jewelryUrl: any, jewelryPrice: any, jewelryQuantity: any, selectedMaterial: any, selectedCategory: any, selectedSize: any, selectedDiamond: any, selectedShape:any) {
        const jewelryData = {
            name: jewelryName,
            img: jewelryUrl,
            price: jewelryPrice,
            quantity: jewelryQuantity,
            date: new Date(), // Add the current date
            material: {
                materialId: selectedMaterial,
            },
            shape: {
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
            const response = await axios.post("/secure/jewelry", jewelryData);
            console.log('Save jewelry successfull: ', response);
            return true;
        } catch (error) {
            console.error("Add jewelry failed:", error);
        }
    }
    

}

export default AddProductUtils;