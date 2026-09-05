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
npx wrangler deploy
```

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
