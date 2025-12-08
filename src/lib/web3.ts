import { createThirdwebClient, defineChain, getContract, prepareContractCall, readContract, sendTransaction } from 'thirdweb';
import { inAppWallet, preAuthenticate } from 'thirdweb/wallets/in-app';
import { getWalletBalance } from 'thirdweb/wallets';
import { CONTRACT_ABI, CONTRACT_ADDRESS, THIRDWEB_CLIENT_ID } from '../contracts/contractConfig';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

const celoMainnet = defineChain({
  id: 42220,
  name: 'Celo Mainnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celo Explorer',
      url: 'https://explorer.celo.org',
    },
  },
});

export class Web3Service {
  public account: any = null;

  async getConnectedAddress(): Promise<string | null> {
    if (this.account) {
      return this.account.address;
    }
    return null;
  }

  isConnected(): boolean {
    return this.account !== null;
  }

  async checkBalance(): Promise<{ balance: string; hasEnoughForGas: boolean }> {
    if (!this.account) {
      return { balance: '0', hasEnoughForGas: false };
    }

    try {
      const result = await getWalletBalance({
        address: this.account.address,
        client,
        chain: celoMainnet,
      });

      const balanceInCelo = parseFloat(result.displayValue);
      const minimumRequired = 0.01;

      return {
        balance: result.displayValue,
        hasEnoughForGas: balanceInCelo >= minimumRequired,
      };
    } catch (error) {
      console.error('Failed to check balance:', error);
      return { balance: '0', hasEnoughForGas: false };
    }
  }

  async registerUser(username: string): Promise<void> {
    if (!this.account || !CONTRACT_ADDRESS) {
      throw new Error('Wallet not connected or contract not configured');
    }

    const balanceCheck = await this.checkBalance();
    if (!balanceCheck.hasEnoughForGas) {
      throw new Error(`لا يوجد رسوم غاز من عملة Celo كافية لديك بمحفظتك. لديك ${balanceCheck.balance} CELO وتحتاج على الأقل 0.01 CELO. برجاء شحن محفظتك`);
    }

    try {
      const contract = getContract({
        client,
        chain: celoMainnet,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      });

      const transaction = prepareContractCall({
        contract,
        method: 'registerUser',
        params: [username],
      });

      const result = await sendTransaction({
        transaction,
        account: this.account,
      });

      console.log('Transaction sent:', result.transactionHash);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message && error.message.includes('User already registered')) {
        throw new Error('This wallet is already registered');
      }
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction rejected by user');
      }
      throw new Error(`Failed to register user: ${error.message || 'Unknown error'}`);
    }
  }

  async isUserRegistered(address: string): Promise<boolean> {
    if (!CONTRACT_ADDRESS) return false;

    try {
      const contract = getContract({
        client,
        chain: celoMainnet,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      });

      const result = await readContract({
        contract,
        method: 'isUserRegistered',
        params: [address],
      });

      return result as boolean;
    } catch {
      return false;
    }
  }

  async getUser(address: string): Promise<{
    username: string;
    totalPoints: number;
    pagesRead: number;
    quizzesPassed: number;
    lastUpdated: number;
  } | null> {
    if (!CONTRACT_ADDRESS) return null;

    try {
      const contract = getContract({
        client,
        chain: celoMainnet,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      });

      const user = await readContract({
        contract,
        method: 'getUser',
        params: [address],
      }) as any;

      if (!user.exists) {
        return null;
      }

      return {
        username: user.username,
        totalPoints: Number(user.totalPoints),
        pagesRead: Number(user.pagesRead),
        quizzesPassed: Number(user.quizzesPassed),
        lastUpdated: Number(user.lastUpdated),
      };
    } catch {
      return null;
    }
  }

  async recordPagesRead(): Promise<void> {
    console.log('=== RECORD PAGES READ ===');
    console.log('Account:', this.account);
    console.log('Wallet:', this.wallet);
    console.log('CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
    console.log('isConnected():', this.isConnected());

    if (!this.account || !CONTRACT_ADDRESS) {
      console.error('❌ Cannot record pages - wallet not connected or contract not configured');
      console.error('Account exists?', !!this.account);
      console.error('Contract configured?', !!CONTRACT_ADDRESS);
      throw new Error('Wallet not connected or contract not configured');
    }

    const balanceCheck = await this.checkBalance();
    if (!balanceCheck.hasEnoughForGas) {
      throw new Error(`لا يوجد رسوم غاز من عملة Celo كافية لديك بمحفظتك. لديك ${balanceCheck.balance} CELO وتحتاج على الأقل 0.01 CELO. برجاء شحن محفظتك`);
    }

    try {
      const contract = getContract({
        client,
        chain: celoMainnet,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      });

      const transaction = prepareContractCall({
        contract,
        method: 'recordPagesRead',
        params: [5n],
      });

      const result = await sendTransaction({
        transaction,
        account: this.account,
      });

      console.log('Pages recorded:', result.transactionHash);
    } catch (error: any) {
      throw new Error(`Failed to record pages: ${error.message || 'Unknown error'}`);
    }
  }

  async recordQuizPassed(): Promise<void> {
    if (!this.account || !CONTRACT_ADDRESS) {
      throw new Error('Wallet not connected or contract not configured');
    }

    const balanceCheck = await this.checkBalance();
    if (!balanceCheck.hasEnoughForGas) {
      throw new Error(`لا يوجد رسوم غاز من عملة Celo كافية لديك بمحفظتك. لديك ${balanceCheck.balance} CELO وتحتاج على الأقل 0.01 CELO. برجاء شحن محفظتك`);
    }

    try {
      const contract = getContract({
        client,
        chain: celoMainnet,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      });

      const transaction = prepareContractCall({
        contract,
        method: 'recordQuizPassed',
        params: [10n],
      });

      const result = await sendTransaction({
        transaction,
        account: this.account,
      });

      console.log('Quiz recorded:', result.transactionHash);
    } catch (error: any) {
      throw new Error(`Failed to record quiz: ${error.message || 'Unknown error'}`);
    }
  }

  async getLeaderboard(): Promise<{
    addresses: string[];
    usernames: string[];
    points: number[];
  }> {
    if (!CONTRACT_ADDRESS) {
      return { addresses: [], usernames: [], points: [] };
    }

    try {
      const contract = getContract({
        client,
        chain: celoMainnet,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      });

      const result = await readContract({
        contract,
        method: 'getLeaderboard',
        params: [],
      }) as any;

      return {
        addresses: result[0],
        usernames: result[1],
        points: result[2].map((p: bigint) => Number(p)),
      };
    } catch (error: any) {
      console.error('Failed to fetch leaderboard:', error);
      return { addresses: [], usernames: [], points: [] };
    }
  }

}

export const web3Service = new Web3Service();
