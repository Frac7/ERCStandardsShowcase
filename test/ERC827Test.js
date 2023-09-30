const WoffCoin = artifacts.require("WoffCoin");
const ERC827Proxy = artifacts.require("ERC827Proxy");

contract("ERC728Example", async (accounts) => {
  beforeEach(async function () {
    this.instance = await WoffCoin.new(50, [accounts[0]]);
  });

  it("", async function () {});
});
