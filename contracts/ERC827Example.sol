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
        bytes memory _data
    ) public payable returns (bool) {
        return approveAndCall(_spender, _value, _data);
    }

    function customTransfer(
        address _to,
        uint256 _value,
        bytes memory _data
    ) public payable returns (bool) {
        return transferAndCall(_to, _value, _data);
    }

    function customTransferFrom(
        address _from,
        address _to,
        uint256 _value,
        bytes memory _data
    ) public payable returns (bool) {
        return transferFromAndCall(_from, _to, _value, _data);
    }
}
