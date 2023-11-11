const CSToken = artifacts.require("CSToken");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(CSToken, {
    from: accounts[0],
  });
};
