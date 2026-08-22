import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ ones) for dev proxy use only.
  // Non-VITE_ vars are never passed to the client bundle.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        // In dev, /api/sheets is proxied directly to Google Sheets using the
        // local SHEETS_API_KEY. In production, Netlify routes this to the function.
        "/api/sheets": {
          target: "https://sheets.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, "http://localhost");
            const tab   = url.searchParams.get("tab");
            const range = url.searchParams.get("range");
            const sheetsId  = env.SHEETS_ID  || env.VITE_SHEETS_ID;
            const apiKey    = env.SHEETS_API_KEY;
            const encoded   = encodeURIComponent(`'${tab}'!${range}`);
            return `/v4/spreadsheets/${sheetsId}/values/${encoded}?key=${apiKey}`;
          },
        },
      },
    },
  };
});
