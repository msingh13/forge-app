"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

export default function IdeaDetail({ params }: { params: { id: string } }) {
  const [idea, setIdea] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const res = await api.getIdea(params.id);
      setIdea(res.idea);
      // Try loading messages (will fail if not accepted/owner)
      try {
        const m = await api.listMessages(params.id);
        setMessages(m.messages);
      } catch {
        setMessages([]);
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function interest() {
    setErr(null);
    try {
      await api.expressInterest(params.id);
      alert("Interest sent!");
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function send() {
    if (!content.trim()) return;
    setErr(null);
    try {
      await api.sendMessage(params.id, content.trim());
      setContent("");
      const m = await api.listMessages(params.id);
      setMessages(m.messages);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  if (err) return <div className="max-w-2xl mx-auto p-6 text-red-600">{err}</div>;
  if (!idea) return <div className="max-w-2xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">{idea.title}</h1>
      <p className="text-sm text-gray-600 mt-1">
        {idea.owner?.name} • {idea.owner?.school} • {idea.stage} • {idea.commitmentLevel}
      </p>

      <p className="mt-4">{idea.description}</p>

      <div className="mt-4 text-sm">
        <div><b>Roles needed:</b> {idea.rolesNeeded?.join(", ") || "—"}</div>
      </div>

      <button onClick={interest} className="mt-6 bg-black text-white px-3 py-2 rounded">
        Express interest
      </button>

      <hr className="my-6" />

      <h2 className="font-semibold">Chat</h2>
      {messages.length === 0 ? (
        <p className="text-sm text-gray-600 mt-2">
          Chat unlocks after the owner accepts you.
        </p>
      ) : (
        <div className="mt-3 border rounded p-3 space-y-2">
          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <b>{m.sender?.name}:</b> {m.content}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input className="flex-1 border p-2 rounded" value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Message..." />
        <button onClick={send} className="bg-black text-white px-3 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
