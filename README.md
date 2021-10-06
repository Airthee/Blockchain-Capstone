# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product.

## ZoKrates

```bash
docker run -it -v "$(pwd)":"/home/zokrates/code" -w /home/zokrates/code zokrates/zokrates /bin/bash # Run the container
cd ./zokrates/code/square
zokrates compile -i square.code # compile the code
zokrates setup
zokrates compute-witness -o <FILE> -a <a> <b> # adds an example of inputs / outputs
zokrates generate-proof -w <WITNESS_FILE> -j <PROOF_FILE> # creates the proof
zokrates export-verifier -o ../../../eth-contracts/contracts/SquareVerifier.sol # generate the .sol contract
zokrates verify # verify the generated file
```

## Mint X tokens

In sokrates, run the following command to generate X proofs (example for 10) :

```bash
./generateProofs.sh 10
```

# Project Resources

- [Remix - Solidity IDE](https://remix.ethereum.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Truffle Framework](https://truffleframework.com/)
- [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
- [Open Zeppelin ](https://openzeppelin.org/)
- [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
- [Docker](https://docs.docker.com/install/)
- [ZoKrates](https://github.com/Zokrates/ZoKrates)
