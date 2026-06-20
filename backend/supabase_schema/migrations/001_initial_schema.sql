-- Create history table to replace Firestore
CREATE TABLE IF NOT EXISTS history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    total_emissions INTEGER NOT NULL,
    transport_emissions INTEGER DEFAULT 0,
    energy_emissions INTEGER DEFAULT 0,
    food_emissions INTEGER DEFAULT 0,
    consumption_emissions INTEGER DEFAULT 0,
    carbon_score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast history lookups by device
CREATE INDEX IF NOT EXISTS idx_history_device_id ON history(device_id);

-- Create analytics_events table to replace BigQuery
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    total_emissions INTEGER NOT NULL,
    top_category VARCHAR(100),
    diet_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Views
CREATE OR REPLACE VIEW monthly_averages AS
SELECT 
    date_trunc('month', created_at) as month,
    AVG(total_emissions) as avg_emissions,
    COUNT(*) as total_assessments
FROM analytics_events
GROUP BY 1
ORDER BY 1 DESC;
