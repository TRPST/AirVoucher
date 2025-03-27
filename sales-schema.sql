-- -- Schema for voucher status management

-- -- Ensure status field in mobile_data_vouchers has proper constraints
ALTER TABLE mobile_data_vouchers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'available';
-- -- The updated_at column doesn't exist in the schema, so we're removing it

-- -- Update mobile_data_vouchers table to allow storing pin and serial number
ALTER TABLE mobile_data_vouchers 
  ADD COLUMN IF NOT EXISTS voucher_pin VARCHAR(100),
  ADD COLUMN IF NOT EXISTS voucher_serial_number VARCHAR(100);

-- -- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mobile_data_vouchers_status ON mobile_data_vouchers(status);
CREATE INDEX IF NOT EXISTS idx_mobile_data_vouchers_supplier_name ON mobile_data_vouchers(supplier_name);
CREATE INDEX IF NOT EXISTS idx_mobile_data_vouchers_vendorId ON mobile_data_vouchers(vendorId);

-- -- Note: We are using the existing voucher_sells table for sales tracking
-- -- The table has the following structure:
-- /*
-- CREATE TABLE IF NOT EXISTS voucher_sells (
--   id SERIAL PRIMARY KEY,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   supplier_id INTEGER NOT NULL,
--   terminal_id VARCHAR(50) NOT NULL,
--   retailer_id VARCHAR(50) NOT NULL,
--   voucher_amount VARCHAR(20) NOT NULL,
--   voucher_group_id INTEGER,
--   voucher_name VARCHAR(255),
--   voucher_pin VARCHAR(100) NOT NULL,
--   total_comm VARCHAR(20),
--   retailer_comm VARCHAR(20),
--   sales_agent_comm VARCHAR(20),
--   profit VARCHAR(20),
--   net_profit VARCHAR(20)
-- );
-- */ 