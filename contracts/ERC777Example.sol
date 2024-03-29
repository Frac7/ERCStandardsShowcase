// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Sender.sol";

import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/utils/introspection/ERC1820Implementer.sol";

contract MaoCoin is ERC777 {
    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators
    ) ERC777("MaoCoin", "MAO", defaultOperators) {
        _mint(msg.sender, initialSupply, "", "");
    }
}

// See https://github.com/OpenZeppelin/openzeppelin-contracts/blob/7c5f6bc2c8743d83443fa46395d75f2f3f99054a/contracts/mocks/ERC777SenderRecipientMock.sol
contract MaoPlatform is IERC777Recipient, IERC777Sender, ERC1820Implementer {
    bytes private _lastDataReceived;
    bytes private _lastDataSent;

    address private _mao;

    constructor(address maoAddress) {
        _mao = maoAddress;
        _registerERC777Interfaces();
    }

    function _registerERC777Interfaces() private {
        IERC1820Registry _erc1820 = IERC1820Registry(
            0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24
        );
        bytes32 _TOKENS_SENDER_INTERFACE_HASH = keccak256("ERC777TokensSender");
        bytes32 _TOKENS_RECIPIENT_INTERFACE_HASH = keccak256(
            "ERC777TokensRecipient"
        );

        _registerInterfaceForAddress(
            _TOKENS_SENDER_INTERFACE_HASH,
            address(this)
        );
        _registerInterfaceForAddress(
            _TOKENS_RECIPIENT_INTERFACE_HASH,
            address(this)
        );

        _erc1820.setInterfaceImplementer(
            address(this),
            _TOKENS_SENDER_INTERFACE_HASH,
            address(this)
        );
        _erc1820.setInterfaceImplementer(
            address(this),
            _TOKENS_RECIPIENT_INTERFACE_HASH,
            address(this)
        );
    }

    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public override {
        _lastDataReceived = userData;
    }

    function tokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public override {
        _lastDataSent = userData;
    }

    function getLastDataReceived() public view returns (bytes memory) {
        return _lastDataReceived;
    }

    function getLastDataSent() public view returns (bytes memory) {
        return _lastDataSent;
    }
}
