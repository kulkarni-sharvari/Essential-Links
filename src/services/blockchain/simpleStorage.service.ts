import { logger } from "@/utils/logger";
import { Utility } from "./utility.service";
const { Web3 } = require('web3');
import { BESU_URL, CONTRACT_ADDRESS } from '@config';
import * as simpleStorageContractDetails from '../../../blockchain/artifacts/contracts/SimpleStorage.sol/Storage.json'

export class SimpleStorage{

    web3: any;
    private abi: any;
    private contractInstMap: object;
    
    constructor() {
        this.web3 = new Web3(BESU_URL);
        this.abi = simpleStorageContractDetails.abi;
        this.contractInstMap = {};
    }

    /**
     * Method to get contract instance admin contract
     * @param proxyAddress
     * @returns
     */
        private getContractInstance(proxyAddress: string) { 
            try {
                if (!this.contractInstMap[proxyAddress]) {
                    const contractInstance = new this.web3.eth.Contract(this.abi, proxyAddress);
                    this.contractInstMap[proxyAddress] = contractInstance;
                    return contractInstance;
                } else {
                    return this.contractInstMap[proxyAddress];
                }
            } catch (error) {
                logger.error(`Exception occurred in simpleStorage.getContractInstance method :: ${error.stack}`);
                throw error;
            }
        }

        public async getValue() {  // this contract address needs to be proxy contract address 
            try {
                const contractInstance = await this.getContractInstance(CONTRACT_ADDRESS);
                return await Utility.invokeContractGetMethod(contractInstance, 'store', null);
            } catch(err) {
                logger.error(`Exception in simpleStorage.getValue method: ${err.stack}`);
                throw err
            }
        }

        public async setValue(payload: any, decryptedWallet: any) {
            try {
                const contractInstance = await this.getContractInstance(CONTRACT_ADDRESS);
                //await Utility.invokeContractPostMethodWithoutSigning(contractInstance, 'setValue', payload)
                await Utility.invokeContractPostMethodSigned(contractInstance, 'retrieve', payload, decryptedWallet, CONTRACT_ADDRESS, this.web3)
            } catch(err) {
                logger.error(`Exception in simpleStorage.setValue method: ${err.stack}`);
                throw err
            }
        }
}