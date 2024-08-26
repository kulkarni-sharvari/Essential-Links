import { logger } from '@/utils/logger';
import { Utility } from './utility.service';
import { Web3 } from 'web3';
import { BESU_URL, CONTRACT_ADDRESS, GAS_LIMIT, SUPPLYCHAIN_ADDRESS, ADMIN_PK } from '@config';
import * as tscContractDetails from '../../../blockchain/artifacts/contracts/TeaSupplyChain.sol/TeaSupplyChain.json';
import { PROCESSING_STATUS, USER_ROLES } from '@/constants/constants';

export class TeaSupplyChain {
  web3: any;
  private abi: any;
  private contractInstance: object;
  private currentUserAddress: string;

  constructor() {
    this.web3 = new Web3(BESU_URL);
    this.abi = tscContractDetails.abi;
    this.contractInstance = new this.web3.eth.Contract(this.abi, SUPPLYCHAIN_ADDRESS);
    this.web3.handleRevert = true;
    this.currentUserAddress = null;
  }

  /**
   * Method to get contract instance with callers wallet instance
   * @param userAccountKey
   * @returns
   */
  private getContractInstance(userAccountKey: string = '') {
    try {
      if (!userAccountKey) {
        return this.contractInstance;
      }
      const account = this.web3.eth.accounts.privateKeyToAccount(userAccountKey);
      if (!this.currentUserAddress && !this.currentUserAddress === account.address) {
        this.web3.eth.accounts.wallet.remove(this.currentUserAddress);
      }
      this.web3.eth.accounts.wallet.add(account);
      this.currentUserAddress = account.address;
      return this.contractInstance;
    } catch (error) {
      logger.error(`Exception occurred in simpleStorage.getContractInstance method :: ${error.stack}`);
      throw error;
    }
  }

  public clearUserAccount() {
    try {
      this.web3.eth.accounts.wallet.remove(this.currentUserAddress);
    } catch (error) {}
  }

  /**
   * @dev : this function will get called only by Admin who has deployed the contract.
   * @param accountAddress
   * @param userId
   * @param role
   * @param adminAccountKey
   * @returns
   */
  public async registerUser(accountAddress: string, userId: string, role: string) {
    try {
      const contractInstance = this.getContractInstance(ADMIN_PK);
      const userRole = USER_ROLES[role];
      const payload = [accountAddress, userId, userRole];
      const res = await Utility.invokeContractPostMethod(contractInstance, 'registerUser', payload, this.currentUserAddress);
      this.clearUserAccount();
      return res;
    } catch (err) {
      logger.error(`Exception in simpleStorage.getValue method: ${err.stack}`);
      throw err;
    }
  }

  public async recordHarvest(harvestId: string, harvestDate: string, quality: string, quantity: string, location: string, callerAccountKey: string) {
    try {
      //TODO:
      const contractInstance = this.getContractInstance(callerAccountKey);
      const payload = [harvestId, harvestDate, quality, quantity, location];
      const res = await Utility.invokeContractPostMethod(contractInstance, 'recordHarvest', payload, this.currentUserAddress);
      this.clearUserAccount();
      return res;
    } catch (err) {
      logger.error(`Exception in simpleStorage.getValue method: ${err.stack}`);
      throw err;
    }
  }
  public async recordProcessing(harvestId: string, processingStatus: string, callerAccountKey: string) {
    try {
      //TODO:
      const contractInstance = this.getContractInstance(callerAccountKey);
      const status = PROCESSING_STATUS[processingStatus];

      const payload = [harvestId, status];
      const res = await Utility.invokeContractPostMethod(contractInstance, 'recordProcessing', payload, this.currentUserAddress);
      this.clearUserAccount();
      return res;
    } catch (err) {
      logger.error(`Exception in simpleStorage.getValue method: ${err.stack}`);
      throw err;
    }
  }

  public async createBatch(harvestId: string, batchId: string, quantity: string, packetIds: string[], callerAccountKey: string) {
    try {
      //TODO:
      const contractInstance = this.getContractInstance(callerAccountKey);

      const payload = [harvestId, batchId, quantity, packetIds];
      const res = await Utility.invokeContractPostMethod(contractInstance, 'createBatch', payload, this.currentUserAddress);
      this.clearUserAccount();
      return res;
    } catch (err) {
      logger.error(`Exception in simpleStorage.getValue method: ${err.stack}`);
      throw err;
    }
  }
}
