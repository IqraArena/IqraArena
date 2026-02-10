import { getWalletBalance } from 'thirdweb/wallets';
import { createThirdwebClient, defineChain } from 'thirdweb';
import { THIRDWEB_CLIENT_ID } from '../contracts/contractConfig';

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

const baseMainnet = defineChain({
  id: 8453,
  name: 'Base Mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
  },
});

export async function checkWalletBalance(address: string): Promise<{
  balance: string;
  hasEnoughForGas: boolean;
  balanceInEth: number;
}> {
  try {
    const result = await getWalletBalance({
      address,
      client,
      chain: baseMainnet,
    });

    const balanceInEth = parseFloat(result.displayValue);
    const minimumRequired = 0.00001;

    return {
      balance: result.displayValue,
      hasEnoughForGas: balanceInEth >= minimumRequired,
      balanceInEth,
    };
  } catch (error) {
    console.error('Failed to check balance:', error);
    return {
      balance: '0',
      hasEnoughForGas: false,
      balanceInEth: 0,
    };
  }
}
