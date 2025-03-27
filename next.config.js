/** @type {import('next').NextConfig} */
const nextConfig = {
  // Excluir módulos problemáticos do lado do cliente
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignorar todos esses módulos no lado do cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        "mock-aws-s3": false,
        "aws-sdk": false,
        nock: false,
        "pem-jwk": false,
        "bcrypt": false,
        "@mapbox/node-pre-gyp": false
      };
    }
    return config;
  },
  // Configuração para imagens de hosts externos
  images: {
    domains: ['placeholder.com', 'placehold.co', 'loremflickr.com', 'picsum.photos'],
  },
}

module.exports = nextConfig 