import { getWalletBalance } from 'thirdweb/wallets';
import { createThirdwebClient, defineChain } from 'thirdweb';
import { THIRDWEB_CLIENT_ID } from '../contracts/contractConfig';

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

const celoSepolia = defineChain({
  id: 11142220,
  name: 'Celo Sepolia',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo-sepolia.celo-testnet.org'],
    },
  },
});

export async function checkWalletBalance(address: string): Promise<{
  balance: string;
  hasEnoughForGas: boolean;
  balanceInCelo: number;
}> {
  try {
    const result = await getWalletBalance({
      address,
      client,
      chain: celoSepolia,
    });

    const balanceInCelo = parseFloat(result.displayValue);
    const minimumRequired = 0.01;

    return {
      balance: result.displayValue,
      hasEnoughForGas: balanceInCelo >= minimumRequired,
      balanceInCelo,
    };
  } catch (error) {
    console.error('Failed to check balance:', error);
    return {
      balance: '0',
      hasEnoughForGas: false,
      balanceInCelo: 0,
    };
  }
}
