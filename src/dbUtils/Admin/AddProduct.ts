// import axios from "@/dbUtils/axios";
import axios from "@/dbUtils/axiosAuth";
import { isNullOrEmptyOrBlank } from "./ManageProducts";

class AddProductUtils {
  async fetchAllDiamondAtribute() {
    try {
      // SECURE DONE
      const response = await axios.get("/adminsale/diamonds/all");
      return response;
    } catch (error) {
      console.error("Error fetching diamonds: ", error);
    }
  }

  // SECURE DONE
  async handleFileChange(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/admin/upload", formData, {
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

  // SECURE DONE
  async saveDiamondToDB(
    measurement: any,
    color: any,
    cut: any,
    carat: any,
    clarity: any,
    gia: any,
    price: any,
    img: any
  ) {
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
      const response = await axios.post("/admin/diamonds", diamondData);
      console.log("Save diamond successfull: ", response);
      return true;
    } catch (error) {
      console.error("Add diamond failed:", error);
      return false;
    }
  }

  //SECURE DONE
  async updateDiamondStatus(diamondId: any) {
    try {
      const response = await axios.put(`/admin/set/diamonds/${diamondId}`);
      console.log("Update diamond status successfull: ", response);
      return true;
    } catch (error) {
      console.error("Update diamond status failed:", error);
      return false;
    }
  }

  // SECURE DONE
  async fetchAllJewelryAtribute() {
    try {
      const response = await axios.get("/adminsale/jewelry/all");
      return response;
    } catch (error) {
      console.error("Error fetching jewelry attributes: ", error);
    }
  }

  // SECURE DONE
  async fetchAllDiamonds() {
    try {
      const response = await axios.get("/public/diamonds");
      return response;
    } catch (error) {
      console.error("Error fetching jewelry attributes: ", error);
    }
  }

  // NO SECURE
  async jewelryUniqueName(jewelryName: any) {
    try {
      const response = await axios.get(
        `/admin/jewelry/check-name/${jewelryName}`
      );
      return response;
    } catch (error) {
      console.error("Error checking jewelry name:", error);
    }
  }

  async saveJewelryToDB(
    jewelryName: any,
    jewelryUrl: any,
    jewelryPrice: any,
    jewelryQuantity: any,
    selectedMaterial: any,
    selectedCategory: any,
    selectedSize: any,
    selectedDiamond: any,
    selectedShape: any
  ) {
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
      const response = await axios.post("/admin/jewelry", jewelryData);
      if (!isNullOrEmptyOrBlank(selectedDiamond)) {
        const dresponse = await axios.put(
          `/secure/set/diamonds/${selectedDiamond}`
        );
        console.log(dresponse);
      }
      console.log("Save jewelry successfull: ", response);
      return true;
    } catch (error) {
      console.error("Add jewelry failed:", error);
    }
  }
}

export default AddProductUtils;
