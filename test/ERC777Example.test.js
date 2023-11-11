const MaoCoin = artifacts.require("MaoCoin");
const MaoPlatform = artifacts.require("MaoPlatform");
const AnotherReceiver = artifacts.require("AnotherReceiver");

const { expectRevert } = require("@openzeppelin/test-helpers");
const isEqual = require("lodash/isEqual");
const { fromAscii, toAscii } = require("web3-utils");

const TOTAL_SUPPLY = 50;

contract("ERC777Example", async (accounts) => {
  beforeEach(async function () {
    this.instance = await MaoCoin.new(TOTAL_SUPPLY, [accounts[0]]);
  });

  it("Should mint tokens", async function () {
    assert.equal(await this.instance.totalSupply.call(), TOTAL_SUPPLY);
    assert.equal(await this.instance.balanceOf.call(accounts[0]), TOTAL_SUPPLY);

    assert(isEqual(await this.instance.defaultOperators.call(), [accounts[0]]));

    assert.equal(await this.instance.name.call(), "MaoCoin");
    assert.equal(await this.instance.symbol.call(), "MAO");
  });

  it("Should send tokens", async function () {
    const receiver = await MaoPlatform.deployed();
    const AMOUNT = 1;
    const DATA = "Lorem ipsum";

    await this.instance.send(receiver.address, AMOUNT, fromAscii(DATA), {
      from: accounts[0],
    });
    assert.equal(await this.instance.balanceOf.call(receiver.address), AMOUNT);
    assert.equal(toAscii(await receiver.getLastDataReceived.call()), DATA);
  });

  it("Should transfer tokens", async function () {
    const receiver = await AnotherReceiver.deployed();
    const AMOUNT = 1;

    await this.instance.transfer(receiver.address, AMOUNT, {
      from: accounts[0],
    });
    assert.equal(await this.instance.balanceOf.call(receiver.address), AMOUNT);
  });

  it("Should not receive tokens", async function () {
    const receiver = await AnotherReceiver.deployed();
    const AMOUNT = 1;
    const DATA = "Lorem ipsum";

    expectRevert.unspecified(
      this.instance.send(receiver.address, AMOUNT, fromAscii(DATA), {
        from: accounts[0],
      })
    );
  });

  it("Should operate on behalf of holder", async function () {
    const receiver = await MaoPlatform.deployed();
    const AMOUNT = 2;
    const DATA = "Lorem ipsum";

    await this.instance.send(receiver.address, AMOUNT, fromAscii(DATA), {
      from: accounts[0],
    });

    await this.instance.operatorSend(
      receiver.address,
      accounts[1],
      1,
      fromAscii(DATA),
      fromAscii(DATA),
      {
        from: accounts[0],
      }
    );
    assert.equal(await this.instance.balanceOf.call(receiver.address), 1);
    assert.equal(await this.instance.balanceOf.call(accounts[1]), 1);

    const EMPTY_DATA = [];

    await this.instance.operatorBurn(
      receiver.address,
      1,
      EMPTY_DATA,
      EMPTY_DATA,
      {
        from: accounts[0],
      }
    );
    assert.equal(await this.instance.balanceOf.call(receiver.address), 0);
  });

  it("Should not transfer on behalf of holder", async function () {
    const receiver = await MaoPlatform.deployed();
    const AMOUNT = 2;
    const DATA = "Lorem ipsum";

    await this.instance.send(accounts[1], AMOUNT, fromAscii(DATA), {
      from: accounts[0],
    });

    const EMPTY_DATA = [];

    expectRevert.unspecified(
      this.instance.operatorSend(
        receiver.address,
        accounts[1],
        AMOUNT,
        EMPTY_DATA,
        EMPTY_DATA,
        {
          from: receiver.address,
        }
      )
    );
    assert.equal(await this.instance.balanceOf.call(receiver.address), 0);
    assert.equal(await this.instance.balanceOf.call(accounts[1]), AMOUNT);
  });

  it("Should burn tokens", async function () {
    const AMOUNT = 1;
    await this.instance.burn(AMOUNT, []);
    assert.equal(await this.instance.totalSupply.call(), TOTAL_SUPPLY - AMOUNT);
  });

  it("Should notify token holder on transfer", async function () {
    const receiver = await MaoPlatform.deployed();
    const AMOUNT = 2;
    const DATA = "Lorem ipsum";

    await this.instance.send(receiver.address, AMOUNT, fromAscii(DATA), {
      from: accounts[0],
    });
    assert.equal(toAscii(await receiver.getLastDataReceived.call()), DATA);

    const EMPTY_DATA = [];

    await this.instance.operatorSend(
      receiver.address,
      accounts[1],
      1,
      fromAscii(DATA),
      EMPTY_DATA
    );
    assert.equal(toAscii(await receiver.getLastDataSent.call()), DATA);
  });

  it("Should authorize address", async function () {
    const AMOUNT = 5;
    const DATA = [];

    await this.instance.send(accounts[2], AMOUNT, DATA, {
      from: accounts[0],
    });
    await this.instance.authorizeOperator(accounts[1], { from: accounts[2] });

    assert(await this.instance.isOperatorFor.call(accounts[1], accounts[2]));
    await this.instance.operatorSend(accounts[2], accounts[3], 5, DATA, DATA, {
      from: accounts[1],
    });
  });

  it("Should revoke address", async function () {
    await this.instance.authorizeOperator(accounts[1], { from: accounts[2] });
    await this.instance.revokeOperator(accounts[1], { from: accounts[2] });

    const DATA = [];

    assert.isFalse(
      await this.instance.isOperatorFor.call(accounts[1], accounts[2])
    );
    expectRevert.unspecified(
      this.instance.operatorSend(accounts[2], accounts[3], 5, DATA, DATA, {
        from: accounts[1],
      })
    );
  });
});
