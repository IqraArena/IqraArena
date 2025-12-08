/*
  # Add Wallet Support for Celo Integration

  1. Changes
    - Add `wallet_address` column to profiles table for storing Celo wallet addresses
    - Add `blockchain_username` column to profiles for usernames registered on blockchain
    - Create index on wallet_address for faster lookups
  
  2. Security
    - Maintain existing RLS policies
    - Wallet addresses are publicly readable but only updatable by the user
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'wallet_address'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wallet_address text UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'blockchain_username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN blockchain_username text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);
