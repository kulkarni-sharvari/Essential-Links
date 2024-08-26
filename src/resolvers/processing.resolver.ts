import { CreateBatchDto, CreateProcessingDto } from "@/dtos/processing.dto";
import { Processing } from "@/typedefs/processing.type";
import { ProcessingRepository } from "@/repositories/processing.repository";
import { Arg, Authorized, Ctx,Mutation, Query, Resolver } from "type-graphql";
import { USER_ROLE } from "@/constants";
import { Batches } from "@/typedefs/batches.type";
import { GetWalletInfo } from '@/utils/getWalletInfo';


@Resolver()
export class ProcessingResolver extends ProcessingRepository {
    /**
     * @param processingInput add to db
     * @returns record inserted in DB
     */
    @Authorized([USER_ROLE.PROCESSING_PLANT])
    @Mutation(() => Processing, {description: "Creates Processing Details"})
    async createProcessing(@Ctx('user') userData: any, @Arg('processing') processingInput: CreateProcessingDto): Promise<Processing> {
        const userWallet = await new GetWalletInfo().createWalletFromId(userData.id);
        const processing = await this.processingCreate(processingInput, userWallet);
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

    @Authorized([USER_ROLE.PROCESSING_PLANT])
    @Mutation(() => Batches, { description: "Get processing details for harvestId" })
    async createBatches(@Ctx('user') userData: any, @Arg('batchInput') batchInput: CreateBatchDto): Promise<Batches> {
        const userWallet = await new GetWalletInfo().createWalletFromId(userData.id);
        const createBatch = await this.batchCreate(batchInput, userWallet);
        console.log("processingDetails", createBatch)
        return createBatch;
    }
}