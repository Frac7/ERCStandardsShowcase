const { expectRevert } = require("@openzeppelin/test-helpers");

const isEqual = require("lodash/isEqual");

const HybridTokens = artifacts.require("HybridTokens");
const HybridTokensReceiver = artifacts.require("HybridTokensReceiver");
const AnotherReceiver = artifacts.require("AnotherReceiver");

contract("ERC4626Example", async function (accounts) {
  const ids = [0, 1, 2, 3];
  const amounts = [1, 100, 1, 200];

  beforeEach(async function () {
    this.instance = await HybridTokens.new(ids, amounts, { from: accounts[0] });
  });

  it("Should mint hybrid tokens when instantiated", async function () {});
});
