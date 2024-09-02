import { ConsignmentDto, UpdateConsignmentBlockchainDto, UpdateConsignmentEnvDetailsDto, UpdateConsignmentStatusDto } from '@/dtos/consignment.dto';
import { ConsignmentEntity } from '@/entities/consignment.entity';
import { EnvironmentEntity } from '@/entities/environment.entity';
import { EventEntity } from '@/entities/event.entity';
import { DBException } from '@/exceptions/DBException';
import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@/utils/logger';
import { EntityRepository } from 'typeorm';
import uniqid from 'uniqid';
import { Publisher } from '@/services/publisher.service';

const publisher = new Publisher().getInstance();

@EntityRepository(ConsignmentEntity)
@EntityRepository(EventEntity)
export class ConsignmentRepository {
  
  async consignmentCreate(consignments: ConsignmentDto, userData: any): Promise<string> {
    const shipmentId = uniqid();

    // loop over the consignment[] to create bulk records
    const newConsignments = consignments.batchId.map(consignment => {
      return {
        shipmentId,
        batchId: consignment,
        storagePlantId: userData.id,
        carrier: consignments.carrier,
        status: consignments.status,
        departureDate: new Date(consignments.departureDate),
        expectedArrivalDate: new Date(consignments.expectedArrivalDate),
      };
    });
    try {
      // bulk insert into DB
      await ConsignmentEntity
      .createQueryBuilder()
      .insert()
      .into(ConsignmentEntity)
      .values(newConsignments)
      .execute();
      logger.info('Created new consignment');
      
      // query DB with said {shipmentId}
      await this.getAllConsignmentByID(shipmentId);
      const batchIds = consignments.batchId.map(batch => batch.toString());

      const payload = [
        shipmentId.toString(),
        batchIds,
        consignments.carrier,
        consignments.departureDate.toISOString(),
        consignments.expectedArrivalDate.toISOString(),
      ];
      const tx = {
        methodName: 'createConsignment',
        payload: payload,
        userId: userData.id,
        entityId: shipmentId.toString(),
      };

      return await publisher.publish(tx);
    } catch (error) {
      logger.error(`ERROR - creating new consignment ${error}`);
      throw new DBException(500, error)
    }
  }

  async getAllConsignmentByID(shipmentId: string) {
    logger.info(`Fetching all consignment by ${shipmentId}`);
    return await ConsignmentEntity.find({ where: { shipmentId } });
  }

  async consignmentBlockchainUpdate(consignment: UpdateConsignmentBlockchainDto) {
    try {
      // find if record with {shipmentId}
      const allShipments = await this.getAllConsignmentByID(consignment.shipmentId);
      if (!allShipments) throw new HttpException(404, 'No Records found');
      else {
        // update the blockchainHash in DB
        logger.info(`Updating blockchainHash for ${consignment.shipmentId}`);

        await ConsignmentEntity.createQueryBuilder()
          .update(ConsignmentEntity)
          .where({ shipmentId: consignment.shipmentId })
          .set({ blockchainHash: consignment.blockchainHash })
          .execute();

        logger.info(`Updated blockchainHash for ${consignment.shipmentId}`);
      }
      //return all the records that are updated
      const allUpdatedShipments = await this.getAllConsignmentByID(consignment.shipmentId);
      return allUpdatedShipments;
    } catch (error) {
      logger.error(`ERROR: Updated blockchainHash for ${consignment.shipmentId} - ${error}`);
      throw new DBException(500, error);
    }
  }

  async consignmentStatusUpdate(consignment: UpdateConsignmentStatusDto) {
    try {
      // find if record with {shipmentId}
      const allShipments = await this.getAllConsignmentByID(consignment.shipmentId);
      if (allShipments) {
        // update the blockchainHash
        logger.info(`Updating status for ${consignment.shipmentId}`);
        await ConsignmentEntity.createQueryBuilder()
          .update(ConsignmentEntity)
          .set({ blockchainHash: consignment.status })
          .where({ shipmentId: consignment.shipmentId, batchId: consignment.batchId })
          .execute();
        logger.info(`Updated status for ${consignment.shipmentId}`);
      }
      //return all the records that are updated
      const allUpdatedShipments = await this.getAllConsignmentByID(consignment.shipmentId);
      return allUpdatedShipments;
    } catch (error) {
      logger.error(`ERROR - Updating status for ${consignment.shipmentId} - ${error}`);
      throw new DBException(500, error);
    }
  }

