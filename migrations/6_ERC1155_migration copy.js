const HybridTokens = artifacts.require("HybridTokens");
const HybridTokenReceiver = artifacts.require("HybridTokenReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");

module.exports = async function (deployer) {
  await deployer.deploy(HybridTokens);
  await deployer.deploy(HybridTokenReceiver);
  await deployer.deploy(AnotherReceiver);
};
