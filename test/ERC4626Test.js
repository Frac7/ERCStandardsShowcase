const TokenAsset = artifacts.require("TokenAsset");
const TokenVault = artifacts.require("TokenVault");

contract("ERC4626Example", async function (accounts) {
  const totalSupply = 100;

  beforeEach(async function () {
    this.underlyingAsset = await TokenAsset.new(totalSupply, {
      from: accounts[0],
    });

    this.instance = await TokenVault.new(this.underlyingAsset.address);

    await this.underlyingAsset.approve(this.instance.address, totalSupply, {
      from: accounts[0],
    });
  });

  it("Should deposit - mint shares from assets", async function () {
    const assets = 10;

    const shares = await this.instance.mintSharesFromAssets.call(
      assets,
      accounts[1],
      { from: accounts[0] }
    );

    const balance = await this.instance.getBalance.call();
    assert.equal(assets, balance);
  });

  it("Should deposit - mint shares without assets", async function () {
    const shares = 10;

    const assets = await this.instance.mintSharesWithoutAssets.call(
      shares,
      accounts[1],
      { from: accounts[0] }
    );

    const balance = await this.instance.getBalance.call();
    assert.equal(assets, balance);
  });

  it("Should withdraw - withdraw assets and burn shares", async function () {
    const assets = 10;

    await this.instance.withdrawByAssetsAndBurnShares.call(
      assets,
      accounts[1],
      accounts[0],
      { from: accounts[0] }
    );

    const balance = await this.instance.getBalance.call();
    assert.equal(balance, totalSupply - assets);
  });

  it("Should withdraw - withdraw assets by burning shares", async function () {
    const shares = 10;

    const assets = await this.instance.withdrawBySharesAndBurnShares.call(
      shares,
      accounts[1],
      accounts[0],
      { from: accounts[0] }
    );

    const balance = await this.instance.getBalance.call();
    assert.equal(balance, totalSupply - assets);
  });
});
