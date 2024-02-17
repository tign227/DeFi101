

### Add Liquidity

The user holds a certain amount of tokens, which will be deposited into the liquidity pool. 'a' and 'b' represent the quantities added to Uniswap, calculated by Uniswap. 

![liquity_diagram](/Users/ting/Desktop/github/infru/contracts/uniswap/assert/liquity_diagram.png)

The quantity calculated by Uniswap needs to ensure that the ratio of the two tokens in the liquidity pool remains unchanged.

![liquidity_formula](/Users/ting/Desktop/github/infru/contracts/uniswap/assert/liquidity_formula.png)



The user provides liquidity, Uniswap calculates the value of the tokens, and the schematic returned to the user is as follows: 



![liquidity](/Users/ting/Desktop/github/infru/contracts/uniswap/assert/liquidity.png)



### Code Analysis



```solidity
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external virtual override ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {
        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
        //checkout pair or create a new pair
        address pair = UniswapV2Library.pairFor(factory, tokenA, tokenB);
        //transfer token to Liquidity Pool
        TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
        TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);
        // UniswapV2Pair is IUniswapV2Pair, UniswapV2ERC20 as LP token
        liquidity = IUniswapV2Pair(pair).mint(to);
    }
```



```solidity
function _addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin
    ) internal virtual returns (uint amountA, uint amountB) {
        // create the pair if it doesn't exist yet
        if (IUniswapV2Factory(factory).getPair(tokenA, tokenB) == address(0)) {
            IUniswapV2Factory(factory).createPair(tokenA, tokenB);
        }
        (uint reserveA, uint reserveB) = UniswapV2Library.getReserves(factory, tokenA, tokenB);
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
        		//take all token A
            uint amountBOptimal = UniswapV2Library.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, 'UniswapV2Router: INSUFFICIENT_B_AMOUNT');
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
            		//take all token B
                uint amountAOptimal = UniswapV2Library.quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                require(amountAOptimal >= amountAMin, 'UniswapV2Router: INSUFFICIENT_A_AMOUNT');
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }
```

