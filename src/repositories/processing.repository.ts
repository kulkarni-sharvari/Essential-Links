import { CreateProcessingDto } from "@/dtos/processing.dto";
import { ProcessingEntity } from "@/entities/processing.entity";
import { DBException } from "@/exceptions/DBException";
import { Processing } from "@/interfaces/processing.interface";
import { EntityRepository } from "typeorm";

@EntityRepository(ProcessingEntity)
export class ProcessingRepository {

    /**
     * creates a row in DB for processing
     * @param processingInput takes processing input object to create record in db
     * @returns updated row in db
     */
    public async processingCreate(processingInput: CreateProcessingDto): Promise<Processing> {
        try {
            const createProcessingData: ProcessingEntity = await ProcessingEntity.create({...processingInput}).save();
            return createProcessingData;
        } catch(error) {
            throw new DBException(500, error)
        }
    }

    /**
     * 
     * @param user gets harvestId from req
     * @returns all processing records for that harvest id 
     */
        async getProcessingDetailsByHarvestId(harvestId: string) : Promise<Processing[]> { 
            const processingDetails = await ProcessingEntity.find({where:{harvestId: harvestId}})
            return processingDetails
        }
}
