const Mao = artifacts.require("Mao");
const MaoReceiver = artifacts.require("MaoReceiver");
const MaoHolder = artifacts.require("MaoHolder");
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

  it("Should receive tokens", async function () {});

  it("Should send tokens with data", async function () {});

  it("Should not receive tokens", async function () {});

  it("Should transfer on bahalf of holder", async function () {});

  it("Should not transfer on bahalf of holder", async function () {});

  it("Should notify token holder on transfer", async function () {});
});
