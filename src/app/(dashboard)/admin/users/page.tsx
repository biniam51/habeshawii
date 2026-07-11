"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  membership: string;
  is_admin: boolean;
  created_at: string;
};

export default function AdminUsers() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    if (user.email !== "biniyammulat51@gmail.com") { router.push("/"); return; }
    load();
  }, [user]);

  async function load() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  const filtered = users.filter((u) => (u.email || "").toLowerCase().includes(search.toLowerCase()) || (u.full_name || "").toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-10 bg-zinc-800 border-zinc-700" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2 hidden sm:table-cell">Email</th>
              <th className="text-left py-3 px-2">Membership</th>
              <th className="text-left py-3 px-2">Admin</th>
              <th className="text-left py-3 px-2 hidden md:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-3 px-2 font-medium">{u.full_name || "—"}</td>
                <td className="py-3 px-2 text-zinc-500 hidden sm:table-cell">{u.email || "—"}</td>
                <td className="py-3 px-2 capitalize">{u.membership}</td>
                <td className="py-3 px-2">{u.is_admin ? <span className="text-amber-500">Yes</span> : "No"}</td>
                <td className="py-3 px-2 text-zinc-500 hidden md:table-cell">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-zinc-500">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
