"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Model = {
  id: string;
  name: string;
  bio: string | null;
  profile_photo_url: string | null;
  cover_image_url: string | null;
  photo_count: number;
  video_count: number;
  required_membership: string;
  featured: boolean;
  created_at: string;
};

const membershipOptions = [
  { value: "free", label: "Free" },
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
];

export default function AdminModels() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Model | null>(null);
  const [form, setForm] = useState({ name: "", bio: "", profile_photo_url: "", cover_image_url: "", required_membership: "free", featured: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.email !== "biniyammulat51@gmail.com") { router.push("/"); return; }
    load();
  }, [user]);

  async function load() {
    const { data } = await supabase.from("models").select("*").order("name", { ascending: true });
    if (data) setModels(data);
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await supabase.from("models").update(form).eq("id", editing.id);
    } else {
      await supabase.from("models").insert(form);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", bio: "", profile_photo_url: "", cover_image_url: "", required_membership: "free", featured: false });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this model?")) return;
    await supabase.from("models").delete().eq("id", id);
    load();
  }

  function edit(m: Model) {
    setEditing(m);
    setForm({ name: m.name, bio: m.bio || "", profile_photo_url: m.profile_photo_url || "", cover_image_url: m.cover_image_url || "", required_membership: m.required_membership, featured: m.featured });
    setShowForm(true);
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Models</h1>
        <Button onClick={() => { setEditing(null); setForm({ name: "", bio: "", profile_photo_url: "", cover_image_url: "", required_membership: "free", featured: false }); setShowForm(true); }} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" /> Add Model
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Model" : "Add Model"}</h2>
            <div className="space-y-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <Input placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <Input placeholder="Profile Photo URL" value={form.profile_photo_url} onChange={(e) => setForm({ ...form, profile_photo_url: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <Input placeholder="Cover Image URL" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className="bg-zinc-800 border-zinc-700" />
              <select value={form.required_membership} onChange={(e) => setForm({ ...form, required_membership: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2.5 text-sm text-zinc-100">
                {membershipOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-zinc-600" /> Featured
              </label>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
              <Button onClick={save} disabled={!form.name || saving} className="bg-amber-600 hover:bg-amber-700">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2 hidden md:table-cell">Membership</th>
              <th className="text-left py-3 px-2 hidden sm:table-cell">Photos</th>
              <th className="text-left py-3 px-2 hidden sm:table-cell">Videos</th>
              <th className="text-left py-3 px-2">Featured</th>
              <th className="text-right py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-3 px-2 font-medium">{m.name}</td>
                <td className="py-3 px-2 text-zinc-500 capitalize hidden md:table-cell">{m.required_membership}</td>
                <td className="py-3 px-2 text-zinc-500 hidden sm:table-cell">{m.photo_count}</td>
                <td className="py-3 px-2 text-zinc-500 hidden sm:table-cell">{m.video_count}</td>
                <td className="py-3 px-2">{m.featured ? <span className="text-amber-500">Yes</span> : "No"}</td>
                <td className="py-3 px-2 text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => edit(m)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(m.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {models.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-zinc-500">No models found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
