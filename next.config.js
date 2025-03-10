/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configure basePath for GitHub Pages deployment
  // This should match your repository name
  // For example, if your repo is "username/seo-project-tracker", use "/seo-project-tracker"
  basePath: process.env.NODE_ENV === 'production' ? '/seo-project-tracker' : '',
  // Disable image optimization since it's not supported in static exports
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for better compatibility with static hosting
  trailingSlash: true,
};

module.exports = nextConfig;
