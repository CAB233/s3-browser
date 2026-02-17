/**
 * Environment variables using Astro's astro:env API
 * Compatible with both local development (.env) and Cloudflare Workers runtime
 * @see https://docs.astro.build/en/guides/environment-variables/#type-safe-environment-variables
 */
export {
  BUCKET_ACCESS_KEY_ID,
  BUCKET_DOWNLOAD_URL,
  BUCKET_ENDPOINT,
  BUCKET_REGION,
  BUCKET_SECRET_ACCESS_KEY,
  DISABLE_SE_INDEX,
} from 'astro:env/server';
