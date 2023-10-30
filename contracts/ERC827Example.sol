// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ERC827/contracts/ERC827.sol";

contract WoffCoin is ERC827 {
    constructor(
        address initialAccount,
        uint256 initialBalance,
        bytes memory proxyBytecode
    ) ERC827(proxyBytecode) ERC20("WoffCoin", "WOF") {
        _mint(initialAccount, initialBalance);
    }

    function customApprove(
        address _spender,
        uint256 _value,
        bytes calldata _data
    ) public payable returns (bool) {
        return
            approveAndCall(
                _spender,
                _value,
                abi.encodeWithSignature("setData(bytes)", _data)
            );
    }

    function customTransfer(
        address _to,
        uint256 _value,
        bytes calldata _data
    ) public payable returns (bool) {
        return
            transferAndCall(
                _to,
                _value,
                abi.encodeWithSignature("setData(bytes)", _data)
            );
    }

    function customTransferFrom(
        address _from,
        address _to,
        uint256 _value,
        bytes calldata _data
    ) public payable returns (bool) {
        return
            transferFromAndCall(
                _from,
                _to,
                _value,
                abi.encodeWithSignature("setData(bytes)", _data)
            );
    }
}

contract WoffReceiver {
    bytes data;
    WoffCoin coin;

    constructor(address _coin) {
        coin = WoffCoin(_coin);
    }

    event Received(address caller, uint amount, string message);

    function setData(bytes memory _data) public payable {
        data = _data;
    }

    function getData() public view returns (bytes memory) {
        return data;
    }

    function makeTransferFrom(
        address _from,
        address _to,
        uint256 _value,
        bytes calldata _data
    ) public returns (bool) {
        return coin.customTransferFrom(_from, _to, _value, _data);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value, "Fallback was called");
    }

    receive() external payable {
        emit Received(msg.sender, msg.value, "Receive was called");
    }
}
