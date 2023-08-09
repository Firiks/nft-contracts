const fs = require("fs");
const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");

// use 1 block confirmation for development and dynamic block confirmations for live networks
const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;

  if (chainId == 31337) {
    // Find ETH/USD price feed
    const EthUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = EthUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  const lowSVG = fs.readFileSync("./data/dynamicSvgNFT/frown.svg", { encoding: "utf8" });
  const highSVG = fs.readFileSync("./data/dynamicSvgNFT/happy.svg", { encoding: "utf8" });

  const args = [ethUsdPriceFeedAddress, lowSVG, highSVG];
  const dynamicSvgNft = await deploy("DynamicSvgNFT", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  // Verify the deployment
  if ( !developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY ) {
    log("Verifying...");
    await verify(dynamicSvgNft.address, args);
  }
}

module.exports.tags = ["all", "dynamicsvg", "main"];