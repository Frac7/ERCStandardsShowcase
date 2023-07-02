// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Plant is ERC721 {
    uint256 private _counter;

    constructor() ERC721("Plant", "PLN") {}

    function plantSeed(address to) public returns (uint256) {
        _safeMint(to, _counter);
        _counter += 1;

        return _counter;
    }

    function isAlive(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function gift(uint256 tokenId, address to) public {
        safeTransferFrom(msg.sender, to, tokenId);
    }

    function uproot(uint256 tokenId) public {
        _burn(tokenId);
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

contract PlantUseCase {
    Plant private _plantTokenContract;
    PlantReceiver private _plantReceiverContract;
    AnotherReceiver private _anotherReceiver;

    function mint(address to) public returns (uint256) {
        return _plantTokenContract.plantSeed(to);
    }

    function exists(uint256 tokenId) public returns (bool) {
        return _plantTokenContract.isAlive(tokenId);
    }

    function transfer(uint256 tokenId, address to) public {
        _plantTokenContract.gift(tokenId, to);
    }

    function burn(uint256 tokenId) public {
        _plantTokenContract.uproot(tokenId);
    }

    function getBalance(address owner) public view returns (uint256) {
        return _plantTokenContract.balanceOf(owner);
    }

    function getOwner(uint256 tokenId) public view returns (address) {
        return _plantTokenContract.ownerOf(tokenId);
    }

    function transferWithoutApproval(address from, uint256 tokenId) public {
        _plantReceiverContract.transferFrom(from, address(_anotherReceiver), tokenId);
    }

    function transferWithApproval(
        address from,
        uint256 tokenId
    ) public {
        _plantTokenContract.setApprovalForAll(address(_anotherReceiver), true);
        _plantReceiverContract.transferFrom(from, address(_anotherReceiver), tokenId);
    }
}
