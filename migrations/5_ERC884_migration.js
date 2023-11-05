const TweetShare = artifacts.require("TweetShare");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(TweetShare, 100, { from: accounts[0] });
};
