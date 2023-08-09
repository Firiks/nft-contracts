const { network } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");

// use 1 block confirmation for development and dynamic block confirmations for live networks
const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const BasicNFT = await deploy("BasicNFT", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitBlockConfirmations
  });

  // verify the deployment if deployed on a live network
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(BasicNFT.address, []);
  }
}

module.exports.tags = ["all", "basicnft", "main"];