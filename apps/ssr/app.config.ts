import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import million from "million/compiler";
import { dirname, resolve } from "path";
import { sitemapPlugin } from "tanstack-start-sitemap";
import { fileURLToPath } from "url";
import tsConfigPaths from "vite-tsconfig-paths";
const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src/lib"),
      },
    },
    plugins: [
      sitemapPlugin({
        hostname: "https://www.excelaipro.com",
        defaultChangefreq: "daily",
        defaultPriority: 0.7,

        routeTreePath: resolve(__dirname, "./src/routeTree.gen.ts"),
      }),

      million.vite({
        auto: true,
        rsc: false,
        // server: true,
        // hmr: true,
        // mode: "react",
        log: "info",
        filter: {
          exclude: [
            /src\/lib\/components\/pricing\.tsx/,
            /src\/lib\/components\/footer\.tsx/,
          ],
        },
      }),
      // MillionLint.vite({ experimental: { stabilize: true } }),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },

  // https://react.dev/learn/react-compiler
  react: {
    babel: {
      plugins: [
        [
          "babel-plugin-react-compiler",
          {
            target: "19",
          },
        ],
      ],
    },
  },

  tsr: {
    // https://github.com/TanStack/router/discussions/2863#discussioncomment-12458714
    appDirectory: "./src",
  },

  server: {
    preset: "vercel",
  },
});
