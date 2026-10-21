import type {NextConfig} from 'next';

// NEXT_PUBLIC_BASE_PATH is set for subpath deployments (GitHub Pages project
// site: /pdf-generator). DEPLOY_TARGET=github-pages switches to a static
// export; the default build stays a standalone server build.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const isStaticExport = process.env.DEPLOY_TARGET === 'github-pages';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isStaticExport ? 'export' : 'standalone',
  ...(basePath ? {basePath} : {}),
  ...(isStaticExport ? {trailingSlash: true} : {}),
};

export default nextConfig;
