const { network, ethers } = require("hardhat");
const {
  developmentChains,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();

  // Basic NFT
  const basicNFT = await ethers.getContract("BasicNFT", deployer);
  const basicMintTx = await basicNFT.mintNft();
  await basicMintTx.wait(1);
  console.log(`Basic NFT index 0 tokenURI: ${await basicNFT.tokenURI(0)}`);

  // Dynamic SVG  NFT
  const highValue = ethers.utils.parseEther("4000");
  const dynamicSvgNFT = await ethers.getContract("DynamicSvgNFT", deployer);
  const dynamicSvgNFTMintTx = await dynamicSvgNFT.mintNft(highValue);
  await dynamicSvgNFTMintTx.wait(1);
  console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNFT.tokenURI(0)}`);

  // Random IPFS NFT
  const randomIpfsNFT = await ethers.getContract("RandomIpfsNFT", deployer);
  const mintFee = await randomIpfsNFT.getMintFee();
  const randomIpfsNFTMintTx = await randomIpfsNFT.requestNft({ value: mintFee.toString() });
  const randomIpfsNFTMintTxReceipt = await randomIpfsNFTMintTx.wait(1);

  // Need to listen for response
  await new Promise(async (resolve, reject) => {
    setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000); // 5 minute timeout time
    // setup listener for our event
    randomIpfsNFT.once("NftMinted", async () => {
      console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNFT.tokenURI(0)}`);
      resolve();
    });

    // If we are on a development network, then we can fulfill the request ourselves
    if ( developmentChains.includes(network.name) ) {
      const requestId = randomIpfsNFTMintTxReceipt.events[1].args.requestId.toString();
      const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
      await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNFT.address);
    }
  });
}

module.exports.tags = ["all", "mint"];