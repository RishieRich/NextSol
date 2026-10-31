/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export: the site runs on any static host, no server to keep alive.
  output: "export",
  // Every route becomes /route/index.html, so plain static hosts serve it without rewrites.
  trailingSlash: true,
  // Image optimisation needs a server; images are pre-sized in public/ instead.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
