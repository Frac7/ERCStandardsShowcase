pragma solidity ^0.8.1;

import "./ERC5192/ERC5192.sol";
import "./ERC5484/IERC5484.sol";

contract CSToken is ERC5192, IERC5484 {
    mapping(uint256 => BurnAuth) private _burnAuthById;
    address private _issuer;

    error ErrOnlyIssuer();
    modifier onlyIssuer() {
        if (msg.sender != _issuer) revert ErrOnlyIssuer();
        _;
    }

    constructor() ERC5192("CSToken", "CST", true) {
        _issuer = msg.sender;
    }

    function burnAuth(
        uint256 tokenId
    ) external view override returns (BurnAuth) {
        return _burnAuthById[tokenId];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC5484).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        BurnAuth _burnAuth
    ) public onlyIssuer {
        super._mint(to, tokenId);
        _burnAuthById[tokenId] = _burnAuth;
        emit Issued(msg.sender, to, tokenId, _burnAuth);
    }

    function burn(uint256 tokenId) public {
        if (_burnAuthById[tokenId] == BurnAuth.IssuerOnly) {
            require(msg.sender == _issuer, "Only issuer");
            super._burn(tokenId);
        } else if (_burnAuthById[tokenId] == BurnAuth.OwnerOnly) {
            require(msg.sender == _ownerOf(tokenId), "Only owner");
            super._burn(tokenId);
        } else if (_burnAuthById[tokenId] == BurnAuth.Both) {
            require(
                msg.sender == _issuer || msg.sender == _ownerOf(tokenId),
                "Only issuer or owner"
            );
            super._burn(tokenId);
        } else if (_burnAuthById[tokenId] == BurnAuth.Neither) {
            require(
                msg.sender != _issuer && msg.sender != _ownerOf(tokenId),
                "Neither"
            );
            super._burn(tokenId);
        }
    }

    function exists(uint256 tokenId) public returns (bool) {
        return _exists(tokenId);
    }
}
