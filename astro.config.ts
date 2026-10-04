import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';

export default defineConfig({
  output: 'server',
  session: false,
  adapter: cloudflare(),
  cache: {
    provider: cacheCloudflare(),
  },
  vite: {
    build: {
      minify: true,
    },
  },
  env: {
    schema: {
      BUCKET_ENDPOINT: envField.string({ context: 'server', access: 'secret' }),
      BUCKET_REGION: envField.string({ context: 'server', access: 'secret' }),
      BUCKET_ACCESS_KEY_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      BUCKET_SECRET_ACCESS_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      BUCKET_DOWNLOAD_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      CACHE_BYPASS_PREFIXES: envField.string({
        context: 'server',
        access: 'secret',
        default: '',
      }),
      DISABLE_SE_INDEX: envField.boolean({
        context: 'server',
        access: 'public',
        default: true,
      }),
    },
  },
});
