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