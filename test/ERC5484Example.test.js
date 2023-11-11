const CSToken = artifacts.require("CSToken");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("ERC5192Example", async function (accounts) {
  const ID = 0;

  beforeEach(async function () {
    this.instance = await CSToken.new({
      from: accounts[0],
    });
  });

  it("Only issuer should burn", async function () {
    const ONLY_ISSUER = 0;
    await this.instance.safeMint(accounts[1], ID, ONLY_ISSUER);
    expectRevert(
      this.instance.burn(ID, {
        from: accounts[1],
      }),
      "Only issuer"
    );

    assert(await this.instance.exists.call(0));

    await this.instance.burn(ID, {
      from: accounts[0],
    });

    assert.isFalse(await this.instance.exists.call(0));
  });

  it("Only owner should burn", async function () {
    const ONLY_OWNER = 1;
    await this.instance.safeMint(accounts[1], ID, ONLY_OWNER);
    expectRevert(
      this.instance.burn(ID, {
        from: accounts[0],
      }),
      "Only owner"
    );
    await this.instance.burn(ID, {
      from: accounts[1],
    });
  });

  it("Only issuer or owner should burn", async function () {
    const BOTH = 2;
    await this.instance.safeMint(accounts[1], ID, BOTH);
    expectRevert(
      this.instance.burn(ID, {
        from: accounts[2],
      }),
      "Only issuer or owner"
    );
  });

  it("Neither should burn", async function () {
    const NEITHER = 3;
    await this.instance.safeMint(accounts[1], ID, NEITHER);
    expectRevert(
      this.instance.burn(ID, {
        from: accounts[0],
      }),
      "Neither"
    );
    expectRevert(
      this.instance.burn(ID, {
        from: accounts[1],
      }),
      "Neither"
    );
  });

  it("Should support consensual soulbound interface", async function () {
    assert(await this.instance.supportsInterface.call("0x0489b56f"));
  });
});
