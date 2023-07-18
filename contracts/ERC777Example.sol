// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777TokensRecipient.sol";

contract Mao is ERC777 {
    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators
    ) public ERC777("MaoToken", "MAO", defaultOperators) {
        _mint(msg.sender, initialSupply, "", "");
    }
}

contract MaoReceiver is IERC777TokensRecipient {
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public {}
}

contract MaoOperator {}

contract AnotherReceiver {}
