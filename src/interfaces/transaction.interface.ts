export interface Transaction {
    requestId: string;
    methodName: string;
    payload: object;
    userId: number;
    status: string;
    txHash: string;
    errorMessage: string;
    createdAt: Date;
    updatedAt: Date;
}
