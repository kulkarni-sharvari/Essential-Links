import { logger } from '@/utils/logger';
import { Utility } from './utility.service';
import { Web3 } from 'web3';
import _ from 'lodash';
import { BESU_URL, CONTRACT_ADDRESS, GAS_LIMIT } from '@config';
import * as simpleStorageContractDetails from '../../../blockchain/artifacts/contracts/SimpleStorage.sol/Storage.json';

export class SimpleStorage {
  web3: any;
  private abi: any;
  private contractInstance: object;
  private currentUserAddress: string;

  constructor() {
    this.web3 = new Web3(BESU_URL);
    this.abi = simpleStorageContractDetails.abi;
    this.contractInstance = new this.web3.eth.Contract(this.abi, CONTRACT_ADDRESS);
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

  public async getValue() {
    // this contract address needs to be proxy contract address
    try {
      const contractInstance = this.getContractInstance();
      return await Utility.invokeContractGetMethod(contractInstance, 'retrieve', null);
    } catch (err) {
      logger.error(`Exception in simpleStorage.getValue method: ${err.stack}`);
      throw err;
    }
  }

  public async setValue(payload: any, userAccountKey: any) {
    try {
      console.log(' payload', payload);
      console.log('Wallet', userAccountKey);

      const contractInstance = this.getContractInstance(userAccountKey.privateKey);
      //   //await Utility.invokeContractPostMethodWithoutSigning(contractInstance, 'setValue', payload)
      const txObject = {
        gas: GAS_LIMIT,
        from: this.currentUserAddress,
      };
      console.log('txObject', txObject);

      //TODO: payload object destructing
      await Utility.invokeContractPostMethod(contractInstance, 'store', payload, txObject);
      this.clearUserAccount();
      return '';
    } catch (err) {
      logger.error(`Exception in simpleStorage.setValue method: ${err.stack}`);
      throw err;
    }
  }
}
