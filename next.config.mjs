/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENTS_CLIENT_ID: process.env.GOOGLE_CLIENTS_CLIENT_ID,
    GOOGLE_CLIENTS_CLIENT_SECRET: process.env.GOOGLE_CLIENTS_CLIENT_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
    CF_D1_DB_ID: process.env.CF_D1_DB_ID,
    CF_AUTH_EMAIL: process.env.CF_AUTH_EMAIL,
    CF_API_KEY: process.env.CF_API_KEY,
  },
};

export default nextConfig;
