const truffleAssert = require("truffle-assertions");

const A = artifacts.require("A");
const LetterUseCase = artifacts.require("B");

contract("ERC165Example", async (accounts) => {
  await A.deployed();
  const useCaseInstance = await LetterUseCase.deployed();

  it("Should not support address(0)", async () => {
    truffleAssert.fails(await useCaseInstance.checkIfASupportsInterface(0x00000000));
  });

  it("Should support 0x01ffc9a7", async () => {
    truffleAssert.passes(await useCaseInstance.checkIfASupportsInterface(0x01ffc9a7));
  });

  it("Should support 0x01ffc9a7", async () => {
    truffleAssert.passes(await useCaseInstance.checkIfASupportsInterface(0x35e23170));
  });
});
