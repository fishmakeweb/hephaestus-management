import axios from '@/dbUtils/axios';

class AddProductUtils {

    async fetchAllDiamondAtr() {
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

            const imageUrl = response.data; // Assuming the API returns the URL in 'imageUrl' field
            return imageUrl;
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
    }

    async saveDiamondToDB(shape: any, measurement: any, color: any, cut: any, carat: any, clarity: any, gia: any, price: any, img: any) {
        const diamondData = {
            shape: { shapeId: shape },
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

    async fetchAllJewelryAtr(){
        try{
            const response = await axios.get("/jewelry/all");
            return response;
        } catch (error) {
            console.error('Error fetching jewelry attributes: ',error);
        }
    }

    async fetchAllDiamonds(){
        try{
            const response = await axios.get("/diamonds");
            return response;
        } catch (error) {
            console.error('Error fetching jewelry attributes: ',error);
        }
    }
}

export default AddProductUtils;