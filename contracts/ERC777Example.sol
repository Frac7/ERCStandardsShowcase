// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC777/ERC777TokensRecipient.sol";

contract Mao is ERC777 {
    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators
    ) public ERC777("MaoToken", "MAO", defaultOperators) {
        _mint(msg.sender, initialSupply, "", "");
    }
}

contract MaoReceiver is ERC777TokensRecipient {}

contract MaoOperator {}

contract AnotherReceiver {}
