export interface OrderItem {
    title: string;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user?: { name: string; email: string } | string; // staff list has name + email
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    status: string;
    paymentStatus: string;
    shippingAddress: string;
    createdAt: string;
}
