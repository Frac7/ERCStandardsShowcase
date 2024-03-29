// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

interface ILetter {
    function getLetter() external view returns (string calldata);

    function setLetter(string calldata) external;
}

contract A is ERC165, ILetter {
    string private letter;

    function supportsInterface(
        bytes4 interfaceId
    ) public pure override returns (bool) {
        return
            interfaceId == this.supportsInterface.selector ||
            interfaceId == this.getLetter.selector ^ this.setLetter.selector;
    }

    function getLetter() public view override returns (string memory) {
        return letter;
    }

    function setLetter(string calldata _letter) public override {
        letter = _letter;
    }
}

contract LetterUseCase {
    address private _a;

    // bytes4 private wrongId = 0x00000000;
    // bytes4 private correctId = 0x01ffc9a7;
    // bytes4 private yetAnotherCorrectId = 0x35e23170;

    constructor(address a) {
        _a = a;
    }

    function checkIfASupportsInterface(
        bytes4 interfaceId
    ) public view returns (bool) {
        return ERC165(_a).supportsInterface(interfaceId);
    }
}