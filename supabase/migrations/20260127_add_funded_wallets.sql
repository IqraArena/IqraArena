-- Migration: Add funded_wallets table for tracking wallet funding
-- This table records which wallets have been funded to prevent duplicate funding

CREATE TABLE IF NOT EXISTS funded_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  transaction_hash text NOT NULL,
  amount text NOT NULL DEFAULT '0.001',
  funded_at timestamptz DEFAULT now()
);

-- Create index for efficient lookup by wallet address
CREATE INDEX IF NOT EXISTS idx_funded_wallets_address ON funded_wallets(wallet_address);

-- Enable RLS
ALTER TABLE funded_wallets ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to check if wallet is funded
CREATE POLICY "Allow anonymous to read funded_wallets"
  ON funded_wallets
  FOR SELECT
  TO anon
  USING (true);

-- Allow service role to insert (for edge function)
CREATE POLICY "Allow service role to insert funded_wallets"
  ON funded_wallets
  FOR INSERT
  TO service_role
  WITH CHECK (true);
