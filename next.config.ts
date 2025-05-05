/** @type {import('next').NextConfig} */

// Define interfaces for configuration types
interface SecurityHeaders {
  key: string;
  value: string;
}

interface HeaderConfig {
  source: string;
  headers: SecurityHeaders[];
}

interface RedirectConfig {
  source: string;
  destination: string;
  permanent: boolean;
}

interface WebpackConfig {
  externals?: (string | { [key: string]: string | string[] })[];
}

interface NextConfig {
  reactStrictMode: boolean;
  output: string;
  redirects(): Promise<RedirectConfig[]>;
  headers(): Promise<HeaderConfig[]>;
  webpack: (config: WebpackConfig, { isServer }: { isServer: boolean }) => WebpackConfig;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for optimized Docker builds

  // Configure redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/dashboard',
        permanent: true,
      },
    ];
  },

  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Handle WebSocket connection in production
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [...(config.externals || []), 'ws'];
    }
    return config;
  },
};

module.exports = nextConfig;
