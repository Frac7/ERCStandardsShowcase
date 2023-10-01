const HybridTokens = artifacts.require("HybridTokens");
const HybridTokensReceiver = artifacts.require("HybridTokensReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");

module.exports = async function (deployer, network, accounts) {
  const ids = [0, 1, 2, 3];
  const amounts = [1, 100, 1, 200];

  await deployer.deploy(HybridTokens, ids, amounts, { from: accounts[0] });
  await deployer.deploy(HybridTokensReceiver);
  await deployer.deploy(AnotherReceiver);
};
