// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


/**
 * @title IERC20
 * @dev Interface for the ERC20 standard token.
 */
interface IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() external view returns (uint8);

    /**
     * @dev Returns the total supply of the token.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the account balance of another account with address `owner`.
     */
    function balanceOf(address owner) external view returns (uint256);

    /**
     * @dev Transfers `amount` tokens from the caller's account to account `to`.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Transfers `amount` tokens from account `from` to account `to`.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    /**
     * @dev Sets the allowance of `amount` to `spender` over the caller's tokens.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner`.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to another (`to`).
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by a call to `approve`.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}