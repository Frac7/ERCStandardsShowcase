const Mao = artifacts.require("Mao");
const MaoPlatform = artifacts.require("MaoPlatform");
const AnotherReceiver = artifacts.require("AnotherReceiver");

const isEqual = require("lodash/isEqual");

contract("ERC777Example", async (accounts) => {
  beforeEach(async function () {
    this.instance = await Mao.deployed();
  });

  it("Should mint tokens", async function () {
    assert.equal(await this.instance.totalSupply.call(), 50);
    assert.equal(await this.instance.balanceOf.call(accounts[0]), 50);
    assert(isEqual(await this.instance.defaultOperators.call(), accounts));
    assert.equal(await this.instance.name.call(), "Mao");
    assert.equal(await this.instance.symbol.call(), "MAO");
  });

  it("Should send tokens", async function () {
    const receiver = await MaoPlatform.deployed();

    await this.instance.send(receiver.address, 1, [], { from: accounts[0] });
    assert.equal(await this.instance.balanceOf.call(receiver.address), 1);
  });

  it("Should transfer tokens", async function () {
    const receiver = await MaoPlatform.deployed();
  });

  it("Should send tokens with data", async function () {});

  it("Should not receive tokens", async function () {});

  it("Should transfer on bahalf of holder", async function () {});

  it("Should not transfer on bahalf of holder", async function () {});

  it("Should notify token holder on transfer", async function () {});
});
