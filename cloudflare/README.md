# Deploying the Player Storage Worker

This document explains how to deploy the example Cloudflare Worker that stores uploaded players in Workers KV and how to wire it to the website.

1) Create a Workers KV namespace

  - In Cloudflare dashboard → Workers → KV → Create namespace
  - Name it e.g. `players_kv`
  - Note the namespace ID

2) Deploy the worker and bind the KV namespace

Option A — Deploy via Cloudflare dashboard (quick):

  - Go to Workers → Create a Worker
  - Copy the file `cloudflare/worker/player-storage.js` into the editor
  - Under "Settings" → "Variables & Secrets" add a KV binding
    - Variable name: `PLAYERS_KV`
    - Namespace: select the namespace you created
  - Save and deploy. You'll get a worker URL like `https://my-worker.YOUR_ACCOUNT.workers.dev`

Option B — Deploy with Wrangler (recommended for repo-based deploys):

  - Install wrangler (npm i -g wrangler) and authenticate
  - Create `wrangler.toml` (a template is provided: `cloudflare/wrangler.template.toml`)
  - Replace the account_id and namespace id with your values, then run:

    wrangler publish

3) Set the site to call the worker

  - In `admin-upload.html` there is a variable `window.CF_API_ENDPOINT` at the top of the script.
  - Set it to your Worker URL + `/api/admin/players`, for example:

    window.CF_API_ENDPOINT = 'https://my-player-storage.workers.dev/api/admin/players';

4) Security notes

  - The worker example is intentionally simple and has no authentication. Do one of the following before allowing public access:
    - Protect the endpoint with Cloudflare Access (recommended for admin pages).
    - Add a simple secret token header check. Store the token as a Worker Secret or use Cloudflare Workers KV for tokens.

5) Testing

  - From the admin page, upload players or add manually. The page will POST to the worker endpoint and you should see a success message.
  - Use GET to retrieve: `GET https://my-player-storage.workers.dev/api/admin/players?team=RCB`

If you want, I can:
  - Add a `wrangler.toml` with placeholders, or
  - Add an example GitHub Actions workflow to deploy the worker with secrets.
