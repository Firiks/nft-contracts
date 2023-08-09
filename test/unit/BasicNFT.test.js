const { assert } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT Unit Tests", function () {
      let basicNFT, deployer;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["basicnft"]);
        // basicNFT = await ethers.getContractFactory("BasicNFT");
        // basicNFT = await basicNFT.deploy();
        basicNFT = await ethers.getContract("BasicNFT");
      });

      describe("Constructor", () => {
        it("Initializes the NFT Correctly.", async () => {
          const name = await basicNFT.name();
          const symbol = await basicNFT.symbol();
          const tokenCounter= await basicNFT.getTokenCounter();
          assert.equal(name, "Plink");
          assert.equal(symbol, "PLINK");
          assert.equal(tokenCounter.toString(),"0");
        });
      });

      describe("Mint NFT", () => {
        beforeEach(async () => {
          const txResponse = await basicNFT.mintNft();
          await txResponse.wait(1);
        });

        it("Allows users to mint an NFT, and updates appropriately", async function () {
          const tokenURI = await basicNFT.tokenURI(0);
          const tokenCounter = await basicNFT.getTokenCounter();

          assert.equal(tokenCounter.toString(), "1");
          assert.equal(tokenURI, await basicNFT.TOKEN_URI());
        });

        it("Show the correct balance and owner of an NFT", async function () {
          const deployerAddress = deployer.address;
          const deployerBalance = await basicNFT.balanceOf(deployerAddress);
          const owner = await basicNFT.ownerOf("0");

          assert.equal(deployerBalance.toString(), "1");
          assert.equal(owner, deployerAddress);
        });
      });
    });