// migrating the appropriate contracts
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async function (deployer) {
  await deployer.deploy(SolnSquareVerifier);
};
