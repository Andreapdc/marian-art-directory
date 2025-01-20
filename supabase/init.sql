-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    coordinates JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_content table
CREATE TABLE IF NOT EXISTS ai_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('location', 'event', 'user')),
    source_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('description', 'summary', 'recommendation')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data
INSERT INTO locations (name, description, tags) VALUES
    ('St. Mary''s Cathedral', 'A historic cathedral showcasing Gothic architecture and religious artifacts.', ARRAY['historical', 'religious', 'architecture']),
    ('Modern Art Gallery', 'Contemporary art space featuring local and international artists.', ARRAY['art', 'modern', 'cultural']),
    ('Cultural Heritage Museum', 'Museum dedicated to preserving local history and traditions.', ARRAY['museum', 'history', 'cultural'])
ON CONFLICT DO NOTHING;
