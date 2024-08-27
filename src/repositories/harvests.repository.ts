import { TeaHarvestsDto, UpdateTeaHarvestsDto } from '@/dtos/teaHarvests.dto';
import { TeaHarvestsEntity } from '@/entities/harvests.entity';
import { DBException } from '@/exceptions/DBException';
import { User } from '@/interfaces/users.interface';
import { TeaHarvests } from '@/typedefs/teaHarvests.type';
import { TeaSupplyChain } from '@/services/blockchain/teaSupplyChain.service';
import { getConnection } from 'typeorm';

import { EntityRepository } from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

@EntityRepository(TeaHarvestsEntity)
export class TeaHarvestsRepository {
  /**
   * creates a row in DB for tea harvests
   * @param harvestInput takes harvest input object to create record in db
   * @returns updated row in db
   */
  async harvestCreate(harvestInput: TeaHarvestsDto, userWallet: any): Promise<TeaHarvests> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    const harvestId = uuidv4();

    try {
      const createHarvestData: TeaHarvestsEntity = await queryRunner.manager.save(TeaHarvestsEntity, {
        ...harvestInput,
        harvestId,
      });

      await new TeaSupplyChain().recordHarvest(
        harvestId,
        createHarvestData.createdAt.toISOString(),
        createHarvestData.quality,
        createHarvestData.quantity.toString(),
        createHarvestData.location,
        userWallet.privateKey,
      );

      await queryRunner.commitTransaction();
      return createHarvestData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`Error creating harvest: ${error.message}`, { harvestInput, harvestId });
      throw new DBException(500, 'Failed to create harvest');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *
   * @param harvestInput takes blockchainHash and harvestId as input
   * @param userData required to get userID
   * @returns updated DB record
   */
  async harvestUpdate(harvestInput: UpdateTeaHarvestsDto, userData: User): Promise<TeaHarvests> {
    try {
      // find harvest whose id is {harvestId} created by user {userId}
      const findHarvest = await TeaHarvestsEntity.findOne({ where: { harvestId: harvestInput.harvestId, userId: userData.id } });
      if (!findHarvest) throw new DBException(409, 'No harvest recorded');
      else {
        // perform DB update
        await TeaHarvestsEntity.update(harvestInput.harvestId, { ...harvestInput });
        // find updated record
        const updateHarvest: TeaHarvests = await TeaHarvestsEntity.findOne({ where: { harvestId: harvestInput.harvestId } });
        return updateHarvest;
      }
    } catch (error) {
      throw new DBException(500, error);
    }
  }

  /**
   *
   * @param user gets user from Context
   * @returns all the harvests done by a user
   */
  async readAllHarvestByFarmerId(user: User): Promise<TeaHarvests[]> {
    const allHarvests = await TeaHarvestsEntity.find({ where: { userId: user.id } });
    return allHarvests;
  }
}
