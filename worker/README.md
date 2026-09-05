# ticourse-sync

Cloudflare Worker that stores one progress blob per sync-code digest for
[IntelForge Academy](https://llopez-s.github.io/ticourse/).

It never receives the sync code — the browser sends only a SHA-256 digest. The
stored blob contains study progress only: no name, no email, no free text.

## Deploy (once)

```bash
cd worker
npm install
npx wrangler login                       # opens a browser, needs a free Cloudflare account
npx wrangler kv namespace create PROGRESS
# paste the printed id into wrangler.toml, replacing REPLACE_WITH_KV_NAMESPACE_ID
npx wrangler deploy                      # run this one in a real terminal, see below
```

**Run `wrangler deploy` interactively the first time.** A brand-new Cloudflare account has no
`workers.dev` subdomain, and the Worker cannot be published without one. The first deploy asks
"Would you like to register a workers.dev subdomain now?" — answer yes and choose a name. That name
is account-wide and hard to change afterwards, and it becomes part of the public URL:
`https://ticourse-sync.<subdomain>.workers.dev`. A non-interactive shell answers "no" to that
prompt, so the upload succeeds but publishing fails with a link to the account's onboarding page.
The subdomain can also be registered from the Cloudflare dashboard under Workers & Pages, after
which `wrangler deploy` works non-interactively.

`deploy` prints the public URL, e.g. `https://ticourse-sync.<subdomain>.workers.dev`.
Put that value in `SYNC_URL` in `src/lib/sync.ts` and push, so the app starts using it.

## API

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/p/:hash` | — | `{"v":1,"updatedAt":"<ISO>","data":{…}}` or `404` |
| `PUT` | `/p/:hash` | `{"v":1,"data":{…}}` | `{"ok":true,"updatedAt":"<ISO>"}` |

`:hash` is 64 lowercase hex characters. Bodies over 512 KB are rejected with
`413`. CORS is limited to the Pages origin and `localhost:5173`.

## Cost

Well inside Cloudflare's free tier: a few dozen requests per day against limits
of 100k Worker requests and 1k KV writes per day.
