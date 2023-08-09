# NFT contracts

## Description

Create NFTs using 3 different contracts:

1. Basic NFT contract (ERC721), using own IPFS node
2. Random IPFS image NFT contract, using Pinata to pin images
3. Dynamic SVG NFT contract, host data directly on contract

## Quick start

1. Clone the repo
2. Install dependencies: `npm install` use `--legacy-peer-deps` when encountering errors
3. Create .env file from .env.example `cp .env.example .env` and fill in the values
4. To run tests: `npx hardhat test`
5. To run local node with contract deployed run: `npm run chain`
6. To deploy on testnet: `npm run deploy-sepolia`