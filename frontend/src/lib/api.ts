const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("forge_token");
}

export function setToken(token: string) {
  localStorage.setItem("forge_token", token);
}

export function clearToken() {
  localStorage.removeItem("forge_token");
}

async function request<T>(
  path: string,
  opts: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as any),
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || data?.error || "Request failed";
    throw new Error(typeof msg === "string" ? msg : "Request failed");
  }

  return data as T;
}

export const api = {
  register: (body: any) =>
    request<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: any) =>
    request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: () => request<{ user: any }>("/users/me", {}, true),

  listIdeas: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<{ ideas: any[] }>(`/ideas${qs}`);
  },
  getIdea: (id: string) => request<{ idea: any }>(`/ideas/${id}`),

  createIdea: (body: any) =>
    request<{ idea: any }>("/ideas", {
      method: "POST",
      body: JSON.stringify(body),
    }, true),
  
  expressInterest: (id: string) =>
    request(`/ideas/${id}/interests`, { method: "POST" }, true),

  listMessages: (id: string) =>
    request<{ messages: any[] }>(`/ideas/${id}/messages`, {}, true),

  sendMessage: (id: string, content: string) =>
    request(`/ideas/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }, true),
};
