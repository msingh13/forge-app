"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [school, setSchool] = useState("");
  const [skill, setSkill] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const params: Record<string, string> = {};
      if (school) params.school = school;
      if (skill) params.skill = skill;

      const res = await api.listIdeas(params);
      setIdeas(res.ideas);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ideas</h1>
          <p className="text-sm text-gray-600">
            Montreal student projects & startups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="bg-black text-white px-3 py-2 rounded"
            href="/ideas/new"
          >
            Post an Idea
          </Link>

          <Link className="underline" href="/login">
            Switch account
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Filter by school"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Filter by role needed (e.g., Frontend)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
      </div>

      <button
        onClick={load}
        className="mt-3 bg-black text-white px-3 py-2 rounded"
      >
        Apply filters
      </button>

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      <div className="mt-6 space-y-3">
        {ideas.map((idea) => (
          <Link
            key={idea.id}
            href={`/ideas/${idea.id}`}
            className="block border rounded p-4 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{idea.title}</h2>
              <span className="text-xs text-gray-500">{idea.stage}</span>
            </div>

            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {idea.description}
            </p>

            <div className="text-xs text-gray-600 mt-2">
              Owner: {idea.owner?.name} • {idea.owner?.school} • Interests:{" "}
              {idea._count?.interests ?? 0}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
