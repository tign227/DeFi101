const { ethers } = require("hardhat");

describe("ChainlinkOracle", function () {
  it("Should return the latest answer from Chainlink data feed", async function () {
    // AAVE/USD Mainnet
    const aggregatorAddress = "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9"; 
    const ChainlinkOracle = await ethers.getContractFactory("ChainlinkOracle");
    const chainlinkOracle = await ChainlinkOracle.deploy(aggregatorAddress);

    const price = await chainlinkOracle.getChainlinkDataFeedLatestAnswer();
    console.log("Latest answer from Chainlink data feed:", price.toString());
  });
});