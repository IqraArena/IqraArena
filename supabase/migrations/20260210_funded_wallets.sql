-- Migration: Create funded_wallets table to track which wallets have been auto-funded
-- This prevents double-funding the same wallet

CREATE TABLE IF NOT EXISTS funded_wallets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text UNIQUE NOT NULL,
  tx_hash text NOT NULL,
  amount_celo numeric NOT NULL DEFAULT 0.005,
  funded_at timestamptz DEFAULT now()
);

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_funded_wallets_address ON funded_wallets (wallet_address);

-- Enable RLS
ALTER TABLE funded_wallets ENABLE ROW LEVEL SECURITY;

-- Allow the service role to insert/read (used by Edge Function)
-- No public access needed - only the Edge Function writes to this table
CREATE POLICY "Service role can manage funded_wallets"
  ON funded_wallets
  FOR ALL
  USING (true)
  WITH CHECK (true);
