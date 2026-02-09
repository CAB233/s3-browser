import { defineMiddleware } from 'astro:middleware';

// Ref: https://github.com/cmj2002/r2-dir-list#how-it-works
export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  if (pathname.endsWith('/')) {
    return next();
  }

  try {
    const originResponse = await fetch(context.request);
    if (originResponse.status === 404) {
      return next();
    }
    return originResponse;
  } catch (error) {
    console.error('Error fetching from origin:', error);
    return next();
  }
});
