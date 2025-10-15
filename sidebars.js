/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    "momentum/index",
    {
      type: "link",
      label: "1. Резюме проекта",
      href: "./momentum/overview#1-резюме-проекта-elevator-pitch",
    },
    {
      type: "link",
      label: "2. Ценность и сценарии",
      href: "./momentum/overview#2-ценность-и-сценарии-использования",
    },
    {
      type: "link",
      label: "3. Архитектура и стек",
      href: "./momentum/overview#3-архитектура-и-стек",
    },
    {
      type: "link",
      label: "4. Быстрый старт",
      href: "./momentum/overview#4-быстрый-старт-локально",
    },
    {
      type: "link",
      label: "5. Переменные окружения (.env)",
      href: "./momentum/overview#5-переменные-окружения-env",
    },
    {
      type: "link",
      label: "6. Структура проекта",
      href: "./momentum/overview#6-структура-проекта",
    },
    {
      type: "link",
      label: "7. База данных (SQL)",
      href: "./momentum/overview#7-база-данных-схема-и-sql",
    },
    {
      type: "link",
      label: "8. Безопасность и RLS",
      href: "./momentum/overview#8-безопасность-и-rls-политики",
    },
    {
      type: "link",
      label: "9. API слои и интеграции",
      href: "./momentum/overview#9-api-слои-и-интеграции",
    },
    {
      type: "link",
      label: "10. Фронтенд фичи",
      href: "./momentum/overview#10-фронтенд-страницы-и-ключевые-фичи",
    },
    {
      type: "link",
      label: "11. Realtime",
      href: "./momentum/overview#11-realtime-подписки-и-потоки",
    },
    {
      type: "link",
      label: "12. Кэширование и производительность",
      href: "./momentum/overview#12-кэширование-и-производительность",
    },
    {
      type: "link",
      label: "13. Очки и лидерборд",
      href: "./momentum/overview#13-начисление-очков-и-лидерборд",
    },
    {
      type: "link",
      label: "14. Деплой и CI/CD",
      href: "./momentum/overview#14-деплой-и-cicd",
    },
    {
      type: "link",
      label: "15. Демо для жюри",
      href: "./momentum/overview#15-сценарий-демо-для-жюри-57-минут",
    },
    {
      type: "link",
      label: "16. FAQ / Риски",
      href: "./momentum/overview#16-faq--риски--ограничения",
    },
    {
      type: "link",
      label: "17. Roadmap",
      href: "./momentum/overview#17-roadmap-после-хакатона",
    },
  ],
};

module.exports = sidebars;
