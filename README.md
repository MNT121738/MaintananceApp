# Maintenance Track (BIOTEK)

Maintenance KPI web app: work orders, spares, production, cost per good unit, MIS.

## Files
- `index.html` – the whole app
- `netlify/functions/data.mjs` – saves shared data online (Netlify Blobs) at `/api/data`
- `netlify.toml` – tells Netlify where the app and function are
- `package.json` – installs `@netlify/blobs` for the function

## Deploy
1. Upload this folder's contents to a GitHub repository (index.html must be at the top level).
2. Netlify > Add new project > Import an existing project > GitHub > pick this repo.
   Leave Build command empty, Publish directory `.` (netlify.toml sets this). Deploy.
3. Optional password: Netlify > Project configuration > Environment variables >
   add `APP_KEY` = your password, then Deploys > Trigger deploy. Users enter it once per browser.

Every change pushed to GitHub redeploys automatically.
Data stays in Netlify Blobs (store "maintenance-kpi"); redeploying does not erase it.
