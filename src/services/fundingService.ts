import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Funding Service
 * Calls the Supabase Edge Function to auto-fund new users with ETH for gas fees.
 * The admin private key is NEVER exposed to the client — it lives as a Supabase secret.
 */
export class FundingService {
    /**
     * Fund a new user's wallet with ETH for gas fees.
     * This calls the Supabase Edge Function which holds the admin private key securely.
     * 
     * @param walletAddress - The new user's wallet address to fund
     * @returns Object with success status, txHash, and message
     */
    async fundNewUser(walletAddress: string): Promise<{
        success: boolean;
        txHash?: string;
        alreadyFunded?: boolean;
        message: string;
    }> {
        try {
            console.log('🔄 Requesting funding for wallet:', walletAddress);

            // Get the current session for auth
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(`${SUPABASE_URL}/functions/v1/fund-new-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ walletAddress }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('❌ Funding request failed:', data);
                return {
                    success: false,
                    message: data.error || 'فشل شحن المحفظة',
                };
            }

            if (data.alreadyFunded) {
                console.log('ℹ️ Wallet already funded');
                return {
                    success: true,
                    alreadyFunded: true,
                    message: 'المحفظة مشحونة بالفعل',
                };
            }

            console.log('✅ Wallet funded successfully! TX:', data.txHash);
            return {
                success: true,
                txHash: data.txHash,
                message: `تم شحن محفظتك بنجاح بمبلغ ${data.amount} ETH`,
            };

        } catch (error: any) {
            console.error('❌ Funding error:', error);
            return {
                success: false,
                message: error.message || 'فشل الاتصال بخدمة الشحن',
            };
        }
    }

    /**
     * Check if a wallet has already been funded.
     * Uses the Supabase database directly (public read).
     */
    async isWalletFunded(walletAddress: string): Promise<boolean> {
        try {
            const { data } = await supabase
                .from('funded_wallets')
                .select('id')
                .eq('wallet_address', walletAddress.toLowerCase())
                .maybeSingle();

            return !!data;
        } catch {
            return false;
        }
    }
}

export const fundingService = new FundingService();
