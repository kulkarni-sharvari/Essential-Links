const { Mnemonic } = require('ethers');

require('@nomicfoundation/hardhat-ignition-ethers');
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  // defaultNetwork: "hardhat",
  networks: {
    besuVM: {
      url: 'http://13.200.98.198:9000',
      // chainId: 1337,
      accounts: ["0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63"],
      // gas: 12000000,
      // blockGasLimit: 0x1fffffffffffff,
      // allowUnlimitedContractSize: true,
      timeout: 1800000,
      // Mnemonic: "abstract enter mesh model risk any debate aunt portion spawn soul tell"
    },
    test: {
      url: 'http://127.0.0.1:8545/',
    },
  },
  solidity: {
    version: '0.8.26',
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
};
