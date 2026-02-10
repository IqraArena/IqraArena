import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { ethers } from 'https://esm.sh/ethers@6.15.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_RPC = 'https://mainnet.base.org';
const FUNDING_AMOUNT = '0.00003'; // 0.00003 ETH per new user

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { walletAddress } = await req.json();

    // Validate address
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get admin private key from Supabase secrets
    const adminPrivateKey = Deno.env.get('ADMIN_PRIVATE_KEY');
    if (!adminPrivateKey) {
      console.error('ADMIN_PRIVATE_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Funding service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client to check/record funding
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if wallet was already funded
    const { data: existingFunding } = await supabase
      .from('funded_wallets')
      .select('id')
      .eq('wallet_address', walletAddress.toLowerCase())
      .maybeSingle();

    if (existingFunding) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Wallet already funded',
          alreadyFunded: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create provider and signer
    const provider = new ethers.JsonRpcProvider(BASE_RPC);
    const adminWallet = new ethers.Wallet(adminPrivateKey, provider);

    // Check admin balance
    const adminBalance = await provider.getBalance(adminWallet.address);
    const fundingWei = ethers.parseEther(FUNDING_AMOUNT);

    if (adminBalance < fundingWei) {
      console.error('Admin wallet has insufficient balance:', ethers.formatEther(adminBalance));
      return new Response(
        JSON.stringify({ error: 'Funding service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send ETH to user
    console.log(`Funding ${walletAddress} with ${FUNDING_AMOUNT} ETH from ${adminWallet.address}`);

    const tx = await adminWallet.sendTransaction({
      to: walletAddress,
      value: fundingWei,
    });

    console.log('Transaction sent:', tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait(1);
    console.log('Transaction confirmed in block:', receipt?.blockNumber);

    // Record the funding in database
    const { error: insertError } = await supabase
      .from('funded_wallets')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        tx_hash: tx.hash,
        amount_eth: parseFloat(FUNDING_AMOUNT),
      });

    if (insertError) {
      console.error('Failed to record funding (tx still succeeded):', insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        txHash: tx.hash,
        amount: FUNDING_AMOUNT,
        message: `Successfully funded ${walletAddress} with ${FUNDING_AMOUNT} ETH`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Funding error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fund wallet' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
