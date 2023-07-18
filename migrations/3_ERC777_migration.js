const Mao = artifacts.require("Mao");
const MaoReceiver = artifacts.require("MaoReceiver");
const MaoOperator = artifacts.require("MaoOperator");
const AnotherReceiver = artifacts.require("AnotherReceiver");

module.exports = async function (deployer) {
  await deployer.deploy(MaoOperator);
  await deployer.deploy(Mao, 50, [MaoOperator.address]);
  await deployer.deploy(MaoReceiver);
  await deployer.deploy(AnotherReceiver);
};
