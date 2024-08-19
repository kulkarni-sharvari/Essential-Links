import { logger } from "@/utils/logger";

export class Utility {

    static async invokeContractGetMethod(contractInstance: any, method: string, payload: any) {
        logger.info(`invoking invokeContractGetMethod with method ${method} and input ${payload}`)
        try {
            let contractResponse;
            if (payload === null || payload === undefined) { // added this if clause for simple storage getValue call
                contractResponse = await contractInstance.methods[method]().call();
            } else
            { contractResponse = await contractInstance.methods[method](payload).call();}
            return contractResponse;
        } catch(err) {
            throw err;
        }
    }

    static async invokeContractPostMethodWithoutSigning(contractInstance: any, method: string, payload: any) {
        logger.info(`invoking invokeContractPostMethodWithoutSigning with method ${method} and input ${payload}`)
        try {
            await contractInstance.methods[method](payload).send();
            return;
        } catch(err) {
            throw err;
        }
    }

    static async invokeContractPostMethodSigned(contractInstance: any, method: string, payload: any, decryptedWallet: any, contractAddress: string, web3: any){
        logger.info(`invoking invokeContractPostMethodSigned with method ${method} and input ${payload}`)
        try {
            const contractMethod = contractInstance.methods[method](payload);
            await this.signAndSendTransaction(decryptedWallet, contractMethod, contractAddress, web3);
            return; 
        } catch (err) {
            throw err
        }
    }

    static async signAndSendTransaction(decryptedWallet: any, contractMethod: any, contractAddress, web3) {
        logger.info(`invoking signAndSendTransaction`)
        try {
            const txObject = {
                data: contractMethod.encodeABI(),
                gas:
                  (await contractMethod.estimateGas({
                    from: decryptedWallet.address,
                  })) * 2,
                gasPrice: 0,
                to: contractAddress,
                from: decryptedWallet.address,
                nonce: await web3.eth.getTransactionCount(decryptedWallet.address, 'pending'), // Todo create a nonce manager to handle this,
              };
            const signedTx = await web3.eth.accounts.signTransaction(txObject, decryptedWallet.privateKey);
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            return;
        } catch(err) {
            throw err
        }
    }
}