  async consignmentEnvironmentUpdate(consignment: UpdateConsignmentEnvDetailsDto, userData: any) {
    try {
      // find if record with {shipmentId}
      const allShipments = await this.getAllConsignmentByID(consignment.shipmentId);
      if (allShipments) {
        // update the blockchainHash
        logger.info(`Updating environment details for ${consignment.shipmentId}`);
        const updatedEnv = await EnvironmentEntity.upsert(consignment, ['shipmentId']);
        // if track is changed then record the same in shipment table
        const trackUpdateObj: UpdateConsignmentStatusDto = {
          shipmentId: consignment.shipmentId,
          batchId: consignment.batchId,
          status: consignment.track,
        };
        await this.consignmentStatusUpdate(trackUpdateObj);

        const payload = [
          consignment.shipmentId.toString(),
          consignment.temperature.toString(),
          consignment.humidity.toString(),
          consignment.track.toString(),
        ];
        const tx = {
          methodName: 'updateConsignment',
          payload: payload,
          userId: userData.id,
          entityId: consignment.shipmentId.toString(),
        };

        return await publisher.publish(tx);
      }
      //return all the records that are updated
      const allEnvRecords = await this.getAllEnvByID(consignment.shipmentId);
      return allEnvRecords;
    } catch (error) {
      logger.error(`ERROR - updating environment details for consignment ${consignment.shipmentId} consignment ${error}`);
      throw new DBException(500, error);
    }
  }

  async getAllEnvByID(shipmentId: string) {
    logger.info(`Fetching all env for consignment: ${shipmentId}`);
    return await EnvironmentEntity.find({ where: { shipmentId } });
  }

  
  async getPacketHistory(batchId: string) {
    try {
      const resultArray = []
      const shipment = await ConsignmentEntity.findOne({ select: ['shipmentId'], where: { batchId: batchId } });
      const shipmentId =  shipment.shipmentId
      const allBatchRecords = await EventEntity.createQueryBuilder('ee')
                                          .select(['ee.eventDetails', 'ee.eventName', 'ee.blockchainHash', 'ee.createdAt'])
                                          .where(`ee."eventDetails"->>'batchId' = :batchId`, { batchId })
                                          .getMany();
                        
      resultArray.push(...allBatchRecords)

      const shipmentRecords = await EventEntity.createQueryBuilder('ee')
                                                .select(['ee.eventDetails', 'ee.eventName', 'ee.blockchainHash', 'ee.createdAt'])
                                                .where(`ee."eventDetails"->>'shipmentId' = :shipmentId`, { shipmentId })
                                                .getMany();
      resultArray.push(...shipmentRecords)                                        
      const harvestId = (allBatchRecords.filter(batchrecord => batchrecord.eventName ===  'BatchCreated').map(record => record.eventDetails.harvestId))[0]

      const allHarvestRecords = await EventEntity.createQueryBuilder('ee')
                                                  .select(['ee.eventDetails', 'ee.eventName', 'ee.blockchainHash', 'ee.createdAt'])
                                                  .where(`ee."eventDetails"->>'harvestId' = :harvestId`, { harvestId })
                                                  .getMany();
      resultArray.push(...allHarvestRecords)
      const uniqueArray = Array.from(
        new Map(resultArray.map(item => [item.eventName, item])).values()
      );

      return (uniqueArray)
    } catch(error) {
      logger.error(`ERROR - fetching packet history for batchId ${batchId} ${error}`);
      throw new DBException(500, error);
    }
  }
}
