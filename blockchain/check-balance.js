import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const address = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
  const balance = await ethers.provider.getBalance(address);
  console.log(`Balance: ${ethers.formatEther(balance)} MATIC`);
}

main().catch(console.error);
