/**
The original code is available here: https://github.com/windingtree/erc827.
This code has been adapted for the project context
 */

/* solium-disable security/no-low-level-calls */

pragma solidity >=0.7.0 <0.9.0;

import "./IERC827.sol";

/**
 * @title ERC827Proxy
 *
 * @dev Proxy to forward contract calls from token contract to any other
 * contract.
 */
contract ERC827Proxy {
    IERC827 public token;

    /**
     * @dev constructor
     */
    constructor() public {
        token = IERC827(msg.sender);
    }

    /**
     * @dev Forward calls only from the token contract that created it
     * @param _target address The address which you want to transfer to
     * @param _data bytes The data to be executed in the call
     */
    function callContract(
        address _target,
        bytes memory _data
    ) public virtual payable returns (bool) {
        require(
            msg.sender == address(token),
            "Proxy only can execute calls from the token contract"
        );
        // solium-disable-next-line security/no-call-value, no-unused-vars
        (bool success, bytes memory data) = _target.call{value: msg.value}(
            _data
        );
        require(success, "Proxy call failed");
        require(
            token.balanceOf(address(this)) == 0,
            "Cant end proxy call with token balance in proxy"
        );
        require(
            address(this).balance == 0,
            "Cant end proxy call with eth balance in proxy"
        );

        selfdestruct(payable(address(0)));
        return true;
    }
}
