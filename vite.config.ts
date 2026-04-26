// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const githubPagesBase = process.env.BASE_PATH ?? "/";
const routerBasepath = githubPagesBase === "/" ? undefined : githubPagesBase.replace(/\/$/, "");

export default defineConfig({
  vite: {
    base: githubPagesBase,
  },
  tanstackStart: {
    router: {
      basepath: routerBasepath,
    },
    prerender: {
      enabled: true,
      crawlLinks: false,
    },
    pages: [{ path: "/" }],
  },
});
