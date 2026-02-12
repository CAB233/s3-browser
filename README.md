# s3-browser

   English | [简体中文](./README.zh.md)

## Screenshot

![](./assets/screenshot.png)

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Platform**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Runtime**: [Deno](https://deno.com/)
- **S3 Client**: [S3mini](https://github.com/good-lly/s3mini/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

## Usage

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/CAB233/s3-browser.git
   cd s3-browser
   ```

2. Install dependencies
   ```bash
   deno install
   ```

3. Configure Environment Variables

   Copy `.dev.vars.example` to `.dev.vars` and fill in your S3 credentials.

4. Run the application
   ```bash
   deno task dev
   ```

### Deploy to Cloudflare

1. Configure Wrangler configuration file

   Copy `wrangler.toml.example` to `wrangler.toml` and configure your Cloudflare settings.

2. Configure Secrets

   Before deploying, ensure you have set the required secret environment variables in your Cloudflare dashboard or via wrangler:
   ```bash
   deno run npm:wrangler secret put BUCKET_NAME
   deno run npm:wrangler secret put BUCKET_ENDPOINT
   deno run npm:wrangler secret put BUCKET_REGION
   deno run npm:wrangler secret put BUCKET_ACCESS_KEY_ID
   deno run npm:wrangler secret put BUCKET_SECRET_ACCESS_KEY
   deno run npm:wrangler secret put BUCKET_DOWNLOAD_URL
   ```

3. Build and Deploy
   ```bash
   deno task build
   deno task deploy
   ```

## Environment Variables

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `BUCKET_NAME` | The name of the bucket. | Yes | - |
| `BUCKET_ENDPOINT` | The endpoint of the bucket. | Yes | - |
| `BUCKET_REGION` | The region of the bucket. | Yes | - |
| `BUCKET_ACCESS_KEY_ID` | The access key ID of the bucket. | Yes | - |
| `BUCKET_SECRET_ACCESS_KEY` | The secret access key of the bucket. | Yes | - |
| `BUCKET_DOWNLOAD_URL` | A publicly accessible URL to download objects. | Yes | - |
| `DISABLE_SE_INDEX` | Set to `true` to disable search engine indexing. | No | `true` |

## License

MIT

## Acknowledgements

- [CaddyServer](https://github.com/caddyserver) for their [html template](https://github.com/caddyserver/caddy/blob/master/modules/caddyhttp/fileserver/browse.html) design.
- Forked from [rafiibrahim8/bucketlist](https://github.com/rafiibrahim8/bucketlist).
