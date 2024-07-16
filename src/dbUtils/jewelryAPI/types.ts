import axios from "@/dbUtils/axiosAuth";
export interface Category {
    categoryId: string;
    categoryName: string;
  }
  
  export interface Shape {
    shapeId: string;
    shapeDescription: string;
  }
  
  export interface Material {
    materialId: string;
    materialName: string;
  }
  
  export interface Size {
    sizeId: string;
    sizeNumber: number;
    unit: string;
    type: string;
  }
  
  export interface Diamond {
    diamondId: string;
    color: { colorDescription: string };
    cut: { cutDescription: string };
    clarity: { clarityDescription: string };
    carat: { carat: number };
    price: number;
    sold : boolean;
  }

  export async function setJewelryStatus(jewelryId: number, status: boolean) {
    try{
      await axios.put(`/admin/status/jewelry/${jewelryId}`, status);
      console.log("Jewelry status updated successfully");
    }catch(err){
      console.error("Failed to update diamond status", err);
    }
  };