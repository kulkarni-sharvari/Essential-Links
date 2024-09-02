export interface Transaction {
    messageId: string;
    methodName: string;
    payload: object;
    userId: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
