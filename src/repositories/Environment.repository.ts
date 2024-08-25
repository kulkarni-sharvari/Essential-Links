import { STATUS_TRACK } from "@/constants";
import { ConsignmentDto, UpdateConsignmentBlockchainDto, UpdateConsignmentEnvDetailsDto, UpdateConsignmentStatusDto } from "@/dtos/consignment.dto";
import { ConsignmentEntity } from "@/entities/consignment.entity";
import { EnvironmentEntity } from "@/entities/environment.entity";
import { DBException } from "@/exceptions/DBException";
import { Environment } from "@/interfaces/environment.interface";
import { User } from "@/interfaces/users.interface";
import { logger } from "@/utils/logger";
import { EntityRepository } from "typeorm";
import uniqid from 'uniqid';

@EntityRepository(EnvironmentEntity)
export class EnvironmentRepository {

    async getAllEnvByID(shipmentId: string) {
        logger.info(`Fetching all env for consignment: ${shipmentId}`)
        return await EnvironmentEntity.find({ where: { shipmentId } })
    }
}