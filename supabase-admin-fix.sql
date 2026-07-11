-- Fix admin RLS recursion by using a security definer function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE);
$$;

-- Drop and recreate admin policies using the function
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage videos" ON videos;
DROP POLICY IF EXISTS "Admins can manage shorts" ON shorts;
DROP POLICY IF EXISTS "Admins can manage models" ON models;
DROP POLICY IF EXISTS "Admins can manage galleries" ON model_galleries;
DROP POLICY IF EXISTS "Admins can manage model videos" ON model_videos;
DROP POLICY IF EXISTS "Admins can read all memberships" ON user_memberships;
DROP POLICY IF EXISTS "Admins can insert memberships" ON user_memberships;
DROP POLICY IF EXISTS "Admins can update memberships" ON user_memberships;

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage videos"
  ON videos FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage shorts"
  ON shorts FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage models"
  ON models FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage galleries"
  ON model_galleries FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage model videos"
  ON model_videos FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can read all memberships"
  ON user_memberships FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert memberships"
  ON user_memberships FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update memberships"
  ON user_memberships FOR UPDATE
  USING (public.is_admin());
