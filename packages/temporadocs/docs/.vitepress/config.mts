import { defineConfig } from "vitepress";
import { generateSidebar } from "./utility/sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TemporaLib",
  description: "TemporaLib",
  appearance: "force-dark",
  ignoreDeadLinks: true, // Leave this on because the inherited docs will create broken links
  cleanUrls: false,
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "favicon.ico" }]],
  themeConfig: {
    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "TemporaState", link: "/temporastate" },
      { text: "TemporaSync", link: "/temporasync" },
      { text: "TemporaConstructor", link: "/temporaconstructor" },
    ],
    sidebar: {
      "/getting-started": generateSidebar("docs/getting-started"),
      "/temporastate": generateSidebar("docs/temporastate"),
      "/temporasync": generateSidebar("docs/temporasync"),
      "/temporaconstructor": generateSidebar("docs/temporaconstructor"),
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/allinbits/temporalib" },
    ],
    logo: "/icon.svg",
  },
});
