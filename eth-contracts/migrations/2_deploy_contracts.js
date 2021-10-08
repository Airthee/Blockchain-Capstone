// migrating the appropriate contracts
const fs = require("fs");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async function (deployer) {
  await deployer.deploy(SolnSquareVerifier);

  const config = {
    localhost: {
      url: "http://localhost:8545",
      verifierAddress: SolnSquareVerifier.address,
    },
  };
  fs.writeFileSync(
    __dirname + "/../../config/config.json",
    JSON.stringify(config, null, "\t"),
    "utf-8"
  );
};
