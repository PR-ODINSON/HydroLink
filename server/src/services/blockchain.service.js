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
let provider, wallet, contract;

// Check if blockchain configuration is available
if (RPC_URL && PRIVATE_KEY && CONTRACT_ADDRESS) {
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);
    console.log('Blockchain connection configured successfully.');
  } catch (error) {
    console.warn('Blockchain connection failed. Using mock mode.');
    console.warn('Error:', error.message);
    provider = null;
    wallet = null;
    contract = null;
  }
} else {
  console.log('Blockchain configuration not provided. Using mock mode.');
  provider = null;
  wallet = null;
  contract = null;
}

/**
 * Check if blockchain is properly configured
 * @returns {boolean}
 */
function isBlockchainConfigured() {
  return contract && provider && wallet;
}

/**
 * Mint a new GreenCredit NFT to a producer.
 * @param {string} producerWalletAddress - The wallet address of the producer.
 * @param {string} metadataUri - The metadata URI for the NFT.
 * @param {number} mwhSoldOrBought - The amount of MWh sold or bought.
 * @returns {Promise<{ success: boolean, txHash: string, tokenId: string, hydroCoinCredit: number }>}
 */
async function mintCredit(producerWalletAddress, metadataUri, mwhSoldOrBought) {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockTokenId = Math.floor(Math.random() * 1000000).toString();
      const mockTxHash = '0x' + Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const hydroCoinCredit = mwhSoldOrBought * 0.01; // Calculate HydroCoin credits

      console.log('Mock minting credit:', { producerWalletAddress, metadataUri, tokenId: mockTokenId, hydroCoinCredit });

      return {
        success: true,
        txHash: mockTxHash,
        tokenId: mockTokenId,
        hydroCoinCredit,
      };
    }

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
    const hydroCoinCredit = mwhSoldOrBought * 0.01; // Calculate HydroCoin credits

    return {
      success: true,
      txHash: receipt.hash,
      tokenId,
      hydroCoinCredit,
    };
  } catch (error) {
    console.error('Minting failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retire a GreenCredit NFT.
 * @param {string} tokenId - The token ID to retire.
 * @returns {Promise<{ success: boolean, txHash?: string, error?: string }>}
 */
async function retireCredit(tokenId) {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockTxHash = '0x' + Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      console.log('Mock retiring credit:', { tokenId });
      
      return {
        success: true,
        txHash: mockTxHash,
      };
    }

    const tx = await contract.retire(tokenId);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error('Retiring failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Transfer a GreenCredit NFT to another address.
 * @param {string} fromAddress - The current owner's address.
 * @param {string} toAddress - The recipient's address.
 * @param {string} tokenId - The token ID to transfer.
 * @returns {Promise<{ success: boolean, txHash?: string, error?: string }>}
 */
async function transferCredit(fromAddress, toAddress, tokenId) {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockTxHash = '0x' + Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      console.log('Mock transferring credit:', { fromAddress, toAddress, tokenId });
      
      return {
        success: true,
        txHash: mockTxHash,
      };
    }

    const tx = await contract.safeTransferFrom(fromAddress, toAddress, tokenId);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error('Transfer failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get the owner of a specific token.
 * @param {string} tokenId - The token ID.
 * @returns {Promise<{ success: boolean, owner?: string, error?: string }>}
 */
async function getTokenOwner(tokenId) {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockOwner = '0x' + Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      console.log('Mock getting token owner:', { tokenId, owner: mockOwner });
      
      return {
        success: true,
        owner: mockOwner,
      };
    }

    const owner = await contract.ownerOf(tokenId);
    
    return {
      success: true,
      owner,
    };
  } catch (error) {
    console.error('Getting token owner failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if a token is retired.
 * @param {string} tokenId - The token ID.
 * @returns {Promise<{ success: boolean, isRetired?: boolean, error?: string }>}
 */
async function isTokenRetired(tokenId) {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockIsRetired = Math.random() > 0.8; // 20% chance of being retired
      
      console.log('Mock checking if token is retired:', { tokenId, isRetired: mockIsRetired });
      
      return {
        success: true,
        isRetired: mockIsRetired,
      };
    }

    const isRetired = await contract.isRetired(tokenId);
    
    return {
      success: true,
      isRetired,
    };
  } catch (error) {
    console.error('Checking retirement status failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get token metadata URI.
 * @param {string} tokenId - The token ID.
 * @returns {Promise<{ success: boolean, uri?: string, error?: string }>}
 */
async function getTokenURI(tokenId) {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockURI = `https://api.hydrolink.com/metadata/${tokenId}`;
      
      console.log('Mock getting token URI:', { tokenId, uri: mockURI });
      
      return {
        success: true,
        uri: mockURI,
      };
    }

    const uri = await contract.tokenURI(tokenId);
    
    return {
      success: true,
      uri,
    };
  } catch (error) {
    console.error('Getting token URI failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get the balance of tokens for an address.
 * @param {string} ownerAddress - The owner's address.
 * @returns {Promise<{ success: boolean, balance?: number, error?: string }>}
 */
async function getBalance(ownerAddress) {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockBalance = Math.floor(Math.random() * 50);
      const hydroCoinBalance = mockBalance * 0.01; // Convert MWh to HydroCoin

      console.log('Mock getting balance:', { ownerAddress, balance: mockBalance, hydroCoinBalance });

      return {
        success: true,
        balance: hydroCoinBalance,
      };
    }

    const balance = await contract.balanceOf(ownerAddress);
    const hydroCoinBalance = parseInt(balance.toString()) * 0.01; // Convert MWh to HydroCoin

    return {
      success: true,
      balance: hydroCoinBalance,
    };
  } catch (error) {
    console.error('Getting balance failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Set the certifier address (only contract owner can do this).
 * @param {string} certifierAddress - The new certifier's address.
 * @returns {Promise<{ success: boolean, txHash?: string, error?: string }>}
 */
async function setCertifier(certifierAddress) {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockTxHash = '0x' + Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      console.log('Mock setting certifier:', { certifierAddress });
      
      return {
        success: true,
        txHash: mockTxHash,
      };
    }

    const tx = await contract.setCertifier(certifierAddress);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error('Setting certifier failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get the current certifier address.
 * @returns {Promise<{ success: boolean, certifier?: string, error?: string }>}
 */
async function getCertifier() {
  try {
    if (!isBlockchainConfigured()) {
      // Mock response for development
      const mockCertifier = '0x' + Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      console.log('Mock getting certifier:', { certifier: mockCertifier });
      
      return {
        success: true,
        certifier: mockCertifier,
      };
    }

    const certifier = await contract.getCertifier();
    
    return {
      success: true,
      certifier,
    };
  } catch (error) {
    console.error('Getting certifier failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  mintCredit,
  retireCredit,
  transferCredit,
  getTokenOwner,
  isTokenRetired,
  getTokenURI,
  getBalance,
  setCertifier,
  getCertifier,
  isBlockchainConfigured,
};