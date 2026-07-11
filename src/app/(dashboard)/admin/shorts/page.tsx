"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Short = {
  id: string;
  title: string;
  video_url: string | null;
  thumbnail_url: string | null;
  is_premium: boolean;
  is_vip: boolean;
  views: number;
  created_at: string;
};

export default function AdminShorts() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Short | null>(null);
  const [form, setForm] = useState({ title: "", video_url: "", thumbnail_url: "", is_premium: false, is_vip: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.email !== "biniyammulat51@gmail.com") { router.push("/"); return; }
    load();
  }, [user]);

  async function load() {
    const { data } = await supabase.from("shorts").select("*").order("created_at", { ascending: false });
    if (data) setShorts(data);
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await supabase.from("shorts").update(form).eq("id", editing.id);
    } else {
      await supabase.from("shorts").insert(form);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", video_url: "", thumbnail_url: "", is_premium: false, is_vip: false });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this short?")) return;
    await supabase.from("shorts").delete().eq("id", id);
    load();
  }

  function edit(s: Short) {
    setEditing(s);
    setForm({ title: s.title, video_url: s.video_url || "", thumbnail_url: s.thumbnail_url || "", is_premium: s.is_premium, is_vip: s.is_vip });
    setShowForm(true);
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shorts</h1>
        <Button onClick={() => { setEditing(null); setForm({ title: "", video_url: "", thumbnail_url: "", is_premium: false, is_vip: false }); setShowForm(true); }} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" /> Add Short
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Short" : "Add Short"}</h2>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <Input placeholder="Video URL" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <Input placeholder="Thumbnail URL" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} className="rounded border-zinc-600" /> Premium
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_vip} onChange={(e) => setForm({ ...form, is_vip: e.target.checked })} className="rounded border-zinc-600" /> VIP
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
              <Button onClick={save} disabled={!form.title || saving} className="bg-amber-600 hover:bg-amber-700">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="text-left py-3 px-2">Title</th>
              <th className="text-left py-3 px-2 hidden sm:table-cell">Views</th>
              <th className="text-left py-3 px-2">Premium</th>
              <th className="text-left py-3 px-2">VIP</th>
              <th className="text-right py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shorts.map((s) => (
              <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-3 px-2 font-medium truncate max-w-[200px]">{s.title}</td>
                <td className="py-3 px-2 text-zinc-500 hidden sm:table-cell">{s.views}</td>
                <td className="py-3 px-2">{s.is_premium ? <span className="text-amber-500">Yes</span> : "No"}</td>
                <td className="py-3 px-2">{s.is_vip ? <span className="text-purple-500">Yes</span> : "No"}</td>
                <td className="py-3 px-2 text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => edit(s)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {shorts.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-zinc-500">No shorts found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
