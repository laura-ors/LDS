import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Data Science",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: { provider: 'google', tagId: 'G-8BKY7CJXF0' },
    locale: "ru-RU",
    baseUrl: "learningdatascience.ru",
    ignorePatterns: ["private", "templates", ".obsidian", "_Черновики"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "rgb(248, 243, 242)",
          lightgray: "#A0CDB8",
          gray: "#A0CDB8",
          darkgray: "rgb(89, 79, 103)",
          dark: "rgb(89, 79, 103)",
          secondary: "rgb(89, 79, 103)",
          tertiary: "#6a73b0",
          highlight: "rgba(29, 163, 98, 0.15)",
          textHighlight: "#A0CDB8",
        },
        darkMode: {
          light: "#000000",
          lightgray: "rgba(0, 255, 170, 0.15)",
          gray: "#bfb2bb",
          darkgray: "#ffffff",
          dark: "#ffffff",
          secondary: "#ffffff",
          tertiary: "rgb(160, 219, 192)",
          highlight: "rgba(0, 255, 170, 0.15)",
          textHighlight: "#000000",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
