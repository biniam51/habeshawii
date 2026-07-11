-- Models table
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  profile_photo_url TEXT,
  cover_image_url TEXT,
  photo_count INTEGER NOT NULL DEFAULT 0,
  video_count INTEGER NOT NULL DEFAULT 0,
  required_membership TEXT NOT NULL DEFAULT 'free' CHECK (required_membership IN ('free', 'bronze', 'silver', 'gold')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read models"
  ON models FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage models"
  ON models FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Model galleries table
CREATE TABLE IF NOT EXISTS model_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE model_galleries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read galleries"
  ON model_galleries FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage galleries"
  ON model_galleries FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Model videos table
CREATE TABLE IF NOT EXISTS model_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE model_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read model videos"
  ON model_videos FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage model videos"
  ON model_videos FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
