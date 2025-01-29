import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Order } from "../types/order";
import { ExternalLink, Check, X } from "lucide-react";

interface OrdersTableProps {
    orders: Order[];
    onOrderClick: (order: Order) => void;
    onUpdateStatus: (orderId: number, duoplaneId: string, status: 'confirmed_fraud' | 'false_positive') => Promise<void>;

}

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statusStyles = {
        pending_review: 'bg-yellow-100 text-yellow-800',
        confirmed_fraud: 'bg-red-100 text-red-800',
        false_positive: 'bg-green-100 text-green-800',
    };

    const statusLabels = {
        pending_review: 'Pending Review',
        confirmed_fraud: 'Confirmed Fraud',
        false_positive: 'False Positive',
    };

    return (
        <Badge className={statusStyles[status]}>
            {statusLabels[status]}
        </Badge>
    );
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onOrderClick, onUpdateStatus }) => {
    const getDuoplaneUrl = (duoplaneId: string) => {
        return `https://app.duoplane.com/purchase_orders/${Number(duoplaneId)}`;
    };

    const handleStatusUpdate = async (
        e: React.MouseEvent,
        orderId: number,
        duoplaneId: string,
        status: 'confirmed_fraud' | 'false_positive'
    ) => {
        e.stopPropagation(); // Prevent row click event
        await onUpdateStatus(orderId, duoplaneId, status);
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Shipping Address</TableHead>
                        <TableHead>Amount</TableHead>
                        {/* <TableHead>Risk Factors</TableHead> */}
                        <TableHead>Status</TableHead>
                        <TableHead>External Links</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => onOrderClick(order)}
                        >
                            <TableCell className="font-medium">
                                {order.order_number}
                                {/* <Badge variant="outline" className="ml-2">
                                    {order.platform_type}
                                </Badge> */}
                            </TableCell>
                            <TableCell>
                                {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                                <div>{order.customer_name}</div>
                                <div className="text-sm text-gray-500">{order.customer_email}</div>
                            </TableCell>
                            <TableCell>
                                <div>{order.shipping_address}</div>
                                <div className="text-sm text-gray-500">
                                    {order.shipping_city}, {order.shipping_country}
                                </div>
                            </TableCell>
                            <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                            {/* <TableCell>
                                <div className="max-w-xs text-sm text-gray-600 truncate">
                                    {order.fraud_reasons}
                                </div>
                            </TableCell> */}
                            <TableCell>
                                <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    {order.duoplane_id && (
                                        <a
                                            href={getDuoplaneUrl(order.duoplane_id)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Button variant="ghost" size="sm">
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                Duoplane
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {order.status === 'pending_review' && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-green-600 hover:text-green-800"
                                            onClick={(e) => handleStatusUpdate(e, order.id, order.duoplane_id, 'false_positive')}
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Release
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-800"
                                            onClick={(e) => handleStatusUpdate(e, order.id, order.duoplane_id, 'confirmed_fraud')}
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Confirm Fraud
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default OrdersTable;