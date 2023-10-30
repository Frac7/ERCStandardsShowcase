const WoffCoin = artifacts.require("WoffCoin");
const WoffProxy = artifacts.require("ERC827Proxy");
const WoffReceiver = artifacts.require("WoffReceiver");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(WoffProxy);
  const coin = await deployer.deploy(WoffCoin, accounts[0], 50, WoffProxy.address);
  await deployer.deploy(WoffReceiver, coin.address);
};
