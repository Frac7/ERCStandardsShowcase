const { expectRevert } = require("@openzeppelin/test-helpers");

const isEqual = require("lodash/isEqual");
const { fromAscii } = require("web3-utils");

const HybridTokens = artifacts.require("HybridTokens");
const HybridTokensReceiver = artifacts.require("HybridTokensReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");

contract("ERC1155Example", async function (accounts) {
  const ids = [0, 1, 2, 3];
  const amounts = [1, 100, 1, 200];

  beforeEach(async function () {
    this.instance = await HybridTokens.new(ids, amounts, { from: accounts[0] });
  });

  it("Should mint hybrid tokens when instantiated", async function () {
    assert(
      isEqual(
        (
          await this.instance.getBalancesByAddressesAndTokens.call(
            [accounts[0], accounts[0], accounts[0], accounts[0]],
            ids
          )
        ).map((bn) => bn.toNumber()),
        amounts
      )
    );
  });

  it("Should burn tokens", async function () {
    await this.instance.burnTokens(accounts[0], ids.slice(0, 2), [1, 1]);
    assert(
      isEqual(
        (
          await this.instance.getBalancesByAddressesAndTokens.call(
            [accounts[0], accounts[0]],
            ids.slice(0, 2)
          )
        ).map((bn) => bn.toNumber()),
        [amounts[0] - 1, amounts[1] - 1]
      )
    );
    assert(
      isEqual(
        (
          await this.instance.getBalancesByAddressesAndTokens.call(
            [accounts[0], accounts[0]],
            ids.slice(2, 4)
          )
        ).map((bn) => bn.toNumber()),
        amounts.slice(2, 4)
      )
    );
  });

  it("Should transfer tokens", async function () {
    await this.instance.safeBatchTransferFrom(
      accounts[0],
      accounts[1],
      ids.slice(0, 2),
      [1, 1],
      fromAscii(""),
      { from: accounts[0] }
    );
    assert(
      isEqual(
        (
          await this.instance.getBalancesByAddressesAndTokens.call(
            [accounts[0], accounts[1]],
            [ids[0], ids[0]]
          )
        ).map((bn) => bn.toNumber()),
        [amounts[0] - 1, 1]
      )
    );
    assert(
      isEqual(
        (
          await this.instance.getBalancesByAddressesAndTokens.call(
            [accounts[0], accounts[1]],
            [ids[1], ids[1]]
          )
        ).map((bn) => bn.toNumber()),
        [amounts[1] - 1, 1]
      )
    );
  });

  it("Should transfer tokens with receiver only", async function () {
    await HybridTokensReceiver.deployed();
    await AnotherReceiver.deployed();

    expectRevert.unspecified(
      this.instance.transferToken(
        accounts[0],
        AnotherReceiver.address,
        ids[1],
        1,
        fromAscii(""),
        {
          from: accounts[0],
        }
      )
    );
    await this.instance.transferToken(
      accounts[0],
      HybridTokensReceiver.address,
      ids[1],
      1,
      0x0,
      {
        from: accounts[0],
      }
    );
    assert(
      isEqual(
        (
          await this.instance.getBalancesByAddressesAndTokens.call(
            [accounts[0], HybridTokensReceiver.address],
            [ids[1], ids[1]]
          )
        ).map((bn) => bn.toNumber()),
        [amounts[ids[1]] - 1, 1]
      )
    );

    assert(
      isEqual(
        (
          await this.instance.getBalancesByAddressesAndTokens.call(
            [accounts[0], AnotherReceiver.address],
            [ids[1], ids[1]]
          )
        ).map((bn) => bn.toNumber()),
        [amounts[ids[1]] - 1, 0]
      )
    );
  });
});
