const A = artifacts.require("A");
const LetterUseCase = artifacts.require("LetterUseCase");
const { makeInterfaceId } = require("@openzeppelin/test-helpers");

contract("ERC165Example", async function (accounts) {
  beforeEach(async function () {
    await A.deployed();
    this.useCaseInstance = await LetterUseCase.deployed();
  });

  it("Should not support address(0)", async function () {
    assert.isFalse(
      await this.useCaseInstance.checkIfASupportsInterface("0x00000000")
    );
  });

  it("Should support 0x01ffc9a7", async function () {
    assert(await this.useCaseInstance.checkIfASupportsInterface("0x01ffc9a7"));
  });

  it("Should support 0x01ffc9a7", async function () {
    assert(await this.useCaseInstance.checkIfASupportsInterface("0x35e23170"));
  });

  /*it("Should support calculate interface ID", async function () {
    assert(
      await this.useCaseInstance.checkIfASupportsInterface(
        makeInterfaceId.ERC165(["0x01ffc9a7"]) // TODO: Change arguments
      )
    );
  });*/
});
