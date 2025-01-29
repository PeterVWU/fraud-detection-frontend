interface Env {
    FRAUD_DETECTION_WORKER: any;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { status }: any = await context.request.json();

    const response = await context.env.FRAUD_DETECTION_WORKER.getFraudulentOrders(status);

    return new Response(JSON.stringify(response.results), { headers: { 'Content-Type': 'application/json' } })
};