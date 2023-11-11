const TweetShare = artifacts.require("TweetShare");

contract("ERC884Example", async (accounts) => {
  beforeEach(async function () {
    this.instance = await TweetShare.new(100, { from: accounts[0] });
  });

  it("Should add verified address and transfer shares to this address", async function () {
    await this.instance.addVerifiedAndTransfer(accounts[1], 50);

    assert.equal(await this.instance.holderCount.call(), 2);
    assert.equal(await this.instance.holderAt.call(1), accounts[1]);
    assert(await this.instance.isVerified.call(accounts[1]));
    assert(await this.instance.isHolder.call(accounts[1]));
    assert.equal(await this.instance.balanceOf.call(accounts[1]), 50);
  });

  it("Should replace verified address and transfer shares to that address", async function () {
    await this.instance.addVerifiedAndTransfer(accounts[1], 50);

    await this.instance.approve(accounts[0], 50, { from: accounts[1] }); // Needed for the new ERC20 implementation
    await this.instance.replaceVerifiedAndTransfer(accounts[1], accounts[2]);

    assert.equal(await this.instance.holderCount.call(), 2);
    assert.equal(await this.instance.holderAt.call(1), accounts[2]);
    assert(await this.instance.isVerified.call(accounts[2]));
    assert(await this.instance.isHolder.call(accounts[2]));

    assert(await this.instance.isSuperseded.call(accounts[1]));
    assert.equal(
      await this.instance.getCurrentFor.call(accounts[1]),
      accounts[2]
    );
    assert.equal(await this.instance.balanceOf.call(accounts[1]), 0);
  });

  it("Should approve address, add verified address and transfer shares with this address", async function () {
    await this.instance.approveAndVerify(accounts[1], 100);
    await this.instance.transferFrom(accounts[0], accounts[1], 100, {
      from: accounts[1],
    });

    assert.equal(await this.instance.holderCount.call(), 1);
    assert(await this.instance.isVerified.call(accounts[1]));

    assert(await this.instance.isHolder.call(accounts[1]));
    assert.isFalse(await this.instance.isHolder.call(accounts[0]));

    assert.equal(await this.instance.balanceOf.call(accounts[0]), 0);
    assert.equal(await this.instance.balanceOf.call(accounts[1]), 100);
  });
});
