// Hardhat task: Transfer tokens from a whale account on the forked mainnet to the local deployer account
task("forkTransfer", "Transfer token in forking mainnet")
  .addParam(
    "tokenAddress",
    "The address of the asset whick will transfer into deployer",
    undefined,
    types.string
  )
  .addParam(
    "whaleAddress",
    "The EOA hold a large amount of the token",
    undefined,
    types.string
  )
  .addParam(
    "amount",
    "The amount that will transfer to the deploy",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await ethers.getSigners();
    const whale = await ethers.getImpersonatedSigner(taskArgs.whaleAddress);
    const token = await ethers.getContractAt("IERC20", taskArgs.tokenAddress);

    const decimal = await token.decimals();
    const amountTransfer = ethers.parseUnits(taskArgs.amount, decimal);
    console.log("amount", amountTransfer);
    const balanceOfWhale = await token.balanceOf(whale);
    console.log("balanceOfWhale", balanceOfWhale);

    await deployer.sendTransaction({
      to: whale.address,
      value: ethers.parseEther("50.0"), // Sends exactly 50.0 ether for gas fee
    });
    await token
      .connect(whale)
      .transfer(deployer.address, amountTransfer.toString());

    const balance = await token.balanceOf(deployer);
    const symbol = await token.symbol();
    console.log("balance of deployer", balance.toString());
    console.log("symbol of token", symbol);
  });
//trasnfer USDC to deployer
//yarn hardhat forkTransfer --token-address 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 --whale-address 0xD6153F5af5679a75cC85D8974463545181f48772 --amount 100
