import { defineConfig } from "vitest/config";

// Cloudflare eklentisi olmadan; testler saf TypeScript modüllerini kapsar
export default defineConfig({
  test: { include: ["src/**/*.test.ts", "src/**/*.test.tsx", "shared/**/*.test.ts", "worker/**/*.test.ts"] },
});
