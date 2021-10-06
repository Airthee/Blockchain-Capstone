const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

const proof4 = require("../../zokrates/code/square/proof4.json");
const proof6 = require("../../zokrates/code/square/proof6.json");

contract("SolnSquareVerifier", (accounts) => {
  let contract, owner;
  beforeEach(async () => {
    owner = accounts[0];
    contract = await SolnSquareVerifier.new({ from: owner });
  });

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it("should mint a new token", async () => {
    // ACT
    const response = await contract.mint(owner, proof4.proof, proof4.inputs);
    const transferEvent = response.logs.find((log) => log.event === "Transfer");
    const { from, to, tokenId } = transferEvent.args;
    const mintedTokenOwner = await contract.ownerOf(tokenId);
    const solutionAddedEvent = response.logs.find(
      (log) => log.event === "SolutionAdded"
    );
    const isSolutionSubmitted = await contract.isSolutionSubmitted(
      proof4.proof,
      proof4.inputs
    );

    // ASSERT
    assert.isOk(transferEvent);
    assert.equal(web3.utils.hexToNumber(from), 0);
    assert.equal(to, owner);
    assert.equal(mintedTokenOwner, owner);
    assert.isOk(solutionAddedEvent);
    assert.equal(isSolutionSubmitted, true);
  });

  it("should not mint a new token with used proof", async () => {
    // ARRANGE
    await contract.mint(owner, proof4.proof, proof4.inputs);

    // ACT
    let errorMint = null;
    try {
      await contract.mint(owner, proof4.proof, proof4.inputs);
    } catch (error) {
      errorMint = error.reason;
    }

    // ASSERT
    assert.equal(errorMint, "Solution has already been submitted");
  });

  it("should not mint a new token with incorrect proof", async () => {
    // ACT
    let errorMint = null;
    try {
      await contract.mint(
        owner,
        {
          a: [
            "0x2dc9739628eaf4cf18c2cd469ba34f120a1e435bc44bf14a7573307ce637ad78", // changed
            "0x068d2fcfd89cec05c5570c898ad03d96ad1253055279639e66c68f58eed195b3", // changed
          ],
          b: [
            [
              "0x159e1d4be6c67e802e45e520339018bd13f373bb4ada97546ed45db4e1da74ea",
              "0x26537eac9175e15beb92b7411ce9dbb83360df37bb42356a83fb143f623faf65",
            ],
            [
              "0x2911654eb20c7e75c1a5dc9ebdd3413b7b277450031f9205dd5017d34480fb28",
              "0x230c121c2cac590d517b4155c4ee6cdb811c401b5304aa19d63aadce9e7bf151",
            ],
          ],
          c: [
            "0x0b53130493aa61164d9062398ce6217e130c21afabf9da1f1757129fa6d9e0b4",
            "0x170fc9adfeb9cf7199022d723f4e9c42be92dcae6649e5480b7693240a4fa12e",
          ],
        },
        [
          "0x0000000000000000000000000000000000000000000000000000000000000025",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ]
      );
    } catch (error) {
      errorMint = true;
    }

    // ASSERT
    assert.equal(errorMint, true);
  });

  it("should mint a new token with a new proof", async () => {
    // ARRANGE
    await contract.mint(owner, proof4.proof, proof4.inputs);

    // ACT
    const response = await contract.mint(owner, proof6.proof, proof6.inputs);
    const transferEvent = response.logs.find((log) => log.event === "Transfer");
    const { from, to, tokenId } = transferEvent.args;
    const mintedTokenOwner = await contract.ownerOf(tokenId);
    const solutionAddedEvent = response.logs.find(
      (log) => log.event === "SolutionAdded"
    );
    const isSolutionSubmitted = await contract.isSolutionSubmitted(
      proof6.proof,
      proof6.inputs
    );

    // ASSERT
    assert.isOk(transferEvent);
    assert.equal(web3.utils.hexToNumber(from), 0);
    assert.equal(to, owner);
    assert.equal(mintedTokenOwner, owner);
    assert.isOk(solutionAddedEvent);
    assert.equal(isSolutionSubmitted, true);
  });
});
