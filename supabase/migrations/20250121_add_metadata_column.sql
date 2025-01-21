-- Create function to add metadata column
CREATE OR REPLACE FUNCTION add_metadata_column(table_name text)
RETURNS void AS $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = $1
        AND column_name = 'metadata'
    ) THEN
        -- Add the column if it doesn't exist
        EXECUTE format('ALTER TABLE %I ADD COLUMN metadata JSONB DEFAULT ''{}''', $1);
    END IF;
END;
$$ LANGUAGE plpgsql;
