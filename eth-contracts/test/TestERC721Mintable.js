const AirtheeHouseToken = artifacts.require("AirtheeHouseToken");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await AirtheeHouseToken.new({ from: account_one });

      // ACT
      await this.contract.mint(account_one, 0, { gas: 6721975 });
      await this.contract.mint(account_one, 1, { gas: 6721975 });
      await this.contract.mint(account_one, 2, { gas: 6721975 });
      await this.contract.mint(account_two, 3, { gas: 6721975 });
      await this.contract.mint(account_two, 4, { gas: 6721975 });

      // ASSERT
      assert.equal(await this.contract.ownerOf(0), account_one);
      assert.equal(await this.contract.ownerOf(1), account_one);
      assert.equal(await this.contract.ownerOf(2), account_one);
      assert.equal(await this.contract.ownerOf(3), account_two);
      assert.equal(await this.contract.ownerOf(4), account_two);
    });

    it("should return total supply", async function () {
      // ASSERT
      const totalSupply = await this.contract.totalSupply();
      assert.equal(totalSupply, 5);
    });

    it("should get token balance", async function () {
      // ASSERT
      assert.equal(await this.contract.balanceOf(account_one), 3);
      assert.equal(await this.contract.balanceOf(account_two), 2);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      assert.equal(
        await this.contract.tokenURI(0),
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/0"
      );
      assert.equal(
        await this.contract.tokenURI(1),
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1"
      );
      assert.equal(
        await this.contract.tokenURI(2),
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2"
      );
      assert.equal(
        await this.contract.tokenURI(3),
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3"
      );
      assert.equal(
        await this.contract.tokenURI(4),
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/4"
      );
    });

    it("should transfer token from one owner to another", async function () {
      // ARRANGE
      const tokenId = 1;
      const currentOwner = account_one;
      const newOwner = account_two;

      // ACT
      await this.contract.transferFrom(currentOwner, newOwner, tokenId, {
        from: currentOwner,
      });

      // ASSERT
      assert.equal(await this.contract.ownerOf(tokenId), newOwner);
      assert.equal(await this.contract.balanceOf(currentOwner), 2);
      assert.equal(await this.contract.balanceOf(newOwner), 3);
    });

    it("should approve another account for a token");

    it("should allow approved account to transfer a token");
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await AirtheeHouseToken.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      // ARRANGE
      const tokenId = 5;
      const minter = account_two;

      // ACT
      let ownerError = null;
      try {
        await this.contract.mint(minter, tokenId, { from: account_two });
      } catch (error) {
        ownerError = error.reason;
      }

      // ASSERT
      assert.equal(ownerError, "You are not the owner of the contract");
    });

    it("should return contract owner", async function () {
      assert.equal(await this.contract.getOwner(), account_one);
    });
  });

  describe("pausable spec", function () {
    this.beforeEach(async function () {
      this.contract = await AirtheeHouseToken.new({ from: account_one });
    });

    it("should pause the contract", async function () {
      // ACT
      const oldPaused = await this.contract.isPaused();
      const response = await this.contract.pause();
      const newPaused = await this.contract.isPaused();

      // ASSERT
      assert.equal(oldPaused, false);
      assert.equal(newPaused, true);
      assert.equal(
        response.logs.some((l) => l.event === "Paused"),
        true
      );
    });

    it("should not be able to call methods if the contract is paused", async function () {
      // ARRANGE
      await this.contract.pause();
      const tokenId = 6;

      // ACT
      let pauseError = null;
      try {
        await this.contract.mint(account_one, tokenId);
      } catch (error) {
        pauseError = error.reason;
      }

      // ASSERT
      assert.equal(pauseError, "Contract is paused");
    });

    it("should unpause the contract", async function () {
      // ARRANGE
      await this.contract.pause();

      // ACT
      const oldPaused = await this.contract.isPaused();
      const response = await this.contract.unpause();
      const newPaused = await this.contract.isPaused();

      // ASSERT
      assert.equal(oldPaused, true);
      assert.equal(newPaused, false);
      assert.equal(
        response.logs.some((l) => l.event === "Unpaused"),
        true
      );
    });
  });
});
