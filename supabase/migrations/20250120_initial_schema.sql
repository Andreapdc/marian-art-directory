-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE source_type AS ENUM ('location', 'event', 'user');
CREATE TYPE content_type AS ENUM ('description', 'summary', 'recommendation');

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    source_type source_type NOT NULL,
    source_id UUID NOT NULL,
    content_type content_type NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS locations_name_idx ON locations USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS locations_tags_idx ON locations USING GIN (tags);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_location_id_idx ON events(location_id);
CREATE INDEX IF NOT EXISTS ai_content_source_idx ON ai_content(source_type, source_id);

-- Create updated_at trigger function
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
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_content_updated_at
    BEFORE UPDATE ON ai_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data
INSERT INTO locations (name, description, tags) VALUES
    ('St. Mary''s Cathedral', 'A historic cathedral showcasing Gothic architecture and religious artifacts.', ARRAY['historical', 'religious', 'architecture']),
    ('Modern Art Gallery', 'Contemporary art space featuring local and international artists.', ARRAY['art', 'modern', 'cultural']),
    ('Cultural Heritage Museum', 'Museum dedicated to preserving local history and traditions.', ARRAY['museum', 'history', 'cultural']);

-- Add sample events
INSERT INTO events (title, description, date, venue, location_id)
SELECT 
    'Guided Cathedral Tour',
    'Expert-led tour of the cathedral''s architecture and history.',
    CURRENT_TIMESTAMP + interval '7 days',
    'St. Mary''s Cathedral Main Hall',
    id
FROM locations 
WHERE name = 'St. Mary''s Cathedral';
