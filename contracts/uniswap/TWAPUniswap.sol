// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/lib/contracts/libraries/FixedPoint.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2OracleLibrary.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract TWAPUniswap {
    using FixedPoint for *;

    uint public constant PERIIOD = 10;
    uint8 public constant RESOLUTION = 112;

    IUniswapV2Pair public pair;
    address public token0;
    address public token1;

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;
    uint32 public blockTimeStampLast;

    // encode: price << 112 , decode :price >> 112
    // may overflow when perform math operation
    FixedPoint.uq112x112 public price0Average;
    FixedPoint.uq112x112 public price1Average;

    constructor(address _token0, address _token1) public {
        address _factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
        address _pair = IUniswapV2Factory(_factory).getPair(_token0, _token1);
        token0 = _token0;
        token1 = _token1;
        pair = IUniswapV2Pair(_pair);
        price0CumulativeLast = pair.price0CumulativeLast();
        price1CumulativeLast = pair.price1CumulativeLast();
        (, , blockTimeStampLast) = pair.getReserves();
    }

    function update() external {
        (
            uint _price0Cumulative,
            uint _price1Cumulative,
            uint32 _blockTimeStamp
        ) = UniswapV2OracleLibrary.currentCumulativePrices(address(pair));
        uint32 timeElapsed = _blockTimeStamp - blockTimeStampLast;
        require(timeElapsed >= PERIIOD, "Elapsed time < min");
        price0Average = FixedPoint.uq112x112(
            uint224(_price0Cumulative - price0CumulativeLast) / timeElapsed
        );
        price1Average = FixedPoint.uq112x112(
            uint224(_price1Cumulative - price1CumulativeLast) / timeElapsed
        );

        //store information as a cache
        price0CumulativeLast = _price0Cumulative;
        price1CumulativeLast = _price1Cumulative;
        blockTimeStampLast = _blockTimeStamp;
    }

    function consult(
        address token,
        uint amountIn
    ) external view returns (uint amountOut) {
        require(token == token0 || token == token1);
        if (token == token0) {
            amountOut = price0Average.mul(amountIn).decode144();
        } else {
            require(token == token1, "invalid token");
            amountOut = price1Average.mul(amountIn).decode144();
        }
    }

    function getPrice(
        address token
    ) external view returns (uint112 integer, uint112 decimal) {
        require(token == token0 || token == token1);
        integer = price0Average.decode();
        decimal = uint112(price0Average._x) % RESOLUTION;

        if (token == token1) {
            integer = price1Average.decode();
            decimal = uint112(price1Average._x) % RESOLUTION;
        }
    }
}
