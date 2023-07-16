const truffleAssert = require("truffle-assertions");

const Plant = artifacts.require("Plant");
const PlantReceiver = artifacts.require("PlantReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");

contract("ERC721Example", async (accounts) => {
  it("Should mint a plant", async () => {
    const instance = await Plant.deployed();

    await instance.plantSeed(accounts[0]);
    const plant = await instance.getLastPlanted.call();

    assert(await instance.isAlive.call(plant));
  });

  it("Should assign a plant", async () => {
    const instance = await Plant.deployed();

    await instance.plantSeed(accounts[1]);
    const plant = await instance.getLastPlanted.call();

    assert.equal(await instance.balanceOf.call(accounts[1]), 1);
    assert.equal(await instance.ownerOf.call(plant), accounts[1]);
  });

  it("Should uproot a plant", async () => {
    const instance = await Plant.deployed();

    await instance.plantSeed(accounts[2]);
    assert.equal(await instance.balanceOf.call(accounts[2]), 1);

    const plant = await instance.getLastPlanted.call();

    await instance.uproot(plant);
    assert.equal(await instance.balanceOf.call(accounts[2]), 0);
    assert.isFalse(await instance.isAlive.call(plant));
  });

  it("Should gift a plant", async () => {
    const instance = await Plant.deployed();

    await instance.plantSeed(accounts[3]);
    const plant = await instance.getLastPlanted.call();
    assert.equal(await instance.balanceOf.call(accounts[3]), 1);
    assert.equal(await instance.balanceOf.call(accounts[4]), 0);

    await instance.gift(plant, accounts[4], { from: accounts[3] });
    assert.equal(await instance.balanceOf.call(accounts[3]), 0);
    assert.equal(await instance.balanceOf.call(accounts[4]), 1);
  });

  it("Should gift a plant with receiver only", async () => {
    const instance = await Plant.deployed();
    await PlantReceiver.deployed();
    await AnotherReceiver.deployed();

    await instance.plantSeed(accounts[5]);
    const plant = await instance.getLastPlanted.call();

    truffleAssert.reverts(
      instance.gift(plant, AnotherReceiver.address, {
        from: accounts[5],
      })
    );
    assert(
      await instance.gift(plant, PlantReceiver.address, {
        from: accounts[5],
      })
    );
    assert.equal(await instance.balanceOf.call(PlantReceiver.address), 1);
    assert.equal(await instance.balanceOf.call(AnotherReceiver.address), 0);
    assert.equal(await instance.balanceOf.call(accounts[5]), 0);
  });

  it("Should approve a token from owner only", async () => {
    const instance = await Plant.deployed();

    await instance.plantSeed(accounts[6]);
    const plant = await instance.getLastPlanted.call();

    truffleAssert.reverts(
      instance.setNurseryman(plant, accounts[8], { from: accounts[8] })
    );

    await instance.setNurseryman(plant, accounts[7], { from: accounts[6] });
    assert.equal(await instance.getNurseryman.call(plant), accounts[7]);

    truffleAssert.reverts(
      instance.gift(plant, accounts[8], { from: accounts[8] })
    );

    await instance.gift(plant, accounts[8], { from: accounts[7] });
    assert.equal(instance.ownerOf.call(plant), accounts[8]);
  });

  it('Should approve a token from another "approved for all" address', async () => {
    const instance = await Plant.deployed();

    await instance.plantSeed(accounts[9]);
    const plant = await instance.getLastPlanted.call();

    await instance.setNurserymanForAll(accounts[0], { from: accounts[9] });
    assert(
      await instance.isNurserymanForAll.call(accounts[0], { from: accounts[9] })
    );

    truffleAssert.reverts(
      instance.gift(plant, accounts[8], { from: accounts[8] })
    );
    await instance.gift(plant, accounts[8], { from: accounts[0] });
    assert.equal(instance.ownerOf.call(plant), accounts[3]);

    await instance.setNurseryman(plant, accounts[1], { from: accounts[0] });
    assert.equal(await instance.getNurseryman.call(plant), accounts[1]);

    truffleAssert.reverts(
      instance.setNurseryman(plant, accounts[2], { from: accounts[0] })
    );
  });
});
