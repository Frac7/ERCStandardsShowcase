const MaoCoin = artifacts.require("MaoCoin");
const MaoPlatform = artifacts.require("MaoPlatform");
const AnotherReceiver = artifacts.require("AnotherReceiver");

const { singletons } = require("@openzeppelin/test-helpers");

module.exports = async function (deployer, network, accounts) {
  await singletons.ERC1820Registry(accounts[0]);

  await deployer.deploy(MaoCoin, 50, accounts);
  await deployer.deploy(MaoPlatform, MaoCoin.address);
  await deployer.deploy(AnotherReceiver);
};
