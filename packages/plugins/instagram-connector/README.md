# Instagram Connector

Publishes photos and carousels to an Instagram professional account, either on
a schedule (every 15 minutes, checking a queue for due posts) or via an agent
tool (`queue-post`) that any agent in the company can call.

Uses the **Instagram Business Login** API (`graph.instagram.com`), the current
Meta flow that issues tokens directly for an Instagram professional account
without going through a linked Facebook Page's user/page token.

## Setup

1. In the [Meta developer dashboard](https://developers.facebook.com), create
   an app, add the **Instagram** product, and configure the
   "Manage messages and content on Instagram" use case.
2. Add your Instagram professional account as an **Instagram Tester** under
   "Roles" and accept the invite from the Instagram app.
3. Under "Instagram API setup with Instagram login" → "2. Generate access
   tokens", add the account and generate a token (`IGAA...`). Note the
   Instagram Business Account ID shown next to it.
4. Install this plugin in Paperclip, open its **Settings** page, and enter
   the Business Account ID and the token. Saving creates (or rotates) a
   Paperclip secret for the token — the raw value is never stored in plugin
   config.
5. Click **Test connection** to confirm it resolves to your account.

## How publishing works

- `queue-post` (agent tool) or the "Queue post" action takes 1 image URL (a
  single post) or 2-10 image URLs (a carousel), all of which **must already
  be public `https://` URLs** — the Instagram API does not accept file
  uploads, so hosting the image is the caller's responsibility (e.g. a
  project's public asset storage, S3, Cloudinary, etc).
- Queued items are held in plugin state until either the scheduled
  `publish-queue` job (every 15 minutes) or the "Publish due now" dashboard
  button processes them.
- Failed items stay in the queue with the error message attached; nothing is
  retried automatically. Remove or re-queue them manually.

## Development

```bash
pnpm install
pnpm --filter @paperclipai/plugin-instagram-connector test
pnpm --filter @paperclipai/plugin-instagram-connector typecheck
pnpm --filter @paperclipai/plugin-instagram-connector build
```

Install into a running instance:

```bash
curl -X POST http://127.0.0.1:3100/api/plugins/install \
  -H "Content-Type: application/json" \
  -d '{"packageName":"packages/plugins/instagram-connector","isLocalPath":true}'
```
