// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ERC884/ERC884ReferenceImpl.sol";

contract TweetShare is ERC884ReferenceImpl {
    constructor(
        address initialAccount,
        uint256 initialBalance,
        bytes memory proxyBytecode
    ) ERC884() ERC20("TweetShare", "TWS") {}
}
