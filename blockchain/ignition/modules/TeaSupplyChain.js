const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('TeaSupplyChainModule', m => {
  const tsc = m.contract('TeaSupplyChain');

  return { tsc };
});
