const Plant = artifacts.require("Plant");
const PlantReceiver = artifacts.require("PlantReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");

module.exports = async function (deployer) {
  await deployer.deploy(Plant);
  await deployer.deploy(PlantReceiver);
  await deployer.deploy(AnotherReceiver);
};
