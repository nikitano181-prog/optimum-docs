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
    "momentum/overview",
    { type: "doc", id: "momentum/overview", label: "1. Резюме проекта" },
    { type: "doc", id: "momentum/overview", label: "2. Ценность и сценарии" },
    { type: "doc", id: "momentum/overview", label: "3. Архитектура и стек" },
    { type: "doc", id: "momentum/overview", label: "4. Быстрый старт" },
    { type: "doc", id: "momentum/overview", label: "5. Переменные окружения (.env)" },
    { type: "doc", id: "momentum/overview", label: "6. Структура проекта" },
    { type: "doc", id: "momentum/overview", label: "7. База данных (SQL)" },
    { type: "doc", id: "momentum/overview", label: "8. Безопасность и RLS" },
    { type: "doc", id: "momentum/overview", label: "9. API слои и интеграции" },
    { type: "doc", id: "momentum/overview", label: "10. Фронтенд фичи" },
    { type: "doc", id: "momentum/overview", label: "11. Realtime" },
    { type: "doc", id: "momentum/overview", label: "12. Кэширование и производительность" },
    { type: "doc", id: "momentum/overview", label: "13. Очки и лидерборд" },
    { type: "doc", id: "momentum/overview", label: "14. Деплой и CI/CD" },
    { type: "doc", id: "momentum/overview", label: "15. Демо для жюри" },
    { type: "doc", id: "momentum/overview", label: "16. FAQ / Риски" },
    { type: "doc", id: "momentum/overview", label: "17. Roadmap" },
  ],
};

module.exports = sidebars;
