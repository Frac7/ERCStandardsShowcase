const MSBToken = artifacts.require("MSBToken");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MSBToken, "MSBToken", "MSB", true, {
    from: accounts[0],
  });
};
