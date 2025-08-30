import hardhat from "hardhat";
const { ethers } = hardhat;

/**
 * Local deployment script for testing on Hardhat network
 */
async function main() {
  console.log("🔧 Deploying to local Hardhat network...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Local network has plenty of ETH, no need to check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy contract
  const GreenCredit = await ethers.getContractFactory("GreenCredit");
  console.log("Deploying GreenCredit contract...");
  
  const greenCredit = await GreenCredit.deploy(deployer.address);
  await greenCredit.waitForDeployment();

  const contractAddress = await greenCredit.getAddress();
  console.log("✅ GreenCredit contract deployed to:", contractAddress);

  // Set up certifier
  console.log("Setting up initial certifier...");
  const tx = await greenCredit.setCertifier(deployer.address);
  await tx.wait();
  console.log("✅ Certifier set successfully.");

  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  // Test minting a credit
  const mintTx = await greenCredit.safeMint(
    deployer.address,
    "https://api.hydrolink.dev/metadata/1", // metadata URI
    { gasLimit: 200000 }
  );
  await mintTx.wait();
  console.log("✅ Test credit minted successfully");

  // Check if the credit was minted (token ID 0 should exist)
  const tokenOwner = await greenCredit.ownerOf(0);
  console.log("Token ID 0 owner:", tokenOwner);
  console.log("✅ Credit verification successful");

  console.log("\n📋 Local Deployment Summary:");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Hardhat Local");
  console.log("Deployer:", deployer.address);
  console.log("RPC URL: http://localhost:8545");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });