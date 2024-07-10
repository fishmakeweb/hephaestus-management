import axios from "@/dbUtils/axios";

export interface Measurement {
    measurementId: string;
    length: number;
    width: number;
    height: number;
  }
  
  export interface Color {
    colorId: string;
    colorDescription: string;
  }
  
  export interface Cut {
    cutId: string;
    cutDescription: string;
  }
  
  export interface Carat {
    caratId: string;
    carat: number;
  }
  
  export interface Clarity {
    clarityId: string;
    clarityDescription: string;
  }

  const getToken = () => sessionStorage.getItem("token");

  export async function setDiamondStatus(diamondId: string, status: boolean) {
    try{
      await axios.put(`/secure/status/diamonds/${diamondId}`, status,{
        headers: { Authorization: `Bearer ${getToken()}` },
    });
      console.log("Diamond status updated successfully");
    }catch(err){
      console.error("Failed to update diamond status", err);
    }
  };