// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ERC5192/ERC5192.sol";

contract MSBToken is ERC5192 {
    bool private isLocked;

    constructor(
        string memory _name,
        string memory _symbol,
        bool _isLocked
    ) ERC5192(_name, _symbol, _isLocked) {
        isLocked = _isLocked;
    }

    function safeMint(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
        if (isLocked) {
            emit Locked(tokenId);
        }
    }
}
