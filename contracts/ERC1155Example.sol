// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract HybridTokens is ERC1155 {
    constructor(uint256[] memory ids, uint256[] memory amounts) ERC1155("") {
        _mint(msg.sender, ids[0], amounts[ids[0]], "");
        _mint(msg.sender, ids[1], amounts[ids[1]], "");

        uint256[] memory tokens = new uint256[](2);
        tokens[0] = ids[2];
        tokens[1] = ids[3];

        uint256[] memory batchAmounts = new uint256[](2);
        batchAmounts[0] = amounts[ids[2]];
        batchAmounts[1] = amounts[ids[3]];

        _mintBatch(msg.sender, tokens, batchAmounts, "");
    }

    function transferToken(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) public {
        return safeTransferFrom(from, to, id, amount, data);
    }

    function transferTokens(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
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
        address[] calldata accounts,
        uint256[] calldata ids
    ) public view returns (uint256[] memory) {
        return balanceOfBatch(accounts, ids);
    }

    function burnToken(address from, uint256 id, uint256 amount) public {
        return _burn(from, id, amount);
    }

    function burnTokens(
        address from,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) public {
        return _burnBatch(from, ids, amounts);
    }
}

contract HybridTokensReceiver is ERC1155Holder {
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
