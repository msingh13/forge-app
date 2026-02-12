"use client";
import { useState } from "react";
import { api, setToken } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("owner@test.com");
  const [password, setPassword] = useState("password123");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      r.push("/ideas");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input className="w-full border p-2 rounded" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full border p-2 rounded" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full bg-black text-white p-2 rounded" disabled={loading}>
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
}
