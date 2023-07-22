const Mao = artifacts.require("Mao");
const MaoPlatform = artifacts.require("MaoPlatform");
const AnotherReceiver = artifacts.require("AnotherReceiver");

const { singletons } = require("@openzeppelin/test-helpers");

module.exports = async function (deployer, network, accounts) {
  await singletons.ERC1820Registry(accounts[0]);

  await deployer.deploy(MaoPlatform);
  await deployer.deploy(Mao, 50, accounts);
  await deployer.deploy(AnotherReceiver);
};
