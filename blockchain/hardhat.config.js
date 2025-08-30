import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// --- Best Practice: Use a more specific variable name for Amoy ---
const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Check if the required environment variables are set.
if (!POLYGON_AMOY_RPC_URL || !PRIVATE_KEY) {
  console.warn("Please set POLYGON_AMOY_RPC_URL and PRIVATE_KEY in your .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  // The Solidity compiler version remains the same.
  solidity: "0.8.24",

  // Configure the networks that Hardhat can connect to.
  networks: {
    // The default hardhat network for local testing.
    hardhat: {},

    // --- UPDATED: Configuration for the Polygon Amoy testnet ---
    amoy: {
      // The RPC URL to connect to the Amoy network.
      url: "https://rpc-amoy.polygon.technology", 
      
      // The list of accounts to use for transactions.
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      timeout: 120000,
      
      // The official Chain ID for the Amoy testnet.
      chainId: 80002,
    },
  },

  // --- UPDATED: Etherscan configuration for Amoy ---
  // This allows you to verify your contract's source code on Amoy's block explorer.
  etherscan: {
    apiKey: {
      // The API key is specific to the network.
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || ''
    },
    // Add custom chain configuration for Amoy.
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      }
    ]
  },

  // Gas reporter configuration remains the same.
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};

export default config;