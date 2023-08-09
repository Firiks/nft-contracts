// contracts/BasicNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNFT is ERC721 {
    string public constant TOKEN_URI =
        "https://ipfs.io/ipfs/QmQrBjk9Riv8uaQpEFNjTm2TS19dWGJQfrFtRN55HL9ebm?filename=plink.json"; // point to IPFS metadata, must be in specific format
    uint256 private s_tokenCounter;

    uint8 private s_maxSupply;

    constructor() ERC721("Plink", "PLINK") {
        s_tokenCounter = 0; // initial NFT count
        s_maxSupply = 20; // max NFTs that can be minted
    }

    function mintNft() public {
        require(s_tokenCounter < s_maxSupply, "Max supply reached");

        _safeMint(msg.sender, s_tokenCounter); // mint NFT to sender
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // Check if token exists
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getMaxSupply() public view returns (uint8) {
        return s_maxSupply;
    }
}
