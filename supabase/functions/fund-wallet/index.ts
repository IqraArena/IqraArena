// @ts-ignore
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore
import { ethers } from 'https://esm.sh/ethers@6';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        console.log('Fund wallet function invoked');
        const { walletAddress } = await req.json();
        console.log('Request body parsed, walletAddress:', walletAddress);

        if (!walletAddress) {
            return new Response(
                JSON.stringify({ error: 'Wallet address is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const normalizedAddress = walletAddress.toLowerCase();

        // Initialize Supabase client with service role
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Check if already funded
        const { data: existingFunding } = await supabase
            .from('funded_wallets')
            .select('transaction_hash')
            .eq('wallet_address', normalizedAddress)
            .maybeSingle();

        if (existingFunding) {
            return new Response(
                JSON.stringify({
                    message: 'Wallet already funded',
                    transactionHash: existingFunding.transaction_hash
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Get funder wallet private key from secrets
        const funderPrivateKey = Deno.env.get('FUNDER_PRIVATE_KEY');
        if (!funderPrivateKey) {
            console.error('FUNDER_PRIVATE_KEY not configured');
            return new Response(
                JSON.stringify({ error: 'Funding service not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Connect to Base Mainnet
        const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
        const funderWallet = new ethers.Wallet(funderPrivateKey, provider);

        // Check funder balance
        const funderBalance = await provider.getBalance(funderWallet.address);
        const fundingAmount = ethers.parseEther('0.001');

        if (funderBalance < fundingAmount) {
            console.error('Insufficient funder balance:', ethers.formatEther(funderBalance));
            return new Response(
                JSON.stringify({ error: 'Funding service temporarily unavailable' }),
                { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Send ETH to the new wallet
        console.log(`Funding wallet ${walletAddress} with 0.001 ETH...`);
        const tx = await funderWallet.sendTransaction({
            to: walletAddress,
            value: fundingAmount,
        });

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log(`Transaction confirmed: ${receipt.hash}`);

        // Record in database
        const { error: insertError } = await supabase
            .from('funded_wallets')
            .insert({
                wallet_address: normalizedAddress,
                transaction_hash: receipt.hash,
                amount: '0.001',
            });

        if (insertError) {
            console.error('Failed to record funding:', insertError);
            // Transaction succeeded, so still return success
        }

        return new Response(
            JSON.stringify({
                success: true,
                transactionHash: receipt.hash,
                amount: '0.001 ETH'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Funding error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fund wallet' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
