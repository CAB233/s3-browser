# AGENTS.md

## 1. Project Overview

This is an **Astro + Deno** project that lists S3-compatible bucket contents as a web index. It runs on **Cloudflare Pages** using the `@astrojs/cloudflare` adapter in server output mode.

## 2. Build Commands

### Core Commands

```bash
# Install dependencies (Deno manages dependencies via deno.json imports)
deno install

# Local development server
deno task dev

# Build with TypeScript check
deno task build

# Deploy to Cloudflare Pages
deno task deploy
```

### Development Variations

```bash
# Cloudflare Pages dev (requires dist/ to exist)
deno task dev:cloudflare
```

### Environment Setup

1. Copy `.dev.vars.example` to `.dev.vars`
2. Fill in S3 credentials and configuration
3. For Cloudflare deployment, also copy `wrangler.toml.example` to `wrangler.toml`

### Secrets Management

```bash
# Set secrets for Cloudflare Pages
deno run npm:wrangler secret put BUCKET_NAME
deno run npm:wrangler secret put BUCKET_ENDPOINT
deno run npm:wrangler secret put BUCKET_REGION
deno run npm:wrangler secret put BUCKET_ACCESS_KEY_ID
deno run npm:wrangler secret put BUCKET_SECRET_ACCESS_KEY
deno run npm:wrangler secret put BUCKET_DOWNLOAD_URL
```

## 3. Code Style Guidelines

### Language & TypeScript

- **Language**: TypeScript with Astro components (`.astro` files)
- **Type Checking**: Run via `deno task build` (includes `astro check`)
- **No TypeScript config file** - Deno handles TypeScript settings internally
- Use explicit type annotations for function parameters and return types
- Use `interface` for object types, `type` for unions and primitives
- Define exported types in dedicated files or at the top of relevant files

```typescript
// Example: Union type pattern used in this project
export type Entry =
  | {
      type: 'directory';
      name: string;
      anchor: string;
      lastModified?: Date;
      size?: number;
      humanReadableSize?: string;
    }
  | {
      type: 'file';
      name: string;
      anchor: string;
      fullPath: string;
      lastModified: Date;
      size: number;
      humanReadableSize: string;
      extension: string;
    };
```

### Formatting

- **Formatter**: Deno's built-in `deno fmt`
- **Indentation**: 2 spaces
- **Line Width**: 80 characters
- **Quotes**: Single quotes (`'`)
- **Semicolons**: Required
- **Tabs**: Disabled (use spaces)
- **Trailing Commas**: Allowed

```bash
# Format all code
deno fmt
```

### Imports

- **Style**: Named imports preferred
- **Import extensions**: Include `.ts` extension for relative imports
- **Sort order**: Group imports logically (stdlib → external → relative)
- **Type imports**: Use `import type` for type-only imports

```typescript
import { S3mini } from 's3mini';
import { parseDate, strip } from './utils.ts';
import type { Entry, FSListing } from './s3.ts';
```

### Naming Conventions

| Construct | Convention | Example |
|-----------|------------|---------|
| Variables | camelCase | `bucketName`, `s3Client` |
| Constants | SCREAMING_SNAKE_CASE | `BUCKET_ENDPOINT` |
| Functions | camelCase | `listBucket`, `parseViewParams` |
| Types | PascalCase | `Entry`, `FSListing`, `ViewParams` |
| Files | kebab-case | `breadcrumb.ts`, `index-page.astro` |
| Components | PascalCase (Astro) | `IndexPage.astro`, `FourOhFour.astro` |

### Error Handling

- Use `try/catch` blocks for async operations
- Log errors with `console.error()` before rethrowing
- Let errors propagate to the framework level when appropriate
- Handle edge cases with explicit checks and early returns

```typescript
try {
  const response = await client.listObjectsPaged(bucketName, token);
  if (response?.objects) {
    allObjects.push(...response.objects);
  }
  token = response?.nextContinuationToken;
} catch (e) {
  console.error('Error listing objects:', e);
  throw e;
}
```

### Astro Components

