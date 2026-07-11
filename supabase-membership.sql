-- Membership plans table
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('bronze', 'silver', 'gold')),
  display_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_days INT NOT NULL DEFAULT 30,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  popular BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plans"
  ON membership_plans FOR SELECT
  USING (TRUE);

-- User memberships table
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES membership_plans(id),
  plan_name TEXT NOT NULL DEFAULT 'free' CHECK (plan_name IN ('free', 'bronze', 'silver', 'gold')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memberships"
  ON user_memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all memberships"
  ON user_memberships FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can insert memberships"
  ON user_memberships FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can update memberships"
  ON user_memberships FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Insert default plans
INSERT INTO membership_plans (name, display_name, price, duration_days, description, features, popular)
VALUES
  ('bronze', 'Bronze', 9.99, 30,
   'Get started with premium content.',
   '["Premium Videos", "Premium Shorts", "HD Streaming"]',
   FALSE),
  ('silver', 'Silver', 19.99, 30,
   'The perfect balance of content and community.',
   '["Everything in Bronze", "Model Profiles", "Premium Galleries", "Model Chat"]',
   TRUE),
  ('gold', 'Gold', 39.99, 30,
   'The ultimate VIP experience with everything unlocked.',
   '["Everything in Silver", "VIP Videos", "VIP Shorts", "VIP Galleries", "Exclusive Content"]',
   FALSE)
ON CONFLICT (name) DO NOTHING;