// @/server/src/services/blockchain.service.js
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load ABI
const contractABI = require('../config/contractABI.json');

// Load env variables
const CONTRACT_ADDRESS = process.env.GREEN_CREDIT_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.CONTRACT_OWNER_PRIVATE_KEY;
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL;

// Setup provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Setup contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

/**
 * Mint a new GreenCredit NFT to a producer.
 * @param {string} producerWalletAddress - The wallet address of the producer.
 * @param {string} metadataUri - The metadata URI for the NFT.
 * @returns {Promise<{ success: boolean, txHash: string, tokenId: string }>}
 */
async function mintCredit(producerWalletAddress, metadataUri) {
  try {
    const tx = await contract.safeMint(producerWalletAddress, metadataUri);
    const receipt = await tx.wait();

    // Find the Transfer event to get the tokenId
    const transferEvent = receipt.logs
      .map(log => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find(e => e && e.name === 'Transfer');

    const tokenId = transferEvent ? transferEvent.args.tokenId.toString() : null;

    return {
      success: true,
      txHash: receipt.hash,
      tokenId,
    };
  } catch (error) {
    console.error('Minting failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  mintCredit,
};