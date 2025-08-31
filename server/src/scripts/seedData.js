const fs = require('fs');

// Dummy data for Producer and Buyer wallets
const walletData = [
  {
    role: 'Producer',
    walletAddress: '0xProducerWallet123',
    hydroCoinBalance: 1.5,
    transactions: [
      { mwh: 10, hydroCoin: 0.01, tokenId: '12345' },
      { mwh: 20, hydroCoin: 0.02, tokenId: '67890' },
    ],
  },
  {
    role: 'Buyer',
    walletAddress: '0xBuyerWallet456',
    hydroCoinBalance: 0.75,
    transactions: [
      { mwh: 5, hydroCoin: 0.005, tokenId: '54321' },
      { mwh: 15, hydroCoin: 0.015, tokenId: '09876' },
    ],
  },
];

// Save dummy data to a JSON file
fs.writeFileSync('walletData.json', JSON.stringify(walletData, null, 2));

console.log('Dummy wallet data created successfully.');
