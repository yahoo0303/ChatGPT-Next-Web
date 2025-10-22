import md5 from "spark-md5";

const DEFAULT_DB_CREDENTIAL = "20251022";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string;
      CODE?: string;
      BASE_URL?: string;
      PROXY_URL?: string;
      VERCEL?: string;
      HIDE_USER_API_KEY?: string; // disable user's api key input
      DISABLE_GPT4?: string; // allow user to use gpt-4 or not
      DB_HOST?: string;
      DB_PORT?: string;
      DB_NAME?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
    }
  }
}

const dbWarnings: string[] = [];

const parseDbPort = (value?: string) => {
  if (!value) {
    dbWarnings.push("DB_PORT is not configured.");
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    dbWarnings.push("DB_PORT is not a valid number.");
    return undefined;
  }

  return String(parsed);
};

const DB_CONFIG = (() => {
  if (!process.env.DB_HOST) {
    dbWarnings.push("DB_HOST is not configured.");
  }

  const missingCredentialKeys: string[] = [];

  if (!process.env.DB_NAME) {
    missingCredentialKeys.push("DB_NAME");
  }

  if (!process.env.DB_USER) {
    missingCredentialKeys.push("DB_USER");
  }

  if (!process.env.DB_PASSWORD) {
    missingCredentialKeys.push("DB_PASSWORD");
  }

  if (missingCredentialKeys.length > 0) {
    dbWarnings.push(
      `${missingCredentialKeys.join(
        ", ",
      )} not provided. Using placeholder value "${DEFAULT_DB_CREDENTIAL}".`,
    );
  }

  const config = {
    host: process.env.DB_HOST,
    port: parseDbPort(process.env.DB_PORT),
    name: process.env.DB_NAME ?? DEFAULT_DB_CREDENTIAL,
    user: process.env.DB_USER ?? DEFAULT_DB_CREDENTIAL,
    password: process.env.DB_PASSWORD ?? DEFAULT_DB_CREDENTIAL,
  };

  if (dbWarnings.length > 0) {
    console.warn(`[Server Config] ${dbWarnings.join(" ")}`);
  }

  return config;
})();

const DB_FALLBACK_MESSAGE =
  dbWarnings.length > 0 ? dbWarnings.join(" ") : undefined;

const IS_DB_CONFIGURED = Boolean(DB_CONFIG.host && DB_CONFIG.port);

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
  const code = process.env.CODE;

  try {
    const codes = (code?.split(",") ?? [])
      .filter((v) => !!v)
      .map((v) => md5.hash(v.trim()));
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();

export const getServerSideConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  return {
    apiKey: process.env.OPENAI_API_KEY,
    code: process.env.CODE,
    codes: ACCESS_CODES,
    needCode: ACCESS_CODES.size > 0,
    baseUrl: process.env.BASE_URL,
    proxyUrl: process.env.PROXY_URL,
    isVercel: !!process.env.VERCEL,
    hideUserApiKey: !!process.env.HIDE_USER_API_KEY,
    enableGPT4: !process.env.DISABLE_GPT4,
    db: { ...DB_CONFIG },
    isDbConfigured: IS_DB_CONFIGURED,
    dbFallbackMessage: DB_FALLBACK_MESSAGE,
  };
};
