const Mao = artifacts.require("Mao");
const MaoPlatform = artifacts.require("MaoPlatform");
const AnotherReceiver = artifacts.require("AnotherReceiver");

const { expectRevert } = require("@openzeppelin/test-helpers");
const isEqual = require("lodash/isEqual");

const { fromAscii, toAscii, fromWei, toWei } = require("web3-utils");

contract("ERC777Example", async (accounts) => {
  beforeEach(async function () {
    this.instance = await Mao.new(50, accounts);
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

    await this.instance.send(receiver.address, 1, fromAscii("Lorem ipsum"), {
      from: accounts[0],
    });
    assert.equal(await this.instance.balanceOf.call(receiver.address), 1);
    assert.equal(
      toAscii(await receiver.getLastDataReceived.call()),
      "Lorem ipsum"
    );
  });

  it("Should transfer tokens", async function () {
    const receiver = await AnotherReceiver.deployed();

    await this.instance.transfer(receiver.address, 1, { from: accounts[0] });
    assert.equal(await this.instance.balanceOf.call(receiver.address), 1);
  });

  it("Should not receive tokens", async function () {
    const receiver = await AnotherReceiver.deployed();

    expectRevert.unspecified(
      this.instance.send(receiver.address, 1, fromAscii("Lorem ipsum"), {
        from: accounts[0],
      })
    );
  });

  it("Should operate on behalf of holder", async function () {
    const receiver = await MaoPlatform.deployed();

    await this.instance.send(receiver.address, 2, fromAscii("Lorem ipsum"), {
      from: accounts[0],
    });

    await this.instance.operatorSend(receiver.address, accounts[1], 2, [], []);
    assert.equal(await this.instance.balanceOf.call(receiver.address), 0);
    assert.equal(await this.instance.balanceOf.call(accounts[1]), 2);
  });

  it("Should not transfer on behalf of holder", async function () {
    const receiver = await MaoPlatform.deployed();

    await this.instance.send(accounts[1], 2, fromAscii("Lorem ipsum"), {
      from: accounts[0],
    });

    expectRevert.unspecified(
      this.instance.operatorSend(receiver.address, accounts[1], 2, [], [], {
        from: receiver.address,
      })
    );
    assert.equal(await this.instance.balanceOf.call(receiver.address), 0);
    assert.equal(await this.instance.balanceOf.call(accounts[1]), 2);
  });

  it("Should burn tokens", async function () {
    await this.instance.burn(1, []);
    assert.equal(await this.instance.totalSupply.call(), 49);
  });

  it("Should notify token holder on transfer", async function () {
    const receiver = await MaoPlatform.deployed();

    await this.instance.send(receiver.address, 2, fromAscii("Lorem ipsum"), {
      from: accounts[0],
    });
    assert.equal(
      toAscii(await receiver.getLastDataReceived.call()),
      "Lorem ipsum"
    );

    await this.instance.operatorSend(
      receiver.address,
      accounts[1],
      1,
      fromAscii("Dolor sit amet"),
      []
    );
    assert.equal(
      toAscii(await receiver.getLastDataSent.call()),
      "Dolor sit amet"
    );
  });
});
