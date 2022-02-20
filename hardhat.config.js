require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ALCHEMY_API_KEY = "FggN__A_hciRCWxGCS_E7lTY_jmIp2UX";
const ROPSTEN_PRIVATE_KEY = "c91e7c75c03c0d2814e00b23200a521197c036bb87537cb9bcd1356e410cb4b8";

module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: "./client/src/artifacts",
  },
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
  },
}
}