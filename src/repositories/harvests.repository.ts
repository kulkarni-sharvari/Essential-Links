import { TeaHarvestsDto, UpdateTeaHarvestsDto } from '@/dtos/teaHarvests.dto';
import { TeaHarvestsEntity } from '@/entities/harvests.entity';
import { DBException } from '@/exceptions/DBException';
import { User } from '@/interfaces/users.interface';
import { TeaHarvests } from '@/typedefs/teaHarvests.type';
import { TeaSupplyChain } from '@/services/blockchain/teaSupplyChain.service';

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
    const harvestId = uuidv4();
    try {
      const createHarvestData: TeaHarvestsEntity = await TeaHarvestsEntity.create({
        ...harvestInput,
        harvestId,
      }).save();
      
      const result = await new TeaSupplyChain().recordHarvest(
        harvestId.toString(),
        createHarvestData.createdAt.toISOString(),
        createHarvestData.quality,
        createHarvestData.quantity.toString(),
        createHarvestData.location,
        userWallet.privateKey,
      );
      return createHarvestData;
    } catch (error) {
      throw new DBException(500, error);
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
