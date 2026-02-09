# s3-browser

   English | [简体中文](./README.zh.md)

   List any S3 compatible bucket's content as an index page. Built with Astro and running on Cloudflare.

## Screenshot

![](./assets/screenshot.png)

## Features

- **Bucket Index**: List contents of any S3-compatible storage as a web index
- **Cloudflare Pages**: Serverless deployment on Cloudflare Pages
- **Clean UI**: Simple and clean interface inspired by CaddyServer
- **Direct Download**: Configurable public download URL for objects

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Platform**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Runtime**: [Deno](https://deno.com/)
- **S3 Client**: [S3mini](https://github.com/denosaurs/s3mini)
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [CaddyServer](https://github.com/caddyserver) for their [html template](https://github.com/caddyserver/caddy/blob/master/modules/caddyhttp/fileserver/browse.html) design.
- Forked from [rafiibrahim8/bucketlist](https://github.com/rafiibrahim8/bucketlist).
