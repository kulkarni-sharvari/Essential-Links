import { WalletEntity } from '@/entities/wallet.entity';
import { DBException } from '@/exceptions/DBException';
import { EntityRepository } from 'typeorm';
import { CryptoUtil } from './crypto';

@EntityRepository(WalletEntity)
export class GetWalletInfo {
  async createWalletFromId(userId: number): Promise<any> {
    try {
      const walletInfo = await WalletEntity.findOne({
        select: ['address', 'privateKey'], // Columns to select
        where: {
          userId: userId, // Condition
        },
      });
      const decryptedPrivateKey = new CryptoUtil().decryptPrivateKey(walletInfo.privateKey);
      return {
        address: walletInfo.address,
        privateKey: decryptedPrivateKey,
      };
    } catch (error) {
      throw new DBException(500, error);
    }
  }
}
