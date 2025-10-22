/** @type {import('next').NextConfig} */

const DEFAULT_DB_CREDENTIAL = "20251022";

const dbWarnings = [];

const sanitizeDbPort = (value) => {
  if (!value) {
    dbWarnings.push("DB_PORT is not configured.");
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    dbWarnings.push("DB_PORT is not a valid number.");
    return undefined;
  }

  return parsed;
};

const dbRuntimeConfig = (() => {
  if (!process.env.DB_HOST) {
    dbWarnings.push("DB_HOST is not configured.");
  }

  if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    dbWarnings.push(
      `DB_NAME/DB_USER/DB_PASSWORD not fully provided. Using placeholder value "${DEFAULT_DB_CREDENTIAL}" in runtime config.`,
    );
  }

  return {
    host: process.env.DB_HOST ?? "",
    port: sanitizeDbPort(process.env.DB_PORT),
    name: process.env.DB_NAME ?? DEFAULT_DB_CREDENTIAL,
    user: process.env.DB_USER ?? DEFAULT_DB_CREDENTIAL,
    password: process.env.DB_PASSWORD ?? DEFAULT_DB_CREDENTIAL,
  };
})();

const dbRuntimeMessage =
  dbWarnings.length > 0 ? dbWarnings.join(" ") : undefined;

if (dbRuntimeMessage) {
  console.warn(`[Next Config] ${dbRuntimeMessage}`);
}

const nextConfig = {
  async rewrites() {
    const ret = [
      {
        source: "/api/proxy/:path*",
        destination: "https://api.openai.com/:path*",
      },
      {
        source: "/google-fonts/:path*",
        destination: "https://fonts.googleapis.com/:path*",
      },
      {
        source: "/sharegpt",
        destination: "https://sharegpt.com/api/conversations",
      },
    ];

    const apiUrl = process.env.API_URL;
    if (apiUrl) {
      console.log("[Next] using api url ", apiUrl);
      ret.push({
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      });
    }

    return {
      beforeFiles: ret,
    };
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  output: "standalone",
  serverRuntimeConfig: {
    db: dbRuntimeConfig,
    dbFallbackMessage: dbRuntimeMessage,
  },
};

export default nextConfig;
