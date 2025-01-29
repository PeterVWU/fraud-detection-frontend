// Definition of the Order type
export interface Order {
    id: number;
    order_number: string;
    platform_type: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    shipping_address: string;
    shipping_city: string;
    shipping_country: string;
    fraud_reasons: string;
    client_ip: string;
    duoplane_id: string;
    status: 'pending_review' | 'confirmed_fraud' | 'false_positive';
} 