const { ethers } = require("hardhat");

describe("SwapToken", async () => {
  let swapToken;
  let deployer;
  let dai_addr;
  let wbtc_addr;
  let dai_whale_addr;

  let dai;
  let dai_whale;

  let wbtc;

  beforeEach(async () => {
    const SwapToken = await ethers.getContractFactory("SwapToken");
    swapToken = await SwapToken.deploy();
    [deployer] = await ethers.getSigners();

    dai_addr = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    wbtc_addr = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
    dai_whale_addr = "0x60FaAe176336dAb62e284Fe19B885B095d29fB7F";

    dai = await ethers.getContractAt("IERC20", dai_addr);
    wbtc = await ethers.getContractAt("IERC20", wbtc_addr);

    dai_whale = await ethers.getImpersonatedSigner(dai_whale_addr);
    await deployer.sendTransaction({
      to: dai_whale.address,
      value: ethers.parseEther("50.0"),
    });
  });

  it("should swap tokens correctly", async () => {
    const amountIn = ethers.parseUnits("100", 16);

    await dai.connect(dai_whale).transfer(deployer, amountIn);
    await dai.approve(swapToken, amountIn);
    await swapToken.swap(dai_addr, wbtc_addr, amountIn, 1);
    console.log(`dai in ${amountIn}`);
    console.log(`wbtc out ${await wbtc.balanceOf(deployer)}`);
  });
});
