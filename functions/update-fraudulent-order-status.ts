interface Env {
    FRAUD_DETECTION_WORKER: any;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { orderId, duoplaneId, status, reviewedBy }: any = await context.request.json();

    const response = await context.env.FRAUD_DETECTION_WORKER.updateFraudulentOrderStatus(orderId, duoplaneId, status, reviewedBy);
    console.log(response);
    return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } })
};