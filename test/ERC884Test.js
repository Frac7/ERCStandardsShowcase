const TweetShare = artifacts.require("TweetShare");

contract("ERC884Example", async (accounts) => {
  beforeEach(async function () {
    this.instance = await TweetShare.new(50, [accounts[0]]);
  });

  it("", async function () {});
});
