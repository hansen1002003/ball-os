/*
# BallOS Football Compliance Intelligence Platform Schema

1. New Tables
- `balls` — Stores football ball identities and lifecycle data
  - `id` (uuid, primary key)
  - `ball_id` (text, unique ball identifier)
  - `manufacture_date` (timestamptz)
  - `matches_played` (integer, default 0)
  - `training_sessions` (integer, default 0)
  - `activation_count` (integer, default 0)
  - `health_score` (numeric, default 100)
  - `trust_score` (numeric, default 100)
  - `current_state` (text, default 'READY')
  - `match_assignment` (text, nullable)
  - `compliance_status` (text, default 'Compliant')
  - `pressure` (numeric, default 0.6)
  - `circumference` (numeric, default 68.5)
  - `weight` (numeric, default 430)
  - `integrity` (numeric, default 100)
  - `temperature` (numeric, default 22)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

- `ball_events` — Event log for all ball actions
  - `id` (uuid, primary key)
  - `ball_id` (uuid, references balls)
  - `event_type` (text, not null)
  - `message` (text, not null)
  - `details` (jsonb, nullable)
  - `created_at` (timestamptz)

- `ball_measurements` — Historical sensor readings
  - `id` (uuid, primary key)
  - `ball_id` (uuid, references balls)
  - `metric` (text, not null)
  - `value` (numeric, not null)
  - `created_at` (timestamptz)

- `ball_state_history` — State transition history
  - `id` (uuid, primary key)
  - `ball_id` (uuid, references balls)
  - `from_state` (text, not null)
  - `to_state` (text, not null)
  - `reason` (text, nullable)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on all tables.
- Allow public read/write for demo purposes (single-tenant, no auth required).
*/

CREATE TABLE IF NOT EXISTS balls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ball_id text UNIQUE NOT NULL DEFAULT 'BALL-' || substr(gen_random_uuid()::text, 1, 8),
  manufacture_date timestamptz DEFAULT now(),
  matches_played integer NOT NULL DEFAULT 0,
  training_sessions integer NOT NULL DEFAULT 0,
  activation_count integer NOT NULL DEFAULT 0,
  health_score numeric NOT NULL DEFAULT 100,
  trust_score numeric NOT NULL DEFAULT 100,
  current_state text NOT NULL DEFAULT 'READY',
  match_assignment text,
  compliance_status text NOT NULL DEFAULT 'Compliant',
  pressure numeric NOT NULL DEFAULT 0.6,
  circumference numeric NOT NULL DEFAULT 68.5,
  weight numeric NOT NULL DEFAULT 430,
  integrity numeric NOT NULL DEFAULT 100,
  temperature numeric NOT NULL DEFAULT 22,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ball_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ball_id uuid REFERENCES balls(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  message text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ball_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ball_id uuid REFERENCES balls(id) ON DELETE CASCADE,
  metric text NOT NULL,
  value numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ball_state_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ball_id uuid REFERENCES balls(id) ON DELETE CASCADE,
  from_state text NOT NULL,
  to_state text NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE balls ENABLE ROW LEVEL SECURITY;
ALTER TABLE ball_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ball_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ball_state_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_balls" ON balls;
CREATE POLICY "anon_select_balls" ON balls FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_balls" ON balls;
CREATE POLICY "anon_insert_balls" ON balls FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_balls" ON balls;
CREATE POLICY "anon_update_balls" ON balls FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_balls" ON balls;
CREATE POLICY "anon_delete_balls" ON balls FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_ball_events" ON ball_events;
CREATE POLICY "anon_select_ball_events" ON ball_events FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ball_events" ON ball_events;
CREATE POLICY "anon_insert_ball_events" ON ball_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_ball_events" ON ball_events;
CREATE POLICY "anon_update_ball_events" ON ball_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ball_events" ON ball_events;
CREATE POLICY "anon_delete_ball_events" ON ball_events FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_ball_measurements" ON ball_measurements;
CREATE POLICY "anon_select_ball_measurements" ON ball_measurements FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ball_measurements" ON ball_measurements;
CREATE POLICY "anon_insert_ball_measurements" ON ball_measurements FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_ball_measurements" ON ball_measurements;
CREATE POLICY "anon_update_ball_measurements" ON ball_measurements FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ball_measurements" ON ball_measurements;
CREATE POLICY "anon_delete_ball_measurements" ON ball_measurements FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_ball_state_history" ON ball_state_history;
CREATE POLICY "anon_select_ball_state_history" ON ball_state_history FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ball_state_history" ON ball_state_history;
CREATE POLICY "anon_insert_ball_state_history" ON ball_state_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_ball_state_history" ON ball_state_history;
CREATE POLICY "anon_update_ball_state_history" ON ball_state_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ball_state_history" ON ball_state_history;
CREATE POLICY "anon_delete_ball_state_history" ON ball_state_history FOR DELETE
  TO anon, authenticated USING (true);

-- Insert a default ball if none exists
INSERT INTO balls (ball_id, manufacture_date, match_assignment, current_state)
SELECT 'BALL-FIFA-2024-001', now(), 'Premier League - Match 42', 'READY'
WHERE NOT EXISTS (SELECT 1 FROM balls LIMIT 1);

-- Insert initial event
INSERT INTO ball_events (ball_id, event_type, message, details)
SELECT 
  b.id,
  'BALL_CREATED',
  'Football registered into BallOS compliance system',
  '{}'::jsonb
FROM balls b
WHERE NOT EXISTS (SELECT 1 FROM ball_events LIMIT 1);

-- Insert some initial measurements
INSERT INTO ball_measurements (ball_id, metric, value, created_at)
SELECT b.id, 'pressure', 0.6, now() - interval '5 minutes'
FROM balls b
WHERE NOT EXISTS (SELECT 1 FROM ball_measurements LIMIT 1);

INSERT INTO ball_measurements (ball_id, metric, value, created_at)
SELECT b.id, 'circumference', 68.5, now() - interval '5 minutes'
FROM balls b
WHERE NOT EXISTS (SELECT 1 FROM ball_measurements LIMIT 1);

INSERT INTO ball_measurements (ball_id, metric, value, created_at)
SELECT b.id, 'weight', 430, now() - interval '5 minutes'
FROM balls b
WHERE NOT EXISTS (SELECT 1 FROM ball_measurements LIMIT 1);

INSERT INTO ball_measurements (ball_id, metric, value, created_at)
SELECT b.id, 'temperature', 22, now() - interval '5 minutes'
FROM balls b
WHERE NOT EXISTS (SELECT 1 FROM ball_measurements LIMIT 1);
