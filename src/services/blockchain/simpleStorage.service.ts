import { logger } from "@/utils/logger";
import { Utility } from "./utility.service";

export class simpleStorage{

    web3: any;
    private abi: any;
    private contractInstMap: object;
    
    constructor(web3, contract) {
        this.web3 = web3;
        this.abi = contract.abi;
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

        public async getValue(contractAddress: string) {  // this contract address needs to be proxy contract address 
            try {
                const contractInstance = await this.getContractInstance(contractAddress);
                return await Utility.invokeContractGetMethod(contractInstance, 'getValue', null);
            } catch(err) {
                logger.error(`Exception in simpleStorage.getValue method: ${err.stack}`);
                throw err
            }
        }

        public async setValue(contractAddress: string, payload: string) {
            try {
                const contractInstance = await this.getContractInstance(contractAddress);
                await Utility.invokeContractPostMethodWithoutSigning(contractInstance, 'setValue', payload)
            } catch(err) {
                logger.error(`Exception in simpleStorage.setValue method: ${err.stack}`);
                throw err
            }
        }
}