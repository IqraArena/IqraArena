# Deploy Smart Contract to Celo with Thirdweb Gasless Transactions

## Overview

This platform uses **Thirdweb's EIP-7702** to provide completely gasless transactions for users. You sponsor all gas fees through thirdweb's infrastructure, so users never need CELO tokens.

## Prerequisites

1. Install MetaMask browser extension
2. Get some CELO tokens for deployment (only needed once for deploying the contract)
3. Create a thirdweb account at [https://thirdweb.com/dashboard](https://thirdweb.com/dashboard)

## Step 1: Get Thirdweb Client ID

1. Go to [thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project or select an existing one
3. Go to **Settings** > **API Keys**
4. Copy your **Client ID**
5. Save it for later - you'll need it in your `.env` file

## Step 2: Deploy Smart Contract

### Using Remix IDE (Recommended)

1. Go to [Remix IDE](https://remix.ethereum.org/)

2. Create a new file named `IqraArena.sol` and paste the contract code from `/contracts/IqraArena.sol`

3. Compile the contract:
   - Click on "Solidity Compiler" tab (left sidebar)
   - Select compiler version `0.8.x`
   - Click "Compile IqraArena.sol"

4. Connect to Celo Network:
   - Add Celo Mainnet to MetaMask:
     - **Network Name**: Celo Mainnet
     - **RPC URL**: `https://forno.celo.org`
     - **Chain ID**: `42220`
     - **Currency Symbol**: CELO
     - **Block Explorer**: `https://explorer.celo.org`

5. Get CELO tokens:
   - Buy CELO from an exchange (Coinbase, Binance, etc.)
   - Transfer to your MetaMask wallet on Celo Mainnet
   - You'll need a small amount for deployment gas fees

6. Deploy the contract:
   - Click on "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" as environment
   - Make sure MetaMask is connected to Celo Mainnet network
   - Click "Deploy"
   - Confirm the transaction in MetaMask

7. Copy the deployed contract address

### Using thirdweb Deploy (Alternative)

1. Install thirdweb CLI:
   ```bash
   npm install -g thirdweb
   ```

2. Deploy from your project:
   ```bash
   npx thirdweb deploy
   ```

3. Follow the prompts to deploy to Celo Mainnet

## Step 3: Update Environment Variables

Update your `.env` file with:

```
VITE_CONTRACT_ADDRESS=<your_deployed_contract_address>
VITE_THIRDWEB_CLIENT_ID=<your_thirdweb_client_id>
```

## Step 4: Enable Gas Sponsorship in thirdweb

1. Go to [thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Select your project
3. Go to **Engine** > **Gas Credits**
4. Add gas credits to sponsor transactions
5. That's it! thirdweb will automatically sponsor all transactions using EIP-7702

## How It Works

### EIP-7702 Gasless Transactions

thirdweb's EIP-7702 implementation enables gasless transactions by:

1. **User connects wallet** - No CELO tokens needed
2. **User performs action** - Transaction is prepared
3. **thirdweb sponsors gas** - Transaction is executed with sponsored gas
4. **User pays nothing** - Completely free for users

### What Gets Sponsored

All user actions are gasless:
- ✅ Registering with username
- ✅ Recording reading progress (every 5 pages)
- ✅ Recording quiz completions

## Verify Deployment

After deployment, verify your contract on:
- **Celo Mainnet**: https://explorer.celo.org

Search for your contract address to see all transactions.

**Current Contract Address**: `0x92fee4ceb09f5da40525f833be818ca593cf82ff`

## Important Notes

- **Users never pay gas fees** - All transactions are sponsored by you via thirdweb
- **EIP-7702 is automatic** - The SDK handles everything transparently
- **Monitor gas credits** - Keep an eye on your thirdweb gas credit balance
- **Production ready** - Now running on Celo Mainnet
- **Keep keys secure** - Never expose private keys or client secrets

## Celo Network Details

### Sepolia Testnet (Testing)
- **Chain ID**: 11142220
- **RPC**: https://forno.celo-sepolia.celo-testnet.org
- **Explorer**: https://celo-sepolia.blockscout.com
- **Faucet**: https://faucet.celo.org/sepolia

### Celo Mainnet (Production)
- **Chain ID**: 42220
- **RPC**: https://forno.celo.org
- **Explorer**: https://explorer.celo.org

## Troubleshooting

### Gasless transactions not working

1. Verify `VITE_THIRDWEB_CLIENT_ID` is correct in `.env`
2. Check that your thirdweb account has sufficient gas credits
3. Ensure the contract address is correct
4. Confirm you're connected to Celo Mainnet network

### Connection errors

1. Make sure MetaMask is installed and unlocked
2. Verify you're on the correct network (Celo Mainnet)
3. Check that the thirdweb client ID is valid
4. Try refreshing the page

### Need Help?

- [thirdweb Documentation](https://portal.thirdweb.com/)
- [thirdweb Discord](https://discord.gg/thirdweb)
- [Celo Documentation](https://docs.celo.org/)

## Cost Estimate

Typical gas costs per transaction on Celo:
- Register user: ~0.001 CELO
- Record pages: ~0.0005 CELO
- Record quiz: ~0.0005 CELO

With thirdweb gas credits, $10 can sponsor thousands of transactions.
