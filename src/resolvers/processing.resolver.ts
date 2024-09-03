import { CreateBatchDto, CreateProcessingDto } from '@/dtos/processing.dto';
import { Processing } from '@/typedefs/processing.type';
import { PacketHistory } from '@/typedefs/packetHistory.type';
import { ProcessingRepository } from '@/repositories/processing.repository';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { USER_ROLE } from '@/constants';
import { Batches } from '@/typedefs/batches.type';
import { TeaSupplyChain } from '@/services/blockchain/teaSupplyChain.service';
const tsc = new TeaSupplyChain().getInstance();

@Resolver()
export class ProcessingResolver extends ProcessingRepository {
  /**
   * @param batchId
   * @returns all processing details for that harvestId
   */
  @Query(() => PacketHistory, { description: 'Get processing details for batchId' })
  async getPacketHistory(@Arg('batchId') batchId: string): Promise<PacketHistory> {
    return await tsc.getPacketHistory(batchId);
  }

  /**
   * @param processingInput add to db
   * @returns record inserted in DB
   */
  @Authorized([USER_ROLE.PROCESSING_PLANT])
  @Mutation(() => String, { description: 'Creates Processing Details' })
  async createProcessing(@Ctx('user') userData: any, @Arg('processing') processingInput: CreateProcessingDto): Promise<string> {
    return `Create Processing request submitted successfully. Request Id: ${await this.processingCreate(processingInput, userData.id)}`;
  }

  /**
   * @param harvestId
   * @returns all processing details for that harvestId
   */
  @Authorized()
  @Query(() => [Processing], { description: 'Get processing details for harvestId' })
  async processingDetailsByHarvestId(@Arg('harvestId') harvestId: string): Promise<Processing[]> {
    return await this.getProcessingDetailsByHarvestId(harvestId);
  }

  @Authorized([USER_ROLE.PROCESSING_PLANT])
  @Mutation(() => String, { description: 'Get processing details for harvestId' })
  async createBatches(@Ctx('user') userData: any, @Arg('batchInput') batchInput: CreateBatchDto): Promise<string> {
    return `Create Processing request submitted successfully. Request Id: ${await this.batchCreate(batchInput, userData.id)}`;
  }
}
