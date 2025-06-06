import { defineConfig } from "vitepress";
import { generateSidebar } from "./utility/sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Chrono Library",
  description: "Reconstructable State Applications on Atom One",
  appearance: "force-dark",
  ignoreDeadLinks: true, // Leave this on because the inherited docs will create broken links
  cleanUrls: false,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", href: "favicon.svg" }],
    [
      "script",
      {
        src: "https://cloud.umami.is/script.js",
        defer: "true",
        "data-website-id": "e2633864-4349-41fb-9ee6-a17729c0a722",
      },
    ],
  ],
  themeConfig: {
    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Overview", link: "https://preview.chronolibrary.com" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "ChronoState", link: "/state" },
      { text: "ChronoSync", link: "/sync" },
      { text: "ChronoConstructor", link: "/constructor" },
    ],
    sidebar: {
      "/getting-started": generateSidebar("docs/getting-started"),
      "/state": generateSidebar("docs/state"),
      "/sync": generateSidebar("docs/sync"),
      "/constructor": generateSidebar("docs/constructor"),
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/allinbits/chronolibrary" },
    ],
  },
});
