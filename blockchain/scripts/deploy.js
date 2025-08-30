import hardhat from "hardhat";
const { ethers } = hardhat;

/**
 * The main function to handle the deployment of the GreenCredit contract.
 */
async function main() {
  console.log("Preparing for deployment...");

  // Get the account that will sign the deployment transaction.
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Check balance before deployment
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");
  
  if (balance === 0n) {
    console.error("❌ Insufficient balance! Please get testnet MATIC from:");
    console.error("🔗 Polygon Amoy Faucet: https://faucet.polygon.technology/");
    console.error("🔗 Alternative Faucet: https://faucets.chain.link/polygon-amoy");
    process.exit(1);
  }

  // Get current gas price and optimize
  const feeData = await ethers.provider.getFeeData();
  console.log("Current gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
  
  // Get the compiled contract artifact
  const GreenCredit = await ethers.getContractFactory("GreenCredit");
  
  // Estimate gas for deployment
  const estimatedGas = await GreenCredit.getDeployTransaction(deployer.address).estimateGas?.() || 100n;
  const estimatedCost = estimatedGas * feeData.gasPrice;
  
  console.log("Estimated gas:", estimatedGas.toString());
  console.log("Estimated cost:", ethers.formatEther(estimatedCost), "MATIC");
  
  if (balance < estimatedCost) {
    console.error("❌ Insufficient balance for deployment!");
    console.error(`Need: ${ethers.formatEther(estimatedCost)} MATIC`);
    console.error(`Have: ${ethers.formatEther(balance)} MATIC`);
    process.exit(1);
  }

  // Deploy with optimized gas settings
  console.log("Deploying GreenCredit contract...");
  const greenCredit = await GreenCredit.deploy(deployer.address, {
    gasLimit: 100n, // Lowered gas limit
    gasPrice: ethers.parseUnits("1", "gwei") // Lowered gas price
  });

  // Wait for deployment
  await greenCredit.waitForDeployment();
  const contractAddress = await greenCredit.getAddress();
  console.log("✅ GreenCredit contract deployed successfully to:", contractAddress);

  // Post-deployment setup with gas optimization
  console.log("Setting the deployer as the initial certifier...");
  try {
    const tx = await greenCredit.setCertifier(deployer.address, {
      gasLimit: 100n, // Reasonable for a simple tx
      gasPrice: ethers.parseUnits("1", "gwei") // Lowered gas price
    });
    await tx.wait();
    console.log("✅ Certifier set successfully.");
  } catch (error) {
    console.log("⚠️ Certifier setup failed (can be done manually later):", error.message);
  }

  // Save deployment info
  console.log("\n📋 Deployment Summary:");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", "Polygon Amoy");
  console.log("Deployer:", deployer.address);
  console.log("Block Explorer:", `https://amoy.polygonscan.com/address/${contractAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });