"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Video = {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  is_premium: boolean;
  is_vip: boolean;
  views: number;
  featured: boolean;
  created_at: string;
};

type Category = { id: string; name: string };

export default function AdminVideos() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState({ title: "", description: "", video_url: "", thumbnail_url: "", category_id: "", is_premium: false, is_vip: false, featured: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.email !== "biniyammulat51@gmail.com") { router.push("/"); return; }
    load();
  }, [user]);

  async function load() {
    const [v, c] = await Promise.all([
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*"),
    ]);
    if (v.data) setVideos(v.data);
    if (c.data) setCategories(c.data);
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await supabase.from("videos").update(form).eq("id", editing.id);
    } else {
      await supabase.from("videos").insert(form);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", description: "", video_url: "", thumbnail_url: "", category_id: "", is_premium: false, is_vip: false, featured: false });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this video?")) return;
    await supabase.from("videos").delete().eq("id", id);
    load();
  }

  function edit(v: Video) {
    setEditing(v);
    setForm({ title: v.title, description: v.description || "", video_url: v.video_url || "", thumbnail_url: v.thumbnail_url || "", category_id: v.category_id || "", is_premium: v.is_premium, is_vip: v.is_vip, featured: v.featured });
    setShowForm(true);
  }

  const filtered = videos.filter((v) => v.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Videos</h1>
        <Button onClick={() => { setEditing(null); setForm({ title: "", description: "", video_url: "", thumbnail_url: "", category_id: "", is_premium: false, is_vip: false, featured: false }); setShowForm(true); }} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" /> Add Video
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search videos..." className="pl-10 bg-zinc-800 border-zinc-700" />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Video" : "Add Video"}</h2>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <Input placeholder="Video URL" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <Input placeholder="Thumbnail URL" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2.5 text-sm text-zinc-100">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} className="rounded border-zinc-600" /> Premium
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_vip} onChange={(e) => setForm({ ...form, is_vip: e.target.checked })} className="rounded border-zinc-600" /> VIP
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-zinc-600" /> Featured
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
              <th className="text-left py-3 px-2 hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-2 hidden sm:table-cell">Views</th>
              <th className="text-left py-3 px-2">Premium</th>
              <th className="text-left py-3 px-2">VIP</th>
              <th className="text-right py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-3 px-2 font-medium truncate max-w-[200px]">{v.title}</td>
                <td className="py-3 px-2 text-zinc-500 hidden md:table-cell">{categories.find((c) => c.id === v.category_id)?.name || "—"}</td>
                <td className="py-3 px-2 text-zinc-500 hidden sm:table-cell">{v.views}</td>
                <td className="py-3 px-2">{v.is_premium ? <span className="text-amber-500">Yes</span> : "No"}</td>
                <td className="py-3 px-2">{v.is_vip ? <span className="text-purple-500">Yes</span> : "No"}</td>
                <td className="py-3 px-2 text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => edit(v)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(v.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-zinc-500">No videos found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
