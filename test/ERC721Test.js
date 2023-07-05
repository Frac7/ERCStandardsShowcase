const Plant = artifacts.require("Plant");
const PlantReceiver = artifacts.require("PlantReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");
const PlantUseCase = artifacts.require("PlantUseCase");

contract("ERC721Example", async (accounts) => {
  it("Should mint a plant", async () => {
    await Plant.deployed();
    const useCaseInstance = await PlantUseCase.deployed();

    await useCaseInstance.mint(accounts[0]);
    const plant = await useCaseInstance.getLastTokenId.call();

    assert(await useCaseInstance.exists.call(plant));
  });

  it("Should assign a plant", async () => {
    await Plant.deployed();
    const useCaseInstance = await PlantUseCase.deployed();

    await useCaseInstance.mint(accounts[1]);
    const plant = await useCaseInstance.getLastTokenId.call();

    assert.equal(await useCaseInstance.getBalance.call(accounts[1]), 1);
    assert.equal(await useCaseInstance.getOwner.call(plant), accounts[1]);
  });

  it("Should uproot a plant", async () => {
    await Plant.deployed();
    const useCaseInstance = await PlantUseCase.deployed();

    await useCaseInstance.mint(accounts[2]);
    assert.equal(await useCaseInstance.getBalance.call(accounts[2]), 1);

    const plant = await useCaseInstance.getLastTokenId.call();

    await useCaseInstance.burn(plant);
    assert.equal(await useCaseInstance.getBalance.call(accounts[2]), 0);
    assert.isFalse(await useCaseInstance.exists.call(plant));
  });
});
