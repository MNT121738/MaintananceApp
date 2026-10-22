import { getStore, getDeployStore } from "@netlify/blobs";

// Shared data store for the Maintenance KPI app.
// Production uses a global store; deploy previews / branch deploys use a
// deploy-scoped store so test data never mixes with live data.
function store() {
  if (Netlify.context?.deploy?.context === "production") {
    return getStore({ name: "maintenance-kpi", consistency: "strong" });
  }
  return getDeployStore({ name: "maintenance-kpi", consistency: "strong" });
}

export default async (req) => {
  // Optional access key: set APP_KEY in Netlify environment variables.
  const key = Netlify.env.get("APP_KEY");
  if (key && req.headers.get("x-app-key") !== key) {
    return Response.json({ ok: false, error: "Access key required" }, { status: 401 });
  }

  const s = store();

  if (req.method === "GET") {
    const data = await s.get("data", { type: "json" });
    return Response.json({ ok: true, data });
  }

  if (req.method === "PUT") {
    let body;
    try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }
    if (!body || typeof body.data !== "object") return Response.json({ ok: false, error: "Missing data" }, { status: 400 });

    const current = await s.get("data", { type: "json" });
    // Optimistic lock: reject if someone else saved since this client last loaded.
    if (current && (current.version || 0) !== (body.baseVersion || 0)) {
      return Response.json({ ok: false, error: "conflict", data: current }, { status: 409 });
    }
    const version = (current?.version || 0) + 1;
    await s.setJSON("data", { ...body.data, version });
    return Response.json({ ok: true, version });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/data" };
