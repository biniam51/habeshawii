-- Allow users to create their own conversation
DROP POLICY IF EXISTS "Users can insert own conversation" ON chat_conversations;
CREATE POLICY "Users can insert own conversation"
  ON chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert messages in their conversation
DROP POLICY IF EXISTS "Users can insert messages" ON chat_messages;
CREATE POLICY "Users can insert messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
