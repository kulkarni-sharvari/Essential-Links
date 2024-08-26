import { EnvironmentEntity } from "@/entities/environment.entity";
import { logger } from "@/utils/logger";
import { EntityRepository } from "typeorm";

@EntityRepository(EnvironmentEntity)
export class EnvironmentRepository {

    async getAllEnvByID(shipmentId: string) {
        logger.info(`Fetching all env for consignment: ${shipmentId}`)
        return await EnvironmentEntity.find({ where: { shipmentId } })
    }
}