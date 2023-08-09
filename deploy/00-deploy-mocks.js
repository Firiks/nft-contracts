const { network } = require("hardhat");
const { DECIMALS, INITIAL_PRICE, developmentChains } = require("../helper-hardhat-config");

const BASE_FEE = "250000000000000000"; // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9; // link per gas, is this the gas lane? // 0.000000001 LINK per gas

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // If we are on a local development network, we need to deploy mocks!
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");

    // Deploy VRFCoordinatorV2
    const VRFCoordinatorV2Mock = await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    });

    log("VRFCoordinatorV2Mock deployed to:", VRFCoordinatorV2Mock.address);

    // Deploy V3Aggregator (Price Feed)
    const MockV3Aggregator = await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });

    log("MockV3Aggregator deployed to:", MockV3Aggregator.address);

    log("All mocks Deployed!");
    log("You are deploying to a local network, you'll need a local network running to interact");
    log("Please run `npm run console` to interact with the deployed smart contracts!");

  }
}

module.exports.tags = ["all", "mocks", "main"];