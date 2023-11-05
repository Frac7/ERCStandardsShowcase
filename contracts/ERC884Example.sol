// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ERC884/ERC884ReferenceImpl.sol";

contract TweetShare is ERC884ReferenceImpl {
    constructor(uint256 amount) ERC20("TweetShare", "TWS") {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, "TweetShare"));
        addVerified(msg.sender, hash);
        mint(msg.sender, amount);
    }

    function addVerifiedAndTransfer(address to, uint256 amount) public {
        bytes32 hash = keccak256(abi.encodePacked(to, "TweetShare"));
        addVerified(to, hash);
        transfer(to, amount);
    }

    function replaceVerifiedAndTransfer(address from, address to) public {
        bytes32 hash = keccak256(abi.encodePacked(to, "TweetShare"));
        addVerified(to, hash);
        cancelAndReissue(from, to);
    }

    function approveVerifyAndTransferFrom(address to, uint256 amount) public {
        approve(to, amount);
        bytes32 hash = keccak256(abi.encodePacked(to, "TweetShare"));
        addVerified(to, hash);
        transferFrom(msg.sender, to, amount);
    }
}
