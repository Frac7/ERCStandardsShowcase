// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Example is ERC721 {
    constructor() ERC721("ERC721Example", "ERC721") {}

    function awardItem(
        address player,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 newItemId = totalSupply();
        _safeMint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
