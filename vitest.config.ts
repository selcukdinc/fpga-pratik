import { defineConfig } from "vitest/config";

// Cloudflare eklentisi olmadan; testler saf TypeScript modüllerini kapsar
export default defineConfig({
  test: { include: ["src/**/*.test.ts", "shared/**/*.test.ts", "worker/**/*.test.ts"] },
});
