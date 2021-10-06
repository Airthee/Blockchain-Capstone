const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async function (deployer, network, accounts) {
  const solnSquareVerifier = await SolnSquareVerifier.deployed();
  for (let i = 2; i <= 11; i++) {
    const proof = require(`../../zokrates/code/square/proof${i}.json`);
    await solnSquareVerifier.mint(accounts[0], proof.proof, proof.inputs);
  }
};
