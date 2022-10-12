// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

interface ILetter {
    function getLetter() external view returns (string memory);
    function setLetter(string memory) external;
}

contract A is ERC165, ILetter {
    string private letter;

    function supportsInterface(bytes4 interfaceId)
        public
        pure
        override
        returns (bool)
    {
        return
            interfaceId == this.supportsInterface.selector ||
            interfaceId == this.getLetter.selector ^ this.setLetter.selector;
    }

    function getLetter() public view override returns (string memory) {
        return letter;
    }

    function setLetter(string memory _letter) public override {
        letter = _letter;
    }
}

contract B {
    address private a;

    // bytes4 private wrongId = 0x00000000;
    // bytes4 private correctId = 0x01ffc9a7;
    // bytes4 private yetAnotherCorrectId = 0x35e23170;

    constructor(address _a) {
        a = _a;
    }

    function checkIfASupportsInterface(bytes4 interfaceId)
        public
        view
        returns (bool)
    {
        return ERC165(a).supportsInterface(interfaceId);
    }
}
