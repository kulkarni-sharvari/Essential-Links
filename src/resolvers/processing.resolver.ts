import { CreateProcessingDto } from "@/dtos/processing.dto";
import { Processing } from "@/typedefs/processing.type";
import { ProcessingRepository } from "@/repositories/processing.repository";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class ProcessingResolver extends ProcessingRepository {
    /**
     * @param processingInput add to db
     * @returns record inserted in DB
     */
    @Authorized(["PROCESSING_PLANT"])
    @Mutation(() => Processing, {description: "Creates Processing Details"})
    async createProcessing(@Arg('processing') processingInput: CreateProcessingDto): Promise<Processing> {
        const processing = await this.processingCreate(processingInput);
        return processing;
    }

    /**
     * @param harvestId 
     * @returns all processing details for that harvestId 
     */
    @Authorized()
    @Query(() => [Processing], { description: "Get processing details for harvestId" })
    async processingDetailsByHarvestId(@Arg('harvestId') harvestId: string): Promise<Processing[]> {
        const processingDetails = await this.getProcessingDetailsByHarvestId(harvestId)
        console.log("processingDetails", processingDetails)
        return processingDetails;
    }
}