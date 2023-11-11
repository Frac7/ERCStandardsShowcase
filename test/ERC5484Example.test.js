const CSToken = artifacts.require("CSToken");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("ERC5192Example", async function (accounts) {
  beforeEach(async function () {
    this.instance = await CSToken.new({
      from: accounts[0],
    });
  });

  it("Only issuer should burn", async function () {
    await this.instance.safeMint(accounts[1], 0, 0);
    expectRevert(
      this.instance.burn(0, {
        from: accounts[1],
      }),
      "Only issuer"
    );

    assert(await this.instance.exists.call(0));

    await this.instance.burn(0, {
      from: accounts[0],
    });

    assert(!(await this.instance.exists.call(0)));
  });

  it("Only issuer should burn", async function () {
    await this.instance.safeMint(accounts[1], 0, 1);
    expectRevert(
      this.instance.burn(0, {
        from: accounts[0],
      }),
      "Only owner"
    );
    await this.instance.burn(0, {
      from: accounts[1],
    });
  });

  it("Only issuer or owner should burn", async function () {
    await this.instance.safeMint(accounts[1], 0, 2);
    expectRevert(
      this.instance.burn(0, {
        from: accounts[2],
      }),
      "Only issuer or owner"
    );
  });

  it("Neither should burn", async function () {
    await this.instance.safeMint(accounts[1], 0, 3);
    expectRevert(
      this.instance.burn(0, {
        from: accounts[0],
      }),
      "Neither"
    );
    expectRevert(
      this.instance.burn(0, {
        from: accounts[1],
      }),
      "Neither"
    );
  });

  it("Should support consensual soulbound interface", async function () {
    assert(await this.instance.supportsInterface.call("0x0489b56f"));
  });
});
