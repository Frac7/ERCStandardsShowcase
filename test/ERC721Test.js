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
      instance.setNurseryman(plant, accounts[7], { from: accounts[7] }),
      null,
      "Must not approve if it isn't owner nor operator"
    );

    await instance.setNurseryman(plant, accounts[7], { from: accounts[6] });
    assert.equal(await instance.getNurseryman.call(plant), accounts[7]);
  });

  it('Should approve a token from another "approved for all" address', async () => {
    const instance = await Plant.deployed();

    await instance.plantSeed(accounts[7]);
    const plant = await instance.getLastPlanted.call();

    await instance.setNurserymanForAll(accounts[8], { from: accounts[7] });
    assert(
      await instance.isNurserymanForAll.call(accounts[8], { from: accounts[7] })
    );

    await instance.setNurseryman(plant, accounts[9], { from: accounts[8] });
    assert.equal(await instance.getNurseryman.call(plant), accounts[9]);

    truffleAssert.reverts(
      instance.setNurseryman(plant, accounts[7], { from: accounts[7] }),
      null,
      "Must not approve if it isn't owner nor operator"
    );
  });

  it("Should transfer a token only if it is an approved operator", async () => {
    const instance = await Plant.deployed();

    await instance.plantSeed(accounts[0]);
    const plant = await instance.getLastPlanted.call();

    truffleAssert.reverts(
      instance.giftFromNurseryman(accounts[0], accounts[1], plant, {
        from: accounts[1],
      }),
      null,
      "Must not transfer if it isn't owner nor operator"
    );
    await instance.setNurseryman(plant, accounts[1], { from: accounts[0] });

    await instance.giftFromNurseryman(accounts[0], accounts[2], plant, {
      from: accounts[1],
    });
    assert.equal(await instance.ownerOf.call(plant), accounts[2]);
  });
});
