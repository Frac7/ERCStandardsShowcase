const WoffCoin = artifacts.require("WoffCoin");
const ERC827Proxy = artifacts.require("ERC827Proxy");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(ERC827Proxy);
  await deployer.deploy(WoffCoin, accounts[0], 50, ERC827Proxy.address);
};
