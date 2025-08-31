# Wallet Balance Component

## Overview
The `WalletBalance` component displays the current HydroCoin balance for users in the sidebar. It's designed to work for both Buyer and Producer dashboards.

## Features
- **Real-time Balance**: Fetches balance from blockchain service
- **Fallback Support**: Shows demo balance when API is unavailable
- **Auto-refresh**: Manual refresh button for updated balance
- **Status Indicators**: Visual indicators for balance levels (Low, Fair, Good, Excellent)
- **Wallet Address Display**: Shows truncated wallet address
- **Last Updated Timestamp**: Tracks when balance was last refreshed

## Integration
The component is automatically integrated into the sidebar at the bottom for all user roles.

## API Endpoint
- **Route**: `GET /api/blockchain/balance/:address`
- **Authentication**: Required (JWT token)
- **Response**: `{ success: boolean, balance: number, message: string }`

## Fallback Behavior
When the blockchain API is unavailable:
1. Shows mock balance for demonstration
2. Displays error message with retry option
3. Logs fallback behavior to console

## Styling
- Uses Tailwind CSS classes
- Responsive design
- Color-coded balance levels
- Gradient background for visual appeal

## Dependencies
- React hooks (useState, useEffect)
- Lucide React icons
- AuthContext for user data
- Fetch API for HTTP requests

## Usage
The component automatically renders in the sidebar when a user is authenticated. No additional configuration required.
