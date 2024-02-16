const { ethers } = require("hardhat");

describe("UniswapV2Liquidity", async () => {
  let uni;
  let dai;
  let uni_amount;
  let dai_amount;
  let uniswapLiquidity;
  let deployer;

  beforeEach(async () => {
    const UNI_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
    const UNI_WAHLE_ADDRESS = "0x1a9C8182C09F50C8318d769245beA52c32BE35BC";

    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const DAI_WAHLE_ADDRESS = "0x60FaAe176336dAb62e284Fe19B885B095d29fB7F";

    const uni_whale = await ethers.getImpersonatedSigner(UNI_WAHLE_ADDRESS);
    const dai_whale = await ethers.getImpersonatedSigner(DAI_WAHLE_ADDRESS);

    uni_amount = ethers.parseUnits("1000", 18);
    dai_amount = ethers.parseUnits("1000", 18);

    [deployer] = await ethers.getSigners();

    const UniswapV2Liquidity = await ethers.getContractFactory(
      "UniswapV2Liquidity"
    );
    uniswapLiquidity = await UniswapV2Liquidity.deploy();

    uni = await ethers.getContractAt("IERC20", UNI_ADDRESS);
    dai = await ethers.getContractAt("IERC20", DAI_ADDRESS);

    await deployer.sendTransaction({
      to: uni_whale.address,
      value: ethers.parseEther("500.0"),
    });

    await deployer.sendTransaction({
      to: dai_whale.address,
      value: ethers.parseEther("500.0"),
    });

    await uni.connect(uni_whale).transfer(deployer, uni_amount);

    await dai.connect(dai_whale).transfer(deployer, dai_amount);

    await uni.approve(uniswapLiquidity.target, uni_amount, {
      from: deployer,
    });
    await dai.approve(uniswapLiquidity.target, dai_amount, {
      from: deployer,
    });
  });

  it("should add liquidity correctly", async () => {
    uniswapLiquidity.on("Log", (messger, value) => {
      console.log("Messger:", messger, "Value:", value.toString(), "WEI");
    });

    await uniswapLiquidity.addLiquidity(uni, dai, uni_amount, dai_amount, {
      from: deployer,
    });
  });

  it("should remove liquidity correctly", async () => {});
});
