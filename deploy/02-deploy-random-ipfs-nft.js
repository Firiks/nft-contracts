const { network, ethers } = require("hardhat");
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata");

// use 1 block confirmation for development and dynamic block confirmations for live networks
const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

const FUND_AMOUNT = "1000000000000000000000";
const imagesLocation = "./data/randomIpfsNTF";

// Ipfs uris
let tokenUris = [
  "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
  "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
  "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
];

// Uri metadata template
const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

  // upload own images to pinata
  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris();
  } else {
    console.log("Using default token URIs");
  }

  // handle local network VRFCoordinatorV2Mock subscription
  if (developmentChains.includes(network.name)) {
    log('Using VRFCoordinatorV2Mock');

    const signer = await ethers.getSigner(deployer);

    // create VRFV2 Subscription
    // vrfCoordinatorV2Mock = await ethers.getContractAt('VRFCoordinatorV2Mock', networkConfig[chainId].vrfCoordinatorV2, signer);
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", signer);
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();

    // console.log(transactionResponse);

    const transactionReceipt = await transactionResponse.wait();

    // console.log(transactionReceipt);

    subscriptionId = transactionReceipt.events[0].args.subId;
    // fund the subscription
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  log("----------------------------------------------------");

  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId]["gasLane"],
    networkConfig[chainId]["mintFee"],
    networkConfig[chainId]["callbackGasLimit"],
    tokenUris,
  ];

  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations
  });

  // add consumer to mock if on local network
  if (developmentChains.includes(network.name)) {
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address);
  }

  // Verify the deployment
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...");
    await verify(randomIpfsNft.address, args);
  }
}

/**
 * Uploads images to pinata
 */
async function handleTokenUris() {
  tokenUris = [];

  // store images in ipfs
  const { responses: imageUploadResponses, files } = await storeImages(imagesLocation);

  // then store metadata in ipfs
  for (let imageUploadResponseIndex in imageUploadResponses) {
    // create metadata from template
    let tokenUriMetadata = { ...metadataTemplate };

    // set metadata values
    tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    
    console.log(`Uploading ${tokenUriMetadata.name}...`);
    
    // upload metadata to pinata
    const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata);
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }

  console.log("Token URIs uploaded! They are:");
  console.log(tokenUris);
  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];