
export interface Consignment {
    shipmentId: string;
    batchId: string;
    storagePlantId: number;
    carrier: string;
    status: string;
    blockchainHash?: string;
    departureDate: Date;
    expectedArrivalDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  

