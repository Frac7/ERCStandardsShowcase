// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenAsset is ERC20("Token", "TKN") {
    constructor(uint256 amount) {
        _mint(_msgSender(), amount);
    }
}

contract TokenVault is ERC4626 {
    constructor(
        TokenAsset _asset,
        string memory _name,
        string memory _symbol
    ) ERC4626(_asset) ERC20(_name, _symbol) {}

    function getBalance() public view returns (uint256) {
        return totalAssets();
    }

    function mintSharesFromAssets(
        uint256 assets,
        address receiver
    ) public returns (uint256 shares) {
        return deposit(assets, receiver);
    }

    function mintSharesWithoutAssets(
        uint256 shares,
        address receiver
    ) public returns (uint256 assets) {
        return mint(shares, receiver);
    }

    function withdrawByAssetsAndBurnShares(
        uint256 assets,
        address receiver,
        address owner
    ) public returns (uint256 shares) {
        return withdraw(assets, receiver, owner);
    }

    function withdrawBySharesAndBurnShares(
        uint256 shares,
        address receiver,
        address owner
    ) public returns (uint256 assets) {
        return redeem(shares, receiver, owner);
    }
}
