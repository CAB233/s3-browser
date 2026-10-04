# s3-browser

   [English](./README.md) | 简体中文

## 截图预览

![](./assets/screenshot.png)

## 技术栈

- 框架: [Astro](https://astro.build/)
- 平台: [Cloudflare Workers](https://workers.cloudflare.com/)
- 开发工具: [Deno](https://deno.com/)
- S3 客户端: [S3mini](https://github.com/good-lly/s3mini/)
- 类型安全: [TypeScript](https://www.typescriptlang.org/)

## 使用方法

### 本地开发

1. 克隆仓库
   ```bash
   git clone https://github.com/CAB233/s3-browser.git
   cd s3-browser
   ```

2. 安装依赖
   ```bash
   deno install
   ```

3. 配置环境变量
   ```
   cp .dev.vars.example .dev.vars
   ```

4. 运行应用
   ```bash
   deno task dev
   ```

   使用 `deno task check` 检查类型，`deno task build` 检查类型并构建，
   `deno task preview` 在本地预览生产构建。

### 部署到 Cloudflare Workers

1. 配置 Wrangler
   ```bash
   cp wrangler.toml.example wrangler.toml
   ```

2. 配置密钥

   在部署之前，请确保已在 Cloudflare 控制面板或通过 wrangler 设置了所需的密钥环境变量：
   ```bash
   deno run -A npm:wrangler secret put BUCKET_ENDPOINT
   deno run -A npm:wrangler secret put BUCKET_REGION
   deno run -A npm:wrangler secret put BUCKET_ACCESS_KEY_ID
   deno run -A npm:wrangler secret put BUCKET_SECRET_ACCESS_KEY
   deno run -A npm:wrangler secret put BUCKET_DOWNLOAD_URL
   ```

3. 构建并部署
   ```bash
   deno task deploy
   ```

## 环境变量

| 名称 | 描述 | 必填 | 默认值 |
|------|-------------|----------|---------|
| `BUCKET_ENDPOINT` | 存储桶端点。 | 是 | - |
| `BUCKET_REGION` | 存储桶区域。 | 是 | - |
| `BUCKET_ACCESS_KEY_ID` | 存储桶访问密钥 ID。 | 是 | - |
| `BUCKET_SECRET_ACCESS_KEY` | 存储桶机密访问密钥。 | 是 | - |
| `BUCKET_DOWNLOAD_URL` | 用于下载对象的公开访问 URL。 | 是 | - |
| `CACHE_BYPASS_PREFIXES` | 绕过目录列表缓存的路径，用逗号分隔。 | 否 | 空 |
| `DISABLE_SE_INDEX` | 设置为 `true` 以禁用搜索引擎索引。 | 否 | `true` |

### 绕过缓存

每个路径覆盖该目录及其子目录。路径首尾的斜杠可省略，两侧空白会自动去除。
设置为 `/` 可让所有目录绕过缓存。留空时沿用默认策略：30 秒有效期，加上
60 秒后台刷新期。

`.dev.vars` 中设置 `CACHE_BYPASS_PREFIXES`：
```dotenv
CACHE_BYPASS_PREFIXES=/live/,/updates/
```

或通过 wrangler 设置：
```
deno run -A npm:wrangler secret put CACHE_BYPASS_PREFIXES
```

## 许可证

MIT

## 致谢

- [CaddyServer](https://github.com/caddyserver) 的 [html 模板](https://github.com/caddyserver/caddy/blob/master/modules/caddyhttp/fileserver/browse.html) 设计。
- Fork 自 [rafiibrahim8/bucketlist](https://github.com/rafiibrahim8/bucketlist)。
