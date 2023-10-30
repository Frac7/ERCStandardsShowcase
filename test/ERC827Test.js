const WoffCoin = artifacts.require("WoffCoin");
const WoffProxy = artifacts.require("ERC827Proxy");

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
  });

  it("Should transfer tokens and call the proxy contract function", async function () {
    await this.instance.customTransfer(accounts[1], 5, 0x0, {
      from: accounts[0],
    });
    assert.equal(await this.instance.balanceOf.call(accounts[1]), 5);
  });

  it("Should approve and transfer tokens and call the proxy contract function", async function () {
    await this.instance.customApprove(accounts[1], 5, fromAscii("Ciao!"), {
      from: accounts[0],
    });

    await this.instance.customTransferFrom(
      accounts[0],
      accounts[2],
      5,
      fromAscii("Ciao!"),
      {
        from: accounts[1],
      }
    );
    assert.equal(await this.instance.balanceOf.call(accounts[2]), 5);
  });
});
