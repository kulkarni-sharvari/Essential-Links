const { Mnemonic } = require('ethers');

require('@nomicfoundation/hardhat-ignition-ethers');
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  // defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
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
