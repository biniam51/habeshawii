-- Payment submissions table
CREATE TABLE IF NOT EXISTS payment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('bronze', 'silver', 'gold')),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('telebirr', 'cbe')),
  receipt_url TEXT,
  receipt_data TEXT,
  transaction_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own payments" ON payment_submissions;
CREATE POLICY "Users can insert own payments"
  ON payment_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own payments" ON payment_submissions;
CREATE POLICY "Users can read own payments"
  ON payment_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all payments" ON payment_submissions;
CREATE POLICY "Admins can read all payments"
  ON payment_submissions FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update payments" ON payment_submissions;
CREATE POLICY "Admins can update payments"
  ON payment_submissions FOR UPDATE
  USING (public.is_admin());

-- Auto-upgrade membership when payment is approved
CREATE OR REPLACE FUNCTION public.approve_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  plan_days INT;
  plan_price DECIMAL;
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    SELECT duration_days, price INTO plan_days, plan_price
    FROM membership_plans
    WHERE name = NEW.plan;

    IF plan_days IS NULL THEN
      plan_days := 30;
    END IF;

    -- Upsert user_membership
    INSERT INTO user_memberships (user_id, plan_id, plan_name, status, started_at, expires_at)
    VALUES (
      NEW.user_id,
      (SELECT id FROM membership_plans WHERE name = NEW.plan),
      NEW.plan,
      'active',
      NOW(),
      NOW() + (plan_days || ' days')::INTERVAL
    )
    ON CONFLICT (user_id, plan_name, status) WHERE status = 'active' DO UPDATE
    SET expires_at = GREATEST(user_memberships.expires_at, NOW() + (plan_days || ' days')::INTERVAL),
        started_at = LEAST(user_memberships.started_at, NOW());

    -- Update profile membership
    UPDATE profiles
    SET membership = NEW.plan,
        membership_expires_at = NOW() + (plan_days || ' days')::INTERVAL
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

-- Storage bucket for receipts

