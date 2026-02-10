/*
  # Pregenerated Wallets Table
  
  1. New Tables
    - `pregenerated_wallets`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, unique) - User email address
      - `wallet_address` (text) - Pregenerated wallet address (EOA)
      - `user_id` (text) - ThirdWeb user ID
      - `claimed` (boolean) - Whether the wallet has been claimed
      - `created_at` (timestamptz) - When the wallet was pregenerated
      - `claimed_at` (timestamptz) - When the wallet was claimed
  
  2. Security
    - Enable RLS on `pregenerated_wallets` table
    - Add policy for service role to manage wallets
    - Add policy for authenticated users to view their own wallet
  
  3. Important Notes
    - This table stores pregenerated wallets for smoother onboarding
    - Wallets can be pre-funded before users sign up
    - Users automatically receive their pregenerated wallet when they authenticate
*/

CREATE TABLE IF NOT EXISTS pregenerated_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  wallet_address text NOT NULL,
  user_id text NOT NULL,
  claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  claimed_at timestamptz
);

-- Enable RLS
ALTER TABLE pregenerated_wallets ENABLE ROW LEVEL SECURITY;

-- Service role can manage all wallets
CREATE POLICY "Service role can manage pregenerated wallets"
  ON pregenerated_wallets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can view their own wallet
CREATE POLICY "Users can view own pregenerated wallet"
  ON pregenerated_wallets
  FOR SELECT
  TO authenticated
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pregenerated_wallets_email ON pregenerated_wallets(email);
CREATE INDEX IF NOT EXISTS idx_pregenerated_wallets_claimed ON pregenerated_wallets(claimed);