- **Frontmatter**: Place imports at the top, type definitions after imports
- **Props interface**: Define in the component file, export if reused
- **Client scripts**: Use `<script is:inline>` for client-side JS
- **Template logic**: Use ternary operators for conditional rendering
- **Global styles**: Place in `<style is:global>` in Layout.astro

```astro
---
import type { BreadcrumbEntry } from '../functions/breadcrumb';

interface Props {
  breadCrums: BreadcrumbEntry[];
  requestPath: string;
}

const { breadCrums, requestPath } = Astro.props;
---

<header>
  {breadCrums.map((crumb) => (
    <a href={crumb.path}>{crumb.name}</a>
  ))}
</header>
```

### Environment Variables

- Use Astro's `astro:env` API for type-safe environment variables
- Define schema in `astro.config.ts` using `envField`
- Import from `astro:env/server` for server-side access
- Public variables: `context: 'server', access: 'public'`
- Secret variables: `context: 'server', access: 'secret'`

### Linting

```bash
# Run Deno linter
deno lint
```

Linting is configured in `deno.json` to include `src/` and exclude `dist/`.

### CSS Styling

- Use CSS variables for theming (see Layout.astro for dark mode)
- Scoped styles in Astro components (default behavior)
- Global styles in Layout.astro with `<style is:global>`
- Responsive design with media queries (max-width: 600px breakpoint)

## 4. Project Structure

```
/home/lihua/projects/bucketlist
├── src/
│   ├── components/      # Astro UI components
│   │   ├── IndexPage.astro    # Main listing component
│   │   ├── FourOhFour.astro   # 404 page
│   │   └── Icon.astro         # Icon helper
│   ├── functions/       # Business logic (TypeScript)
│   │   ├── s3.ts              # S3 listing and entry types
│   │   ├── sort.ts            # Sorting and view parameters
│   │   ├── breadcrumb.ts      # Breadcrumb generation
│   │   ├── utils.ts           # Utility functions
│   │   └── environment.ts     # Environment variable exports
│   ├── layouts/         # Astro layouts
│   │   └── Layout.astro       # Main HTML layout with global styles
│   ├── middleware/      # Astro middleware
│   │   └── index.ts           # Redirect/trailing slash handling
│   └── pages/           # Astro pages (file-based routing)
│       └── [...index].astro   # Catch-all route for bucket paths
├── public/              # Static assets
├── astro.config.ts      # Astro configuration
├── deno.json            # Deno configuration and tasks
└── wrangler.toml        # Cloudflare Pages configuration
```

### Key Patterns

- **Pages**: `[...index].astro` catches all paths for bucket listing
- **Components**: Pure UI components in `components/`
- **Logic**: Business logic separated into `functions/` directory
- **S3 Operations**: Centralized in `functions/s3.ts` with `Entry` and `FSListing` types
- **Middleware**: Handles trailing slashes and proxying non-bucket requests

## 5. Environment & Secrets

### Required Environment Variables

| Variable | Description | Context | Access |
|----------|-------------|---------|--------|
| `BUCKET_NAME` | S3 bucket name | server | secret |
| `BUCKET_ENDPOINT` | S3 endpoint URL | server | secret |
| `BUCKET_REGION` | S3 region | server | secret |
| `BUCKET_ACCESS_KEY_ID` | AWS access key | server | secret |
| `BUCKET_SECRET_ACCESS_KEY` | AWS secret key | server | secret |
| `BUCKET_DOWNLOAD_URL` | Public download base URL | server | secret |
| `DISABLE_SE_INDEX` | Disable search engines | server | public |

### Configuration Files

- **`.dev.vars`**: Local development (gitignored)
- **`wrangler.toml`**: Cloudflare deployment config (gitignored, use example)
- **`astro.config.ts`**: Defines env schema for type safety

### Cloudflare Secrets

Secrets must be set via Wrangler CLI for Cloudflare Pages:
```bash
deno run npm:wrangler secret put <VARIABLE_NAME>
```

### README Maintenance

- This project maintains both English (`README.md`) and Chinese (`README.zh.md`) versions
- **When modifying either README, you must synchronize both files**
- Keep the same structure and headings in both versions
- Translate content while preserving the meaning

---

**Last Updated**: 2026-02-09
