import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
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
      DISABLE_SE_INDEX: envField.boolean({
        context: 'server',
        access: 'public',
        default: true,
      }),
    },
  },
});
