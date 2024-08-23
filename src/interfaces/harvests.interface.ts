export interface TeaHarvests {
    harvestId: string;
    userId: number;
    quantity: number;
    quality: string;
    createdAt: Date;
    updatedAt: Date;
    blockchainHash?: string;
    location: string;
}

