export interface Processing {
    id?: number;
    harvestId: string;
    packagingPlantId: number;
    processType: string;
    batchId?: string;
    noOfPackets?: number;
    packetWeight?:string;
}