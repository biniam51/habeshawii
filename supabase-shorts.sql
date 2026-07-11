-- Shorts table
CREATE TABLE IF NOT EXISTS shorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE shorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shorts"
  ON shorts FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage shorts"
  ON shorts FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
