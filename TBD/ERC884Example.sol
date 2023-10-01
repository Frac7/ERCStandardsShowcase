// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ERC884/contracts/ERC884.sol";

contract TweetShare is ERC827 {
    constructor(
        address initialAccount,
        uint256 initialBalance,
        bytes memory proxyBytecode
    ) public ERC827("TweetShare", "TWS") {
        _mint(initialAccount, initialBalance);
    }
}
