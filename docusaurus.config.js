// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
require('dotenv').config();

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Optimum",
  tagline: "Интерактивная многопользовательская викторина",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://optimum-docs.netlify.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.BASE_URL || '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "optimum-team", // Usually your GitHub org/user name.
  projectName: "optimum", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ru",
    locales: ["ru"],
  },

  themes: [["docusaurus-json-schema-plugin", {}]],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/optimum-team/optimum",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-M3JWW8N2XQ", // UPDATE THIS
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {
          name: "keywords",
          content: "quiz, викторина, multiplayer, real-time, React, Node.js, WebSocket, интерактивная игра",
        },
      ],
      // Replace with your project's social card
      image: "img/og-image.png",
      navbar: {
        title: "Optimum",
        logo: {
          alt: "Optimum Logo",
          src: "img/logo.png",
          href: "/",
          target: "_self",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Документация",
          },
          {
            to: "https://github.com/optimum-team/optimum",
            label: "GitHub",
            position: "right",
            className: "github-navbar",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Проект",
            items: [
              {
                label: "GitHub",
                to: "https://github.com/optimum-team/optimum",
              },
              {
                label: "Документация",
                to: "/",
              },
            ],
          },
          {
            title: "Технологии",
            items: [
              {
                label: "React",
                to: "#",
              },
              {
                label: "Node.js",
                to: "#",
              },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} Optimum. Интерактивная многопользовательская викторина.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["json"],
      },
      ...(process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY && process.env.ALGOLIA_INDEX_NAME
        ? {
            algolia: {
              appId: process.env.ALGOLIA_APP_ID,
              apiKey: process.env.ALGOLIA_API_KEY,
              indexName: process.env.ALGOLIA_INDEX_NAME,
              contextualSearch: true,
            },
          }
        : {}),
    }),
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          // Домашняя страница → раздел Optimum
          { from: "/", to: "/momentum/index" },
        ],
      },
    ],
  ],
};

module.exports = config;
