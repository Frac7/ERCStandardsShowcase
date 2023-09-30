// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ERC827/contracts/ERC827/ERC827.sol";

contract WoffCoin is ERC827 {
    constructor(
        address initialAccount,
        uint256 initialBalance,
        bytes memory proxyBytecode
    ) public ERC827(proxyBytecode) ERC20("WoffCoin", "WOF") {
        _mint(initialAccount, initialBalance);
    }
}
