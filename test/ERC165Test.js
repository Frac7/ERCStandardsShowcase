const A = artifacts.require("A");
const LetterUseCase = artifacts.require("LetterUseCase");

contract("ERC165Example", async (accounts) => {
  it("Should not support address(0)", async () => {
    await A.deployed();
    const useCaseInstance = await LetterUseCase.deployed();
    assert.isFalse(await useCaseInstance.checkIfASupportsInterface("0x00000000"));
  });

  it("Should support 0x01ffc9a7", async () => {
    await A.deployed();
    const useCaseInstance = await LetterUseCase.deployed();
    assert(await useCaseInstance.checkIfASupportsInterface("0x01ffc9a7"));
  });

  it("Should support 0x01ffc9a7", async () => {
    await A.deployed();
    const useCaseInstance = await LetterUseCase.deployed();
    assert(await useCaseInstance.checkIfASupportsInterface("0x35e23170"));
  });
});
