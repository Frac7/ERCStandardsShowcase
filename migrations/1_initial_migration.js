const A = artifacts.require('A');
const LetterUseCase = artifacts.require('LetterUseCase');

module.exports = async function (deployer) {
  await deployer.deploy(A);
  await deployer.deploy(LetterUseCase);
};