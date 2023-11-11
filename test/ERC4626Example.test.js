const TokenAsset = artifacts.require("TokenAsset");
const TokenVault = artifacts.require("TokenVault");

contract("ERC4626Example", async function (accounts) {
  const totalSupply = 100;

  beforeEach(async function () {
    this.underlyingAsset = await TokenAsset.new(totalSupply, {
      from: accounts[0],
    });
    this.instance = await TokenVault.new(
      this.underlyingAsset.address,
      "Token",
      "TKN"
    );
    await this.underlyingAsset.approve(this.instance.address, totalSupply, {
      from: accounts[0],
    });
  });

  it("Should deposit - mint shares from assets", async function () {
    const assets = 10;
    await this.instance.mintSharesFromAssets(assets, accounts[0], {
      from: accounts[0],
    });

    const balance = await this.instance.getBalance.call();
    assert.equal(assets, balance);
  });

  it("Should deposit - mint shares without assets", async function () {
    const shares = 2;
    await this.instance.mintSharesWithoutAssets(shares, accounts[0], {
      from: accounts[0],
    });

    const balance = await this.instance.getBalance.call();
    const assets = await this.instance.convertToAssets.call(shares);
    assert.equal(assets.toNumber(), balance.toNumber());
  });

  it("Should withdraw - withdraw assets and burn shares", async function () {
    const assets = 10;
    await this.instance.mintSharesFromAssets(assets, accounts[0], {
      from: accounts[0],
    });

    await this.instance.withdrawByAssetsAndBurnShares(
      assets,
      accounts[0],
      accounts[0],
      { from: accounts[0] }
    );

    const balance = await this.instance.getBalance.call();
    assert.equal(balance.toNumber(), 0);
  });

  it("Should withdraw - withdraw assets by burning shares", async function () {
    const shares = 10;
    await this.instance.mintSharesWithoutAssets(shares, accounts[0], {
      from: accounts[0],
    });

    await this.instance.withdrawBySharesAndBurnShares(
      shares,
      accounts[0],
      accounts[0],
      { from: accounts[0] }
    );

    const balance = await this.instance.getBalance.call();
    assert.equal(balance.toNumber(), 0);
  });
});
