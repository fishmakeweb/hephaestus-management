
import { Jewelry } from "../customAPI/getAttribute";
export interface OrderStatus {
    statusId: number;
    statusDescription: string;
}

export interface CustomOrder {
    customOrderId: number;
    username: string;
    customJewelry: Jewelry
    prepaid: number;
    fullpaid: number;
    description: string;
    startDate: string;
    finishDate: string;
    orderStatus: OrderStatus;
}

export interface ChatMessage {
    message: string;
    timestamp: string;
    username: string;
}

export interface CustomOrderChatMessage extends ChatMessage {
    id: number;
    customOrder: CustomOrder;
}
