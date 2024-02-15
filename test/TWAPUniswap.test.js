const { ethers } = require("hardhat");

describe("TWAPUniswap", async () => {

  let twapUniswap;
  
  beforeEach(async () => {
    const TWAPUniswap = await ethers.getContractFactory("TWAPUniswap");
    const WBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
    const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    twapUniswap = await TWAPUniswap.deploy(WBTC, USDT);    
    await twapUniswap.update();
  });

  it("Should update price averages correctly", async () =>{
    // Test price averages
    const price0Average = await twapUniswap.price0Average();
    const price1Average = await twapUniswap.price1Average();
    console.log(price0Average.toString());
    console.log(price1Average.toString());
  });

  it("Should consult correct amountOut based on token and amountIn", async () => {
    // Perform consult
    const amountIn = 100;
    const token = await twapUniswap.token0();
    const amountOut = await twapUniswap.consult(token, amountIn);
    console.log(amountOut.toString());
  });

  it("Should return correct price for a token", async () => {
    // Perform getPrice
    const token = await twapUniswap.token0();
    const { integer, decimal } = await twapUniswap.getPrice(token);
    console.log(integer.toString());
    console.log(decimal.toString());
  });
});