const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

const proof = require("../../zokrates/code/square/proof.json");

contract("SolnSquareVerifier", (accounts) => {
  let contract, owner;
  beforeEach(async () => {
    owner = accounts[0];
    contract = await SolnSquareVerifier.new({ from: owner });
  });

  // Test if a new solution can be added for contract - SolnSquareVerifier
  it("should add a new solution", async () => {
    // ACT
    const response = await contract.mint(owner, proof.proof, proof.inputs);
    const solutionAddedEvent = response.logs.find(
      (log) => log.event === "SolutionAdded"
    );
    const isSolutionSubmitted = await contract.isSolutionSubmitted(
      proof.proof,
      proof.inputs
    );

    // ASSERT
    assert.isOk(solutionAddedEvent);
    assert.equal(isSolutionSubmitted, true);
  });

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it("should mint a new token", async () => {
    // ACT
    const response = await contract.mint(owner, proof.proof, proof.inputs);
    const transferEvent = response.logs.find((log) => log.event === "Transfer");
    const { from, to, tokenId } = transferEvent.args;
    const mintedTokenOwner = await contract.ownerOf(tokenId);

    // ASSERT
    assert.isOk(transferEvent);
    assert.equal(web3.utils.hexToNumber(from), 0);
    assert.equal(to, owner);
    assert.equal(mintedTokenOwner, owner);
  });
});
