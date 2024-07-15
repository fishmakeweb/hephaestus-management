import axios from "@/dbUtils/axiosAuth";
export function isNullOrEmptyOrBlank(variable: any): boolean {
  return (
    variable === null ||
    variable === undefined ||
    (typeof variable === "string" && variable.trim().length === 0)
  );
}

class ManageProductUtils {
  // SECURE DONE
  async fetchJewelryPagination(page: number) {
    try {
      const response = await axios.get(
        `/adminsale/jewelry/page?page=${page}&size=8`
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch jewelry data: ", error);
    }
  }

  // SECURE DONE
  async deleteJewelry(jewelryId: number) {
    try {
      await axios.delete(`/admin/jewelry/${jewelryId}`);
    } catch (error) {
      console.error("Failed to delete jewelry: ", error);
    }
  }

  // SECURE
  async findJewelry(jewelryId: any) {
    try {
      const response = await axios.get(`/public/jewelry/${jewelryId}`);
      return response;
    } catch (error) {
      console.error("Failed to find jewelry: ", error);
    }
  }

  // SECURE
  async updateJewelry(
    jewelryId: any,
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
      const response = await axios.put(
        `/admin/jewelry/${jewelryId}`,
        jewelryData
      );
      if (!isNullOrEmptyOrBlank(selectedDiamond)) {
        const dresponse = await axios.put(
          `/admin/set/diamonds/${selectedDiamond}`
        );
        console.log(dresponse);
      }
      console.log("Update jewelry response: ", response.data);
      return true;
    } catch (error) {
      console.error("Failed to update jewelry: ", error);
    }
  }

  async findDiamond(diamondId: any) {
    try {
      const response = await axios.get(`/public/diamonds/${diamondId}`);
      return response;
    } catch (error) {
      console.error("Failed to find diamond: ", error);
    }
  }

  // SECURE DONE
  async updateDiamond(
    diamondId: any,
    measurement: any,
    color: any,
    cut: any,
    carat: any,
    clarity: any,
    price: any,
    img: any
  ) {
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
      const response = await axios.put(
        `/admin/diamonds/${diamondId}`,
        diamondData
      );
      console.log("Update diamond response: ", response.data);
      return true;
    } catch (error) {
      console.error("Failed to update diamond: ", error);
    }
  }
}

export default ManageProductUtils;
