DROP TABLE IF EXISTS payment_submissions CASCADE;

CREATE TABLE payment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('bronze', 'silver', 'gold')),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('telebirr', 'cbe')),
  receipt_data TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own payments
DROP POLICY IF EXISTS "insert_own" ON payment_submissions;
CREATE POLICY "insert_own" ON payment_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own payments
DROP POLICY IF EXISTS "read_own" ON payment_submissions;
CREATE POLICY "read_own" ON payment_submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Admin can read all payments (uses email from JWT - no custom function needed)
DROP POLICY IF EXISTS "admin_read" ON payment_submissions;
CREATE POLICY "admin_read" ON payment_submissions
  FOR SELECT USING (auth.jwt() ->> 'email' = 'biniyammulat51@gmail.com');

-- Admin can update payments
DROP POLICY IF EXISTS "admin_update" ON payment_submissions;
CREATE POLICY "admin_update" ON payment_submissions
  FOR UPDATE USING (auth.jwt() ->> 'email' = 'biniyammulat51@gmail.com');

-- Auto-upgrade membership when payment is approved
CREATE OR REPLACE FUNCTION public.approve_payment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  plan_days INT;
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    SELECT duration_days INTO plan_days FROM membership_plans WHERE name = NEW.plan;
    IF plan_days IS NULL THEN plan_days := 30; END IF;
    INSERT INTO user_memberships (user_id, plan_name, status, started_at, expires_at)
    VALUES (NEW.user_id, NEW.plan, 'active', NOW(), NOW() + (plan_days || ' days')::INTERVAL);
    UPDATE profiles
    SET membership = NEW.plan, membership_expires_at = NOW() + (plan_days || ' days')::INTERVAL
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_payment_approved ON payment_submissions;
CREATE TRIGGER on_payment_approved
  AFTER UPDATE OF status ON payment_submissions
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND OLD.status = 'pending')
  EXECUTE FUNCTION public.approve_payment();
