export interface Transaction {
  requestId: string;
  methodName: string;
  payload: string;
  userId: number;
  entityId: string;
  status: string;
  txHash: string;
  errorMessage: string;
  createdAt: Date;
  updatedAt: Date;
}
