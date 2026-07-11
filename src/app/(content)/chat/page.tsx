"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, Crown, Lock, MessageCircle, User, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useMembership } from "@/components/layout/membership-provider";
import type { ChatMessage } from "@/types";

type Conversation = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  last_message: string;
  last_message_at: string;
  unread: number;
};

export default function ChatPage() {
  const { user } = useAuth();
  const { plan, canAccess } = useMembership();
  const supabase = createClient();
  const [messages, setMessages] = useState<(ChatMessage & { isAdmin?: boolean })[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [convId, setConvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showList, setShowList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canChat = canAccess("silver");

  // Check admin status
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.is_admin || false);
      });
  }, [user, supabase]);

  // Load conversations (admin) or user conversation
  useEffect(() => {
    if (!user || !canChat) {
      setLoading(false);
      return;
    }

    const load = async () => {
      if (isAdmin) {
        // Admin: load all conversations
        const { data: convs } = await supabase
          .from("chat_conversations")
          .select("*, user:profiles!user_id(email, full_name)")
          .order("last_message_at", { ascending: false });

        if (convs) {
          setConversations(
            convs.map((c: any) => ({
              id: c.id,
              user_id: c.user_id,
              user_email: c.user?.email || "",
              user_name: c.user?.full_name || "Unknown",
              last_message: "",
              last_message_at: c.last_message_at,
              unread: 0,
            }))
          );
        }
        setLoading(false);
      } else {
        // User: get or create their conversation
        let { data: conv } = await supabase
          .from("chat_conversations")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!conv) {
          const { data: newConv } = await supabase
            .from("chat_conversations")
            .insert({ user_id: user.id })
            .select()
            .single();
          conv = newConv;
        }

        if (conv) {
          setConvId(conv.id);
        }
        setLoading(false);
      }
    };

    load();
  }, [user, canChat, isAdmin, supabase]);

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data as ChatMessage[]);
    }
    setConvId(conversationId);
  };

  // Subscribe to real-time messages
  useEffect(() => {
    if (!convId) return;

    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${convId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [convId, supabase]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Select a conversation (admin)
  const selectConversation = async (conversationId: string) => {
    setSelectedConv(conversationId);
    setShowList(false);
    setConvId(null);
    await loadMessages(conversationId);
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !convId || !user || sending) return;

    setSending(true);
    const msg = newMessage.trim();
    setNewMessage("");

    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: convId,
      user_id: user.id,
      message: msg,
      is_admin: isAdmin,
    });

    // Update last_message_at on conversation
    await supabase
      .from("chat_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", convId);

    if (error) {
      console.error("Send error:", error);
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Not logged in
  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
              <MessageCircle className="h-8 w-8 text-gold" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign in to Chat</h2>
          <p className="text-sm text-muted-foreground/70 mb-6">
            You need to sign in to access the chat system.
          </p>
          <Link href="/login">
            <Button className="bg-gold text-black hover:bg-gold-dark">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not a member
  if (!canChat) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
              <Lock className="h-8 w-8 text-gold" />
            </div>
          </div>
          <Badge className="mb-3 bg-gold/10 text-gold border-gold/20">Silver+ Feature</Badge>
          <h2 className="text-2xl font-bold mb-2">Membership Required</h2>
          <p className="text-sm text-muted-foreground/70 mb-6">
            The chat system is available for Silver and Gold members only.
            Upgrade your membership to start chatting.
          </p>
          <Link href={plan === "free" ? "/membership" : "/membership"}>
            <Button className="bg-gold text-black hover:bg-gold-dark">
              <Crown className="mr-2 h-4 w-4" />
              {plan === "free" ? "View Plans" : "Upgrade"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Admin view
  if (isAdmin) {
    return (
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl flex-col px-4 py-4 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-gold" />
          <h1 className="text-xl font-bold">Messages</h1>
        </div>

        <div className="flex flex-1 overflow-hidden rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm">
          {/* Conversation list */}
          <div className={`w-full border-r border-border/30 md:w-72 ${showList ? "" : "hidden md:block"}`}>
            <div className="p-3 border-b border-border/30">
              <Input placeholder="Search conversations..." className="bg-background text-sm h-9" />
            </div>
            <ScrollArea className="h-[calc(100%-3rem)]">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground/20 mb-2" />
                  <p className="text-sm text-muted-foreground/50">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-accent/50 ${
                      selectedConv === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-gold/10 text-gold text-xs">
                        {conv.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{conv.user_name}</p>
                      <p className="text-xs text-muted-foreground/60 truncate">{conv.user_email}</p>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className={`flex flex-1 flex-col ${showList ? "hidden md:flex" : ""}`}>
            {convId ? (
              <>
                <div className="flex items-center gap-3 border-b border-border/30 p-3 md:hidden">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setShowList(true); setConvId(null); }}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gold/10 text-gold text-[10px]">A</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Conversation</span>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                            msg.is_admin
                              ? "bg-card border border-border/50 rounded-bl-sm"
                              : "bg-gold text-black rounded-br-sm"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p className={`mt-1 text-[10px] ${msg.is_admin ? "text-muted-foreground/50" : "text-black/50"}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="border-t border-border/30 p-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="bg-background"
                    />
                    <Button
                      size="icon"
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="bg-gold text-black hover:bg-gold-dark shrink-0"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-center">
                <div>
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground/50">Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // User view
  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col px-4 py-4 sm:px-6">
      <div className="mb-4 flex items-center gap-3">
        <MessageCircle className="h-5 w-5 text-gold" />
        <h1 className="text-xl font-bold">Chat with Admin</h1>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 border-b border-border/30 p-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gold/10 text-gold text-xs">
              <Crown className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">HabeshaWii Support</p>
            <p className="text-[10px] text-muted-foreground/50">Online</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageCircle className="h-10 w-10 text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground/70">Send a message to get started</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">We typically reply within a few hours</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.is_admin
                          ? "bg-card border border-border/50 rounded-bl-sm"
                          : "bg-gold text-black rounded-br-sm"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className={`mt-1 text-[10px] ${msg.is_admin ? "text-muted-foreground/50" : "text-black/50"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border/30 p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-background"
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="bg-gold text-black hover:bg-gold-dark shrink-0"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
