import { logger } from '@/utils/logger';
import { Utility } from './utility.service';
import Web3 from 'web3';
import { BESU_URL, SUPPLYCHAIN_ADDRESS, ADMIN_PK } from '@config';
import tscContractDetails from '../../../blockchain/artifacts/contracts/TeaSupplyChain.sol/SupplyChain.json';
import { PROCESSING_STATUS, STATUS_TRACKING, USER_ROLES } from '@/constants/constants';

export class TeaSupplyChain {
  private web3: Web3;
  private contractInstance: any;
  private currentUserAddress: string | null = null;

  constructor() {
    this.web3 = new Web3(BESU_URL);
    this.contractInstance = new this.web3.eth.Contract(tscContractDetails.abi, SUPPLYCHAIN_ADDRESS);
    this.web3.handleRevert = true;
  }

  private getContractInstance(userAccountKey: string = ''): any {
    try {
      if (!userAccountKey) {
        return this.contractInstance;
      }

      const account = this.web3.eth.accounts.privateKeyToAccount(userAccountKey);

      if (this.currentUserAddress && this.currentUserAddress !== account.address) {
        this.web3.eth.accounts.wallet.remove(this.currentUserAddress);
      }

      this.web3.eth.accounts.wallet.add(account);
      this.currentUserAddress = account.address;

      return this.contractInstance;
    } catch (error) {
      logger.error(`Error in getContractInstance: ${error.message}`);
      throw error;
    }
  }

  private clearUserAccount(): void {
    try {
      if (this.currentUserAddress) {
        this.web3.eth.accounts.wallet.remove(this.currentUserAddress);
        this.currentUserAddress = null;
      }
    } catch (error) {
      logger.warn(`Error clearing user account: ${error.message}`);
    }
  }

  public async registerUser(accountAddress: string, userId: string, role: string): Promise<any> {
    try {
      const contractInstance = this.getContractInstance(ADMIN_PK);
      const userRole = USER_ROLES[role];
      const payload = [accountAddress, userId, userRole];

      const res = await Utility.invokeContractPostMethod(contractInstance, 'registerUser', payload, this.currentUserAddress);
      this.clearUserAccount();

      return res;
    } catch (error) {
      logger.error(`Error in registerUser: ${error.message}`);
      throw error;
    }
  }

  public async recordHarvest(
    harvestId: string,
    harvestDate: string,
    quality: string,
    quantity: string,
    location: string,
    callerAccountKey: string,
  ): Promise<any> {
    try {
      const contractInstance = this.getContractInstance(callerAccountKey);
      const payload = [harvestId, harvestDate, quality, quantity, location];

      const res = await Utility.invokeContractPostMethod(contractInstance, 'recordHarvest', payload, this.currentUserAddress);
      this.clearUserAccount();

      return res;
    } catch (error) {
      logger.error(`Error in recordHarvest: ${error.message}`);
      throw error;
    }
  }

  public async recordProcessing(harvestId: string, processingStatus: string, callerAccountKey: string): Promise<any> {
    try {
      const contractInstance = this.getContractInstance(callerAccountKey);
      const status = PROCESSING_STATUS[processingStatus];
      const payload = [harvestId, status];

      const res = await Utility.invokeContractPostMethod(contractInstance, 'recordProcessing', payload, this.currentUserAddress);
      this.clearUserAccount();

      return res;
    } catch (error) {
      logger.error(`Error in recordProcessing: ${error.message}`);
      throw error;
    }
  }

  public async createBatch(harvestId: string, batchId: string, quantity: string, packetIds: string[], callerAccountKey: string): Promise<any> {
    try {
      const contractInstance = this.getContractInstance(callerAccountKey);
      const payload = [harvestId, batchId, quantity, packetIds];

      const res = await Utility.invokeContractPostMethod(contractInstance, 'createBatch', payload, this.currentUserAddress);
      this.clearUserAccount();

      return res;
    } catch (error) {
      logger.error(`Error in createBatch: ${error.message}`);
      throw error;
    }
  }

  public async createConsignment(
    consignmentId: string,
    batchIds: string[],
    carrier: string,
    departureDate: string,
    eta: string,
    callerAccountKey: string,
  ): Promise<any> {
    try {
      const contractInstance = this.getContractInstance(callerAccountKey);
      const payload = [consignmentId, batchIds, carrier, departureDate, eta];

      const res = await Utility.invokeContractPostMethod(contractInstance, 'createConsignment', payload, this.currentUserAddress);
      this.clearUserAccount();

      return res;
    } catch (error) {
      logger.error(`Error in createConsignment: ${error.message}`);
      throw error;
    }
  }

  public async updateConsignment(
    consignmentId: string,
    temperature: string,
    humidity: string,
    status: string,
    callerAccountKey: string,
  ): Promise<any> {
    try {
      const contractInstance = this.getContractInstance(callerAccountKey);
      const consignmentStatus = STATUS_TRACKING[status];
      const payload = [consignmentId, temperature, humidity, consignmentStatus];

      const res = await Utility.invokeContractPostMethod(contractInstance, 'updateConsignment', payload, this.currentUserAddress);
      this.clearUserAccount();

      return res;
    } catch (error) {
      logger.error(`Error in updateConsignment: ${error.message}`);
      throw error;
    }
  }
}
