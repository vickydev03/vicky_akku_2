import { Inngest } from "inngest";

// Inngest SDK reads INNGEST_BASE_URL or INNGEST_DEV from environment variables
// For Docker, we need to use the service name instead of localhost
const inngestBaseUrl =
  process.env.INNGEST_DEV_SERVER_URL ||
  process.env.INNGEST_BASE_URL ||
  process.env.INNGEST_DEV;

console.log("Inngest baseUrl:", inngestBaseUrl);
console.log("All Inngest env vars:", {
  INNGEST_DEV_SERVER_URL: process.env.INNGEST_DEV_SERVER_URL,
  INNGEST_BASE_URL: process.env.INNGEST_BASE_URL,
  INNGEST_DEV: process.env.INNGEST_DEV,
});

export const inngest = new Inngest({
  id: "backend-service",
  ...(inngestBaseUrl ? { baseUrl: inngestBaseUrl } : {}),
});
