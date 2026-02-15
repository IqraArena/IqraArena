-- Rename the column to reflect the change to ETH
ALTER TABLE funded_wallets RENAME COLUMN amount_celo TO amount_eth;

-- Update the default value to the new amount
ALTER TABLE funded_wallets ALTER COLUMN amount_eth SET DEFAULT 0.00003;
