// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract HybridTokens is ERC1155 {
    uint256 public constant FUNGIBLE_TOKEN = 0;
    uint256 public constant NON_FUNGIBLE_TOKEN = 1;

    uint256 public constant ANOTHER_FUNGIBLE_TOKEN = 2;
    uint256 public constant ANOTHER_NON_FUNGIBLE_TOKEN = 3;

    constructor() ERC1155("") {
        _mint(msg.sender, FUNGIBLE_TOKEN, 100, "");
        _mint(msg.sender, NON_FUNGIBLE_TOKEN, 1, "");

        uint256[] memory tokens = new uint256[](2);
        tokens[0] = ANOTHER_FUNGIBLE_TOKEN;
        tokens[1] = ANOTHER_NON_FUNGIBLE_TOKEN;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 150;
        amounts[1] = 5;

        _mintBatch(msg.sender, tokens, amounts, "");
    }

    function transferToken(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        return safeTransferFrom(from, to, id, amount, data);
    }

    function transferTokens(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        return safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function getBalanceByAddressAndToken(
        address account,
        uint256 id
    ) public view returns (uint256) {
        return balanceOf(account, id);
    }

    function getBalancesByAddressesAndTokens(
        address[] memory accounts,
        uint256[] memory ids
    ) public view returns (uint256[] memory) {
        return balanceOfBatch(accounts, ids);
    }

    function burnToken(address from, uint256 id, uint256 amount) public {
        return _burn(from, id, amount);
    }

    function burnTokens(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public {
        return _burnBatch(from, ids, amounts);
    }
}

contract HybridTokenReceiver is ERC1155Holder {
    HybridTokens private _plantTokenContract;

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
