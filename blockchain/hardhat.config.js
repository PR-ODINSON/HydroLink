import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"; // Imports the dotenv library to manage environment variables.

// Retrieve the sensitive information from the .env file.
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Check if the required environment variables are set.
if (!POLYGON_MUMBAI_RPC_URL || !PRIVATE_KEY) {
  console.warn("Please set POLYGON_MUMBAI_RPC_URL and PRIVATE_KEY in your .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  // Define the version of the Solidity compiler to use.
  // This must match the pragma statement in your .sol files.
  solidity: "0.8.24",

  // Configure the networks that Hardhat can connect to.
  networks: {
    // The default network for running tests. It's a fast, in-memory blockchain.
    hardhat: {},

    // Configuration for the Polygon Mumbai testnet.
    mumbai: {
      // The RPC URL to connect to the network.
      url: POLYGON_MUMBAI_RPC_URL || "", // Fallback to an empty string if not set.
      
      // The list of accounts to use for transactions on this network.
      // Hardhat uses the private key to derive the public address and sign transactions.
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], // Use the private key if it exists.
    },
  },

  // Optional: Configure settings for etherscan verification.
  // This allows you to verify your contract's source code on a block explorer.
  etherscan: {
    // You would need an API key from PolygonScan (https://polygonscan.com/)
    apiKey: process.env.POLYGONSCAN_API_KEY, 
  },

  // Optional: Configure gas reporting to see how much each transaction costs.
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY, // Optional: for accurate USD pricing
  },
};

export default config;