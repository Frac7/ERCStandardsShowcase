const WoffCoin = artifacts.require("WoffCoin");
const WoffProxy = artifacts.require("WoffProxy");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(WoffProxy);
  await deployer.deploy(WoffCoin, accounts[0], 50, WoffProxy.address);
};
