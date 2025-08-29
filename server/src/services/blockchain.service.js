const { ethers } = require('ethers');

// !! IMPORTANT !!
// You need to create a JSON file with your contract's ABI
// This is generated when you compile your smart contract with Hardhat
const contractABI = require('../config/contractABI.json'); // Create this file

const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER_URL);
const signer = new ethers.Wallet(process.env.CONTRACT_OWNER_PRIVATE_KEY, provider);
const contractAddress = process.env.GREEN_CREDIT_CONTRACT_ADDRESS;

const greenCreditContract = new ethers.Contract(contractAddress, contractABI, signer);

const mintCredit = async (producerWalletAddress, metadataUri) => {
  try {
    console.log(`Minting credit to: ${producerWalletAddress}`);
    // Assuming your contract has a 'safeMint' function like most ERC721 contracts
    const tx = await greenCreditContract.safeMint(producerWalletAddress, metadataUri);
    await tx.wait(); // Wait for the transaction to be mined
    console.log('Minting transaction successful:', tx.hash);
    
    // To get the tokenId, you might need to listen for an event or parse the transaction receipt
    // This part is highly dependent on your smart contract implementation
    // For now, we'll return the hash as a reference.
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error('Error minting credit on blockchain:', error);
    return { success: false, error };
  }
};

const retireCredit = async (tokenId) => {
    try {
        console.log(`Retiring token ID: ${tokenId}`);
        // Assuming your contract has a 'retire' or 'burn' function
        const tx = await greenCreditContract.retire(tokenId);
        await tx.wait();
        console.log('Retire transaction successful:', tx.hash);
        return { success: true, txHash: tx.hash };
    } catch (error) {
        console.error('Error retiring credit on blockchain:', error);
        return { success: false, error };
    }
};

module.exports = {
  mintCredit,
  retireCredit,
};