// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Plant is ERC721 {
    uint256 private _counter;

    constructor() ERC721("Plant", "PLN") {}

    function plantSeed(address to) public returns (uint256) {
        _counter += 1;
        _safeMint(to, _counter);

        return _counter;
    }

    function isAlive(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function gift(uint256 tokenId, address to) public {
        safeTransferFrom(msg.sender, to, tokenId);
    }

    function giftFromNurseryman(
        address from,
        address to,
        uint256 tokenId
    ) public {
        safeTransferFrom(from, to, tokenId);
    }

    function uproot(uint256 tokenId) public {
        _burn(tokenId);
    }

    function getLastPlanted() public view returns (uint256) {
        return _counter;
    }

    function setNurseryman(uint256 tokenId, address to) public {
        approve(to, tokenId);
    }

    function getNurseryman(uint256 tokenId) public view returns (address) {
        return getApproved(tokenId);
    }

    function setNurserymanForAll(address operator) public {
        setApprovalForAll(operator, true);
    }

    function isNurserymanForAll(address operator) public view returns (bool) {
        return isApprovedForAll(msg.sender, operator);
    }
}

contract PlantReceiver is IERC721Receiver {
    Plant private _plantTokenContract;

    function transferFrom(address from, address to, uint256 tokenId) public {
        _plantTokenContract.transferFrom(from, to, tokenId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

contract AnotherReceiver {}
