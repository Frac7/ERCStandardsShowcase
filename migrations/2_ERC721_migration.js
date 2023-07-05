const Plant = artifacts.require("Plant");
const PlantReceiver = artifacts.require("PlantReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");
const PlantUseCase = artifacts.require("PlantUseCase");

module.exports = async function (deployer) {
  await deployer.deploy(Plant);
  await deployer.deploy(PlantReceiver);
  await deployer.deploy(AnotherReceiver);
  await deployer.deploy(
    PlantUseCase,
    Plant.address,
    PlantReceiver.address,
    AnotherReceiver.address
  );
};
