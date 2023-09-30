const { expectRevert } = require("@openzeppelin/test-helpers");

const HybridTokens = artifacts.require("HybridTokens");
const HybridTokensReceiver = artifacts.require("HybridTokensReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");

contract("ERC1155Example", async function (accounts) {
  this.ids = [1, 2, 3, 4];
  this.amounts = [1, 100, 1, 200];

  beforeEach(async function () {
    this.instance = await HybridTokens.new(this.ids, this.amounts);
  });

  it("Should mint hybrid tokens when instantiated", async function () {
    assert.equal(
      await this.instance.getBalancesByAddressesAndTokens.call(
        [accounts[0]],
        this.ids
      ),
      this.amounts
    );
  });

  it("Should burn tokens", async function () {
    await this.instance.burnTokens(address[0], this.ids.slice(0, 2));
    assert.equal(
      await this.instance.getBalancesByAddressesAndTokens.call(
        [accounts[1]],
        this.ids.slice(0, 2)
      ),
      [0, 0]
    );
    assert.equal(
      await this.instance.getBalancesByAddressesAndTokens.call(
        [accounts[1]],
        this.ids.slice(2, 4)
      ),
      this.amounts.slice(2, 4)
    );
  });

  it("Should transfer tokens", async function () {
    await this.instance.safeBatchTransferFrom(
      address[0],
      address[1],
      this.ids.slice(0, 2),
      [1, 1],
      { from: accounts[0] }
    );
    assert.equal(
      await this.instance.getBalancesByAddressesAndTokens.call(
        [accounts[0], accounts[1]],
        this.ids.slice(0, 2)
      ),
      0
    );
  });

  it("Should transfer tokens with receiver only", async function () {
    await HybridTokensReceiver.deployed();
    await AnotherReceiver.deployed();

    expectRevert.unspecified(
      this.instance.transferToken(
        address[0],
        AnotherReceiver.address,
        this.ids[1],
        1,
        {
          from: accounts[0],
        }
      )
    );
    assert(
      this.instance.transferToken(
        address[0],
        HybridTokensReceiver.address,
        this.ids[1],
        1,
        {
          from: accounts[0],
        }
      )
    );
    assert.equal(
      await this.instance.getBalancesByAddressesAndTokens.call(
        [accounts[0], HybridTokensReceiver.address],
        [this.ids[1], this.ids[1]]
      ),
      [this.amounts[this.ids[1]] - 1, 1]
    );

    assert.equal(
      await this.instance.getBalancesByAddressesAndTokens.call(
        [accounts[0], AnotherReceiver.address],
        [this.ids[1], this.ids[1]]
      ),
      [this.amounts[this.ids[1]] - 1, 0]
    );
  });
});
