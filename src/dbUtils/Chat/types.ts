// types.ts
export interface OrderStatus {
    statusId: number;
    statusDescription: string;
}

export interface OrderDetails {
    orderId: number;
    username: string;
    orderDate: string;
    orderStatus: OrderStatus;
    totalPrice: number;
}

export interface ChatMessage {
    message: string;
    timestamp: string;
    username: string;
}

export interface OrderChatMessage extends ChatMessage {
    id: number;
    order: OrderDetails;
}
