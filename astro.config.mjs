import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const SITE = "https://www.regeneracjafalownikow.pl";

export default defineConfig({
  site: SITE,

  integrations: [
    sitemap({
      lastmod: new Date(),
      changefreq: "weekly",
      priority: 0.7,
      serialize(item) {
        if (item.url === `${SITE}/`) item.priority = 1.0;
        return item;
      },
    }),
  ],

  output: "static",

  build: {
    assets: "_assets",
    inlineStylesheets: "always",
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
    },
    define: {
      "import.meta.env.PUBLIC_API_BASE_URL": JSON.stringify(
        process.env.PUBLIC_API_BASE_URL || ""
      ),
    },
  },
});
