const TokenAsset = artifacts.require("TokenAsset");
const TokenVault = artifacts.require("TokenVault");

module.exports = async function (deployer) {

  await deployer.deploy(TokenAsset);
  await deployer.deploy(TokenVault, TokenAsset.address);
};
