import { ConsignmentDto } from "@/dtos/consignment.dto";
import { ConsignmentEntity } from "@/entities/consignment.entity";
import { DBException } from "@/exceptions/DBException";
import { User } from "@/interfaces/users.interface";
import { logger } from "@/utils/logger";
import { EntityRepository } from "typeorm";
import uniqid from 'uniqid';

@EntityRepository(ConsignmentEntity)
export class ConsignmentRepository {
    async consignmentCreate(consignments: ConsignmentDto[], userData: User) {
        logger.info("Creating new consignment")
        // create a unique consignmentID
        const shipmentId = uniqid()

        // loop over the consignment[] to create bulk records
        const newConsignments = consignments.map(consignment => {
            return {
                shipmentId,
                batchId: consignment.batchId,
                storagePlantId: userData.id,
                carrier: consignment.carrier,
                status: consignment.status,
                departureDate: consignment.departureDate,
                expectedArrivalDate: consignment.expectedArrivalDate
            }
        })
        console.log("newConsignments", newConsignments)
        try {
            // bulk insert into DB 
            await ConsignmentEntity
                .createQueryBuilder()
                .insert()
                .into(ConsignmentEntity)
                .values(newConsignments)
                .execute()
            logger.info("Created new consignment")
            // query DB with said {shipmentId}
            const allShipments = await this.getAllConsignmentByID(shipmentId)
            // return all records with {shipmentId}
            logger.info("Returning new consignment")
            return allShipments
        } catch (error) {
            logger.error(`ERROR - creating new consignment ${error}`)
            throw new DBException(500, error)
        }

    }

    async getAllConsignmentByID(shipmentId: string) {
        logger.info(`Fetching all consignment by ${shipmentId}`)
        return await ConsignmentEntity.find({ where: { shipmentId } })
    }
}