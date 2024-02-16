//SPDX-License-Identifier:MIT
pragma solidity ^0.6.6;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IERC20.sol";

contract UniswapV2Liquidity {

    address constant ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    event Log(string messger, uint value);

    function addLiquidity(address _tokenA, address _tokenB, uint _amountA, uint _amountB) external {

        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        IERC20(_tokenA).approve(ROUTER, _amountA);
        IERC20(_tokenB).approve(ROUTER, _amountB);

        (uint amountA, uint amountB, uint liquidity) = IUniswapV2Router02(ROUTER).addLiquidity(_tokenA, _tokenB, _amountA, _amountB, 1, 1, address(this), block.timestamp);

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
        emit Log("liquidity", liquidity);
    }

    function removeLiquidity() external returns (uint amountA, uint amountB) {


    }
}