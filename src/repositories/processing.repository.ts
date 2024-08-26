import { CreateBatchDto, CreateProcessingDto } from '@/dtos/processing.dto';
import { PacketsEntity } from '@/entities/packets.entity';
import { ProcessingEntity } from '@/entities/processing.entity';
import { DBException } from '@/exceptions/DBException';
import { Processing } from '@/interfaces/processing.interface';
import { TeaSupplyChain } from '@/services/blockchain/teaSupplyChain.service';
import { Batches } from '@/typedefs/batches.type';
import { Packets } from '@/typedefs/packets.type';
import { logger } from '@/utils/logger';
import { EntityRepository } from 'typeorm';
import uniqid from 'uniqid';

@EntityRepository(ProcessingEntity)
export class ProcessingRepository {
  /**
   * creates a row in DB for processing
   * @param processingInput takes processing input object to create record in db
   * @returns updated row in db
   */
  public async processingCreate(processingInput: CreateProcessingDto, userWallet: any): Promise<Processing> {
    try {
      const res = await new TeaSupplyChain().recordProcessing(processingInput.harvestId, processingInput.processType, userWallet.privateKey);
      console.log('res', res);

      const createProcessingData: ProcessingEntity = await ProcessingEntity.create({ ...processingInput }).save();
      return createProcessingData;
    } catch (error) {
      throw new DBException(500, error);
    }
  }

  /**
   *
   * @param user gets harvestId from req
   * @returns all processing records for that harvest id
   */
  async getProcessingDetailsByHarvestId(harvestId: string): Promise<Processing[]> {
    const processingDetails = await ProcessingEntity.find({ where: { harvestId: harvestId } });
    return processingDetails;
  }

  /**
   *
   * @param batchInput gets harvestId, numberofPackages, packageWeight
   * @returns Batches created
   */
  async batchCreate(batchInput: CreateBatchDto, userWallet: any): Promise<Batches> {
    batchInput['packetWeight'] = '50g';

    //create a unique batchId
    logger.info(`Creating batchId`);
    const batchId = uniqid();
    // based on the numberOfPackages create packageId
    const packages: Partial<Packets>[] = [];
    logger.info(`Creating packets`);
    for (let i = 0; i < batchInput.noOfPackets; i++) {
      const packageId = uniqid();
      const pack: Partial<Packets> = {
        batchId,
        packageId,
        //TODO:
        weight: batchInput.packetWeight,
        // weight: '100gm',
      };
      packages.push(pack);
    }
    try {
      console.log(' Packages: ', packages);

      // bulk insert into packages table
      await PacketsEntity.createQueryBuilder().insert().into(PacketsEntity).values(packages).execute();
      logger.info(`Created packets successfully`);

      // update {numberofPackages} and {batchId} in harvest table
      await ProcessingEntity.createQueryBuilder()
        .update(ProcessingEntity)
        .where({ harvestId: batchInput.harvestId })
        .set({ batchId, noOfPackets: batchInput.noOfPackets })
        .execute();
      logger.info(`updated processing with batch details successfully`);

      const batch: Batches = {
        batchId,
        packetWeight: batchInput.packetWeight,
        packages: packages.map(({ packageId }): string => packageId as string),
      };

      const result = await new TeaSupplyChain().createBatch(
        batchId,
        batchInput.harvestId,
        batchInput.noOfPackets.toString(),
        batch.packages,
        userWallet.privateKey,
      );
      console.log('result ', result);
      return batch;
    } catch (error) {
      throw new DBException(500, error);
    }
  }
}
