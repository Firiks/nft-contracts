const networkConfig = {
  default: {
    name: "hardhat",
    vrfCoordinatorV2: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    v3Aggregator: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", 
    mintFee: "10000000000000000", // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
  31337: {
    name: "localhost",
    vrfCoordinatorV2: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    v3Aggregator: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", 
    mintFee: "10000000000000000", // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
  11155111: {
    name: "Sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // https://docs.chain.link/data-feeds/price-feeds/addresses
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    callbackGasLimit: "500000", // 500,000 gas
    mintFee: "10000000000000000", // 0.01 ETH
    subscriptionId: "3864",
  },
}

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const DECIMALS = "18";
const INITIAL_PRICE = "200000000000000000000";

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  DECIMALS,
  INITIAL_PRICE,
}
