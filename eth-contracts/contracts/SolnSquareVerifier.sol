// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";

// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is AirtheeHouseToken, Verifier {
    // define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address account;
    }

    // define an array of the above struct
    Solution[] private solutions;

    // define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) private submittedSolutions;

    // Create an event to emit when a solution is added
    event SolutionAdded(bytes32 index, address account);

    //Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 index, address account) internal {
        require(!submittedSolutions[index], "Solution is already submitted");
        
        solutions.push(Solution(solutions.length, account));
        submittedSolutions[index] = true;

        emit SolutionAdded(index, account);
    }

    // Create a function to mint new NFT only after the solution has been verified
    function mint(address to, Proof memory proof, uint[2] memory inputs) public {
        bytes32 solutionIndex = _getSolutionIndex(proof, inputs);

        //  - make sure the solution is unique (has not been used before)
        require(!submittedSolutions[solutionIndex], "Solution has already been submitted");
        require(verifyTx(proof, inputs), "Solution could not be verified");
        
        //  - make sure you handle metadata as well as tokenSuplly
        addSolution(solutionIndex, to);        
        super.mint(to, solutions.length);
    }

    function isSolutionSubmitted (Proof memory proof, uint[2] memory inputs) public view returns (bool) {
        bytes32 solutionIndex = _getSolutionIndex(proof, inputs);
        return submittedSolutions[solutionIndex];
    }

    function _getSolutionIndex(Proof memory proof, uint[2] memory inputs) pure internal returns (bytes32) {
        return keccak256(abi.encodePacked(proof.a.X, proof.a.Y, proof.b.X, proof.b.Y, proof.c.X, proof.c.Y, inputs)); 
    }
}



  


























