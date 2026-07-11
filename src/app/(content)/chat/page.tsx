"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { createClient } from "@/lib/supabase";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  user_id: string;
  last_message_at: string;
  profiles?: { display_name?: string; avatar_url?: string };
}

function MessagesView({
  messages,
  userId,
  text,
  setText,
  sending,
  sendMessage,
  bottomRef,
}: {
  messages: Message[];
  userId: string | undefined;
  text: string;
  setText: (v: string) => void;
  sending: boolean;
  sendMessage: () => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center mt-8">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.user_id === userId;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? "bg-amber-600 text-white rounded-br-sm" : "bg-zinc-800 text-zinc-100 rounded-bl-sm"}`}>
                  {msg.is_admin && !isMine && <p className="text-[10px] text-amber-400 font-semibold mb-1">Admin</p>}
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-[10px] text-zinc-400 text-right mt-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-zinc-800">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 border-zinc-700 focus-visible:ring-amber-500"
          />
          <Button type="submit" disabled={!text.trim() || sending} size="icon" className="bg-amber-600 hover:bg-amber-700">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </>
  );
}

export default function ChatPage() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const isAdmin = user?.email === "biniyammulat51@gmail.com";
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    if (isAdmin) {
      supabase.from("chat_conversations").select("*").order("last_message_at", { ascending: false }).then(({ data: convs }) => {
        if (convs) {
          supabase.from("profiles").select("id, display_name, avatar_url").then(({ data: profs }) => {
            const profileMap = new Map((profs || []).map((p) => [p.id, p]));
            setConversations(convs.map((c) => ({ ...c, profiles: profileMap.get(c.user_id) })));
            setLoading(false);
          });
        } else setLoading(false);
      });
      return;
    }
    supabase.from("chat_conversations").select("*").eq("user_id", user.id).maybeSingle().then(async ({ data: conv }) => {
      if (!conv) {
        const { data: newConv } = await supabase.from("chat_conversations").insert({ user_id: user.id }).select().single();
        if (newConv) conv = newConv;
      }
      if (conv) {
        setActiveConversation(conv.id);
        const { data: msgs } = await supabase.from("chat_messages").select("*").eq("conversation_id", conv.id).order("created_at", { ascending: true });
        if (msgs) setMessages(msgs);
      }
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!activeConversation) return;
    const sub = supabase.channel("chat-messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${activeConversation}` }, (payload) => {
      setMessages((prev) => [...prev, payload.new as Message]);
    }).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [activeConversation]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage() {
    if (!text.trim() || !activeConversation || sending || !user) return;
    setSending(true);
    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: activeConversation,
      user_id: user.id,
      message: text.trim(),
      is_admin: isAdmin,
    });
    if (error) console.error("Send error:", error);
    setText("");
    setSending(false);
  }

  function selectConversation(convId: string) {
    setActiveConversation(convId);
    supabase.from("chat_messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true }).then(({ data }) => {
      if (data) setMessages(data);
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-80 border-r border-zinc-800 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          {conversations.length === 0 ? (
            <p className="p-4 text-zinc-500 text-sm">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full p-4 text-left border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${activeConversation === conv.id ? "bg-zinc-800" : ""}`}
              >
                <p className="text-sm font-medium truncate">{conv.profiles?.display_name || "Anonymous User"}</p>
                <p className="text-xs text-zinc-500 mt-1">{new Date(conv.last_message_at).toLocaleDateString()}</p>
              </button>
            ))
          )}
        </div>
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <MessagesView
              messages={messages}
              userId={user?.id}
              text={text}
              setText={setText}
              sending={sending}
              sendMessage={sendMessage}
              bottomRef={bottomRef}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">Select a conversation</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-lg font-semibold">Messages</h1>
        <p className="text-xs text-zinc-500">Chat with the team</p>
      </div>
      <MessagesView
        messages={messages}
        userId={user?.id}
        text={text}
        setText={setText}
        sending={sending}
        sendMessage={sendMessage}
        bottomRef={bottomRef}
      />
    </div>
  );
}
