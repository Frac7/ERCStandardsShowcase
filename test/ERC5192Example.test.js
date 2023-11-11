const MSBToken = artifacts.require("MSBToken");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("ERC5192Example", async function (accounts) {
  beforeEach(async function () {
    this.instance = await MSBToken.new("MSBToken", "MSB", true, {
      from: accounts[0],
    });
  });

  it("Should prevent transfer", async function () {
    await this.instance.safeMint(accounts[0], 0);
    expectRevert.unspecified(
      this.instance.safeTransferFrom(accounts[0], accounts[1], 0, {
        from: accounts[0],
      })
    );
    expectRevert.unspecified(
      this.instance.transferFrom(accounts[0], accounts[1], 0, {
        from: accounts[0],
      })
    );
  });

  it("Should prevent approval", async function () {
    await this.instance.safeMint(accounts[0], 0);
    expectRevert.unspecified(
      this.instance.approve(accounts[1], 0, {
        from: accounts[0],
      })
    );
    expectRevert.unspecified(
      this.instance.setApprovalForAll(accounts[1], true, {
        from: accounts[0],
      })
    );
  });

  it("Should support locked interface", async function () {
    assert(await this.instance.supportsInterface.call("0xb45a3c0e"));
  });
});
