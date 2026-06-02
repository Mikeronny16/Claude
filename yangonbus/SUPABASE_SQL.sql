-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Stops table
CREATE TABLE stops (
  id INTEGER PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  name_en TEXT NOT NULL,
  name_mm TEXT,
  road_en TEXT,
  road_mm TEXT,
  township_en TEXT,
  township_mm TEXT,
  location GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(lng, lat), 4326)) STORED
);

-- Full-text search index
CREATE INDEX stops_name_search ON stops USING gin(to_tsvector('simple', coalesce(name_en,'') || ' ' || coalesce(name_mm,'') || ' ' || coalesce(township_en,'')));
-- Spatial index
CREATE INDEX stops_location_idx ON stops USING gist(location);

-- Routes table
CREATE TABLE routes (
  id TEXT PRIMARY KEY,
  name_mm TEXT NOT NULL,
  color TEXT DEFAULT 'E42313',
  stop_ids JSONB NOT NULL DEFAULT '[]'::jsonb,  -- ordered array of stop IDs
  shape_coords JSONB,  -- [[lng,lat], ...] for map display
  stop_count INTEGER GENERATED ALWAYS AS (jsonb_array_length(stop_ids)) STORED
);

-- Route-stop junction for efficient lookups
CREATE TABLE route_stops (
  route_id TEXT REFERENCES routes(id) ON DELETE CASCADE,
  stop_id INTEGER REFERENCES stops(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  PRIMARY KEY (route_id, stop_id, sequence)
);
CREATE INDEX route_stops_stop_idx ON route_stops(stop_id);
CREATE INDEX route_stops_route_idx ON route_stops(route_id);

-- RLS: public read
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read stops" ON stops FOR SELECT USING (true);
CREATE POLICY "public read routes" ON routes FOR SELECT USING (true);
CREATE POLICY "public read route_stops" ON route_stops FOR SELECT USING (true);

-- PostGIS nearby stops function
CREATE OR REPLACE FUNCTION nearby_stops(
  user_lat double precision,
  user_lng double precision,
  radius_meters integer DEFAULT 500
)
RETURNS TABLE(
  id integer,
  name_en text,
  name_mm text,
  township_en text,
  lat double precision,
  lng double precision,
  distance_meters double precision
)
LANGUAGE sql AS $$
  SELECT
    id,
    name_en,
    name_mm,
    township_en,
    lat,
    lng,
    ST_Distance(
      location::geography,
      ST_MakePoint(user_lng, user_lat)::geography
    ) AS distance_meters
  FROM stops
  WHERE ST_DWithin(
    location::geography,
    ST_MakePoint(user_lng, user_lat)::geography,
    radius_meters
  )
  ORDER BY distance_meters
  LIMIT 20;
$$;

-- ============================================================
-- Journey Planner optimization indexes (add if not exists)
-- ============================================================
CREATE INDEX IF NOT EXISTS route_stops_route_seq_idx ON route_stops(route_id, sequence);
CREATE INDEX IF NOT EXISTS route_stops_stop_route_idx ON route_stops(stop_id, route_id, sequence);
