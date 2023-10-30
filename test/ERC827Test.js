const WoffCoin = artifacts.require("WoffCoin");
const WoffProxy = artifacts.require("ERC827Proxy");
const WoffReceiver = artifacts.require("WoffReceiver");

const { fromAscii, toAscii } = require("web3-utils");

contract("ERC827Example", async (accounts) => {
  beforeEach(async function () {
    const proxy = await WoffProxy.new({
      from: accounts[0],
    });

    this.instance = await WoffCoin.new(
      accounts[0],
      50,
      proxy.constructor.bytecode,
      {
        from: accounts[0],
      }
    );

    this.receiver = await WoffReceiver.new(this.instance.address);
  });

  it("Should transfer tokens and call the contract function", async function () {
    await this.instance.customTransfer(
      this.receiver.address,
      5,
      fromAscii("Hola!"),
      {
        from: accounts[0],
      }
    );
    assert.equal(await this.instance.balanceOf.call(this.receiver.address), 5);
    assert.equal(await this.receiver.getData.call(), fromAscii("Hola!"));
  });

  it("Should approve and transfer tokens and call the proxy contract function", async function () {
    await this.instance.customApprove(
      this.receiver.address,
      5,
      fromAscii("Ciao!"),
      {
        from: accounts[0],
      }
    );
    assert.equal(await this.receiver.getData.call(), fromAscii("Ciao!"));

    await this.receiver.makeTransferFrom(
      accounts[0],
      accounts[2],
      5,
      fromAscii("Hi!"),
      { from: accounts[0] }
    );
    assert.equal(await this.instance.balanceOf.call(accounts[2]), 5);
  });
});
