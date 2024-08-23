import { TeaHarvestsDto } from "@/dtos/teaHarvests.dto";
import { TeaHarvestsEntity } from "@/entities/harvests.entity";
import { DBException } from "@/exceptions/DBException";

import { EntityRepository } from "typeorm";

import { v4 as uuidv4 } from 'uuid';

@EntityRepository(TeaHarvestsEntity)
export class TeaHarvestsRepository {

    /**
     * creates a row in DB for tea harvests
     * @param harvestInput takes harvest input object to create record in db
     * @returns updated row in db
     */
    async harvestCreate(harvestInput: TeaHarvestsDto): Promise<TeaHarvestsEntity> {
        const harvestId = uuidv4();
        try {
            const createHarvestData: TeaHarvestsEntity = await TeaHarvestsEntity.create({
                ...harvestInput,
                harvestId
            }).save();
            return createHarvestData;
        } catch (error) {
            throw new DBException(500, error)
        }
    }


    updateHarvest() { }


    getHarvest() { }

}