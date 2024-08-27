import { ethers } from 'ethers';
import uniqid from 'uniqid';
import { logger } from "@/utils/logger";

export class CreateWallet {
     createUserWallet() {
        logger.info("creating wallet for user ")
        const wallet = ethers.Wallet.createRandom();
        logger.info("created wallet for user ")
        return {
            walletId: uniqid(),
            address: wallet.address,
            publicKey: wallet.publicKey,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic.phrase,
          };
     }
}