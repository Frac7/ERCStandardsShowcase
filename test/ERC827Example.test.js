const WoffCoin = artifacts.require("WoffCoin");
const WoffProxy = artifacts.require("ERC827Proxy");
const WoffReceiver = artifacts.require("WoffReceiver");

const { fromAscii, toAscii } = require("web3-utils");

const TOTAL_SUPPLY = 50;

contract("ERC827Example", async (accounts) => {
  beforeEach(async function () {
    const proxy = await WoffProxy.new({
      from: accounts[0],
    });

    this.instance = await WoffCoin.new(
      accounts[0],
      TOTAL_SUPPLY,
      proxy.constructor.bytecode,
      {
        from: accounts[0],
      }
    );

    this.receiver = await WoffReceiver.new(this.instance.address);
  });

  it("Should transfer tokens and call the contract function", async function () {
    const DATA = "Lorem ipsum";
    const AMOUNT = 5;

    await this.instance.customTransfer(
      this.receiver.address,
      AMOUNT,
      fromAscii(DATA),
      {
        from: accounts[0],
      }
    );
    assert.equal(await this.instance.balanceOf.call(this.receiver.address), AMOUNT);
    assert.equal(toAscii(await this.receiver.getData.call()), DATA);
  });

  it("Should approve and transfer tokens and call the proxy contract function", async function () {
    const DATA = "Lorem ipsum";
    const AMOUNT = 5;

    await this.instance.customApprove(
      this.receiver.address,
      AMOUNT,
      fromAscii(DATA),
      {
        from: accounts[0],
      }
    );
    assert.equal(toAscii(await this.receiver.getData.call()), DATA);

    await this.receiver.makeTransferFrom(
      accounts[0],
      accounts[2],
      5,
      fromAscii(DATA),
      { from: accounts[0] }
    );
    assert.equal(await this.instance.balanceOf.call(accounts[2]), AMOUNT);
  });
});
