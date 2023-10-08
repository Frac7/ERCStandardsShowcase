const TokenAsset = artifacts.require("TokenAsset");
const TokenVault = artifacts.require("TokenVault");

module.exports = async function (deployer, network, accounts) {
  const totalSupply = 100;
  await deployer.deploy(TokenAsset, totalSupply, { from: accounts[0] });
  await deployer.deploy(TokenVault, TokenAsset.address, { from: accounts[0] });
};
