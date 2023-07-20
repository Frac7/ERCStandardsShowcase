const Mao = artifacts.require("Mao");
const MaoReceiver = artifacts.require("MaoReceiver");
const MaoHolder = artifacts.require("MaoHolder");
const AnotherReceiver = artifacts.require("AnotherReceiver");

contract("ERC777Example", async (accounts) => {
  it("Should mint tokens", async () => {
    const instance = await Mao.deployed();
    assert.equal(await instance.totalSupply.call(), 50);
  });

  it("Should receive tokens", async () => {});

  it("Should send tokens with data", async () => {});

  it("Should not receive tokens", async () => {});

  it("Should transfer on bahalf of holder", async () => {});

  it("Should not transfer on bahalf of holder", async () => {});

  it("Should notify token holder on transfer", async () => {});
});
