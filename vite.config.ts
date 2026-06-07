import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: "electron/main.ts",
      },
      preload: {
        input: path.join(__dirname, "electron/preload.ts"),
      },
      renderer:
        process.env.NODE_ENV === "test"
          ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
            undefined
          : {},
    }),
    // Custom plugin to short-circuit Vite's SPA fallback for virtual apps
    {
      name: "emocros-app-spa-bypass",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith("/app-route/")) {
            // Tell Vite to step aside and return a 404,
            // allowing your Service Worker (sw.ts) to intercept the request instead.
            res.statusCode = 424;
            res.setHeader("Content-Type", "text/html");
            res.end(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf8" />
    <title>Use the Emocros app!</title>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>Use the Emocros desktop app!</h1>
    <p>
      You are likely viewing this through your browser via the direct URL.<br />
      You must use the Emocros desktop app to launch this. Emocros apps rely<br />
      on a Service Worker to work, and visiting the URL via the browser won't<br />
      register the Service Worker and therefore fail.
    </p>
  </body>
</html>
`);
            return;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Service-Worker-Allowed": "/",
    },
  },
});
