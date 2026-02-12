"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";

export default function NewIdeaPage() {
  const r = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<"IDEA" | "MVP" | "STARTUP">("IDEA");
  const [commitmentLevel, setCommitmentLevel] =
    useState<"CASUAL" | "SERIOUS" | "INTENSE">("CASUAL");

  const [rolesNeededInput, setRolesNeededInput] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (title.trim().length < 3) return setErr("Title must be at least 3 characters.");
    if (description.trim().length < 10) return setErr("Description must be at least 10 characters.");

    const rolesNeeded = rolesNeededInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const res = await api.createIdea({
        title: title.trim(),
        description: description.trim(),
        stage,
        commitmentLevel,
        rolesNeeded,
      });

      r.push(`/ideas/${res.idea.id}`);
    } catch (e: any) {
      setErr(e.message || "Failed to create idea");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Post an Idea</h1>
        <Link className="underline text-sm" href="/ideas">
          ← Back
        </Link>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Campus event ticketing app"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full border p-2 rounded min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you building, who is it for, and what do you need?"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Stage</label>
            <select
              className="mt-1 w-full border p-2 rounded"
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
            >
              <option value="IDEA">Idea</option>
              <option value="MVP">MVP</option>
              <option value="STARTUP">Startup</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Commitment</label>
            <select
              className="mt-1 w-full border p-2 rounded"
              value={commitmentLevel}
              onChange={(e) => setCommitmentLevel(e.target.value as any)}
            >
              <option value="CASUAL">Casual</option>
              <option value="SERIOUS">Serious</option>
              <option value="INTENSE">Intense</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Roles needed (comma-separated)</label>
          <input
            className="mt-1 w-full border p-2 rounded"
            value={rolesNeededInput}
            onChange={(e) => setRolesNeededInput(e.target.value)}
            placeholder="Frontend, Backend, Designer"
          />
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
          type="submit"
        >
          {loading ? "Posting..." : "Post Idea"}
        </button>
      </form>
    </div>
  );
}
