import { ConsignmentDto, UpdateConsignmentBlockchainDto, UpdateConsignmentEnvDetailsDto, UpdateConsignmentStatusDto } from '@/dtos/consignment.dto';
import { ConsignmentEntity } from '@/entities/consignment.entity';
import { EnvironmentEntity } from '@/entities/environment.entity';
import { DBException } from '@/exceptions/DBException';
import { HttpException } from '@/exceptions/HttpException';
import { TeaSupplyChain } from '@/services/blockchain/teaSupplyChain.service';
import { logger } from '@/utils/logger';
import { EntityRepository } from 'typeorm';
import uniqid from 'uniqid';

const tsc = new TeaSupplyChain().getInstance();

@EntityRepository(ConsignmentEntity)
export class ConsignmentRepository {
  //TODO:
  async consignmentCreate(consignments: ConsignmentDto, userData: any, walletData: any) {
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
      await ConsignmentEntity.createQueryBuilder().insert().into(ConsignmentEntity).values(newConsignments).execute();
      logger.info('Created new consignment');
      // query DB with said {shipmentId}
      const allShipments = await this.getAllConsignmentByID(shipmentId);
      const batchIds = consignments.batchId.map(batch => batch.toString());

      // await new TeaSupplyChain().createConsignment(
      //   shipmentId.toString(),
      //   batchIds,
      //   consignments.carrier,
      //   consignments.departureDate.toISOString(),
      //   consignments.expectedArrivalDate.toISOString(),
      //   walletData.privateKey,
      // );

            await tsc.createConsignment(
        shipmentId.toString(),
        batchIds,
        consignments.carrier,
        consignments.departureDate.toISOString(),
        consignments.expectedArrivalDate.toISOString(),
        walletData.privateKey,
      );

      logger.info(`Returning new consignment:  ${JSON.stringify(allShipments)}`);
      return allShipments;
    } catch (error) {
      logger.error(`ERROR - creating new consignment ${error}`);
      // throw new DBException(500, error)
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
      if (!allShipments) throw new HttpException(404, "No Records found")
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

  async consignmentEnvironmentUpdate(consignment: UpdateConsignmentEnvDetailsDto, userWallet: any) {
    try {
      // find if record with {shipmentId}
      const allShipments = await this.getAllConsignmentByID(consignment.shipmentId);
      if (allShipments) {
        // update the blockchainHash
        logger.info(`Updating environment details for ${consignment.shipmentId}`);
        const updateConsignments = consignment.batchId.map(c => {
          return {
            batchId: c,
            shipmentId: consignment.shipmentId,
            track: consignment.track,
            temperature: consignment.temperature,
            humidity: consignment.humidity
          };
        });
        const updatedEnv = await EnvironmentEntity
          .upsert(updateConsignments, ['shipmentId', 'batchId'])
        console.log(updatedEnv)
        // if track is changed then record the same in shipment table
        const trackUpdateObj: UpdateConsignmentStatusDto = {
          shipmentId: consignment.shipmentId,
          batchId: consignment.batchId,
          status: consignment.track,
        };
        await this.consignmentStatusUpdate(trackUpdateObj);

        // trigger blockchain for changes
        await new TeaSupplyChain()
          .updateConsignment(consignment.shipmentId, consignment.temperature, consignment.humidity, consignment.track, userWallet.privateKey)

        logger.info(`Updated environment details for ${consignment.shipmentId}`);
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
}
