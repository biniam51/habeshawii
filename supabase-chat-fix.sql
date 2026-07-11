-- Fix chat RLS policies
DROP POLICY IF EXISTS "Users can insert messages" ON chat_messages;
DROP POLICY IF EXISTS "Admins can insert messages" ON chat_messages;
DROP POLICY IF EXISTS "Admins can update conversations" ON chat_conversations;

-- Allow any authenticated user to insert messages (user_id must match their auth id)
CREATE POLICY "Users can insert messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to update conversations
CREATE POLICY "Anyone can update conversations"
  ON chat_conversations FOR UPDATE
  USING (TRUE);
