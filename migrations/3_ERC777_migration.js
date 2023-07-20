const Mao = artifacts.require("Mao");
const MaoReceiver = artifacts.require("MaoReceiver");
const MaoHolder = artifacts.require("MaoHolder");
const AnotherReceiver = artifacts.require("AnotherReceiver");

const { singletons } = require("@openzeppelin/test-helpers");

module.exports = async function (deployer, network, accounts) {
  await singletons.ERC1820Registry(accounts[0]);

  await deployer.deploy(MaoReceiver);
  await deployer.deploy(Mao, 50, accounts);
  await deployer.deploy(MaoHolder);
  await deployer.deploy(AnotherReceiver);
};
