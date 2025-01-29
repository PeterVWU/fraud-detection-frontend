import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrdersTable from './OrdersTable';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Order } from "../types/order";
import { useToast } from "@/hooks/use-toast"



const OrdersDashboard: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Fetch orders using React Query
    const { data: orders, isLoading, isError, error } = useQuery<Order[], Error>({
        queryKey: ['fraudulentOrders'],
        queryFn: async () => {
            const response = await fetch('/get-fraudulent-orders',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: "pending_review" })
                },
            );
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const result = await response.json();
            // Log the actual response for debugging
            console.log('API Response:', result);
            return result;
        },
    });

    // Mutation for updating order status
    const updateStatusMutation = useMutation({
        mutationFn: async ({
            orderId,
            duoplaneId,
            status
        }: {
            orderId: number;
            duoplaneId: string;
            status: 'confirmed_fraud' | 'false_positive'
        }) => {
            const response = await fetch('/update-fraudulent-order-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    duoplaneId,
                    status,
                    reviewedBy: 'current-user'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            console.log('API Response:', response);
            const result = await response.json();
            return result;
        },
        onSuccess: () => {
            // Refetch orders after successful status update
            queryClient.invalidateQueries({ queryKey: ['fraudulentOrders'] });
            toast({
                title: "Order Updated",
                description: "The order status has been successfully updated.",
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to update order status: ${error.message}`,
            });
        },
    });

    const handleOrderClick = (order: Order) => {
        // setSelectedOrder(order);
    };

    const handleUpdateStatus = async (orderId: number, duoplaneId: string, status: 'confirmed_fraud' | 'false_positive') => {
        try {
            await updateStatusMutation.mutateAsync({ orderId, duoplaneId, status });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {[...Array(5)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="w-full h-16"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Error loading orders: {error.message}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Fraud Detection Dashboard</h1>
                <div className="flex gap-4">
                    {/* Filter controls will go here */}
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <OrdersTable
                        orders={orders || []}
                        onOrderClick={handleOrderClick}
                        onUpdateStatus={handleUpdateStatus}
                    />
                </div>
                {selectedOrder && (
                    <div className="w-96">
                        {/* Detail panel will go here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersDashboard;