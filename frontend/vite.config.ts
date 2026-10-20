import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs"; // For reading TLS key and certificate files

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // Load all environment variables without a prefix filtering

  const port = Number(env.DEV_SERVER_PORT || "5173");
  const httpsSetting = env.HTTPS_ENABLED || "false";

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      "DEV_SERVER_PORT must be an integer between 1 and 65535.",
    );
  } // Condition to check if the port is a valid integer within the range of valid port numbers (1-65535).

  if (!["true", "false"].includes(httpsSetting)) {
    throw new Error("HTTPS_ENABLED must be true or false.");
  }

  const useHttps = command === "serve" && httpsSetting === "true"; // Enable HTTPS ONLY when running the development server and HTTPS_ENABLED is set to true.

  if (useHttps && (!env.TLS_KEY_PATH || !env.TLS_CERT_PATH)) {
    throw new Error(
      "HTTPS requires TLS_KEY_PATH and TLS_CERT_PATH.",
    );
  } // Check if HTTPS is enabled and if the TLS key and certificate paths are provided in the environment variables.

  const httpsOptions = useHttps ? {
        key: readFileSync(env.TLS_KEY_PATH),
        cert: readFileSync(env.TLS_CERT_PATH),
      } : undefined; // Read the TLS key and certificate files if HTTPS is enabled.

  return {
    plugins: [react(),tailwindcss()],

    resolve:{
      alias:{
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "localhost",
      port,
      strictPort: true,
      https: httpsOptions,
    },

    build: {
      sourcemap: mode === "development",
    },

    base: "./",
  }; // Instead of using the default Vite configuration, we are customizing the server settings based on environment variables.
});