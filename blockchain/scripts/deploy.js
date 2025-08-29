import { ethers } from "hardhat";

/**
 * The main function to handle the deployment of the GreenCredit contract.
 */
async function main() {
  console.log("Preparing for deployment...");

  // Get the account that will sign the deployment transaction.
  // In Hardhat, this is the first account from the configured network.
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Get the compiled contract artifact. This is a JSON object representing the contract.
  const GreenCredit = await ethers.getContractFactory("GreenCredit");
  
  // The constructor of GreenCredit.sol requires an 'initialOwner'.
  // We pass the deployer's address to make them the contract owner.
  console.log("Deploying GreenCredit contract...");
  const greenCredit = await GreenCredit.deploy(deployer.address);

  // Wait for the deployment transaction to be mined and confirmed on the blockchain.
  await greenCredit.waitForDeployment();

  // Get the final address of the deployed contract.
  const contractAddress = await greenCredit.getAddress();
  console.log("✅ GreenCredit contract deployed successfully to:", contractAddress);

  // --- Post-Deployment Setup ---
  // It's good practice to perform initial setup in the deployment script.
  // Here, we set an initial Certifier. For this demo, we'll set the deployer
  // as the Certifier so they can start minting credits immediately.
  console.log("Setting the deployer as the initial certifier...");
  const tx = await greenCredit.setCertifier(deployer.address);
  await tx.wait(); // Wait for the transaction to be mined.
  console.log("✅ Certifier set successfully.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });