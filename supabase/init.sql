-- Drop existing tables if they exist
DROP TABLE IF EXISTS ai_content;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS locations;

-- Create locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    coordinates JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_content table
CREATE TABLE ai_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('location', 'event', 'user')),
    source_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('description', 'summary', 'recommendation')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ai_content_updated_at
    BEFORE UPDATE ON ai_content
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON locations FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON ai_content FOR SELECT USING (true);

-- Add some sample data
INSERT INTO locations (name, description, tags, metadata) VALUES
    ('St. Mary''s Cathedral', 'A historic cathedral showcasing Gothic architecture and religious artifacts.', ARRAY['historical', 'religious', 'architecture'], '{"source": "local", "id": "st-marys-cathedral"}'),
    ('Modern Art Gallery', 'Contemporary art space featuring local and international artists.', ARRAY['art', 'modern', 'cultural'], '{"source": "local", "id": "modern-art-gallery"}'),
    ('Cultural Heritage Museum', 'Museum dedicated to preserving local history and traditions.', ARRAY['museum', 'history', 'cultural'], '{"source": "local", "id": "cultural-heritage-museum"}')
ON CONFLICT DO NOTHING;
