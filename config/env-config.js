const CONFIG = {
  ENV: "prod", // "prod" або "test"

  prod: {

    mediaBase:"https://media.125.co.ua",

    knowledgeBase:"https://media.125.co.ua/knowledge",

    streamBase:"https://customer-ovprf67dzg1lp1nk.cloudflarestream.com",

    cloudflareWorker:"https://old-fog-c80a.tantsa98.workers.dev",

    loginTitle:"Вхід - Довідник",

    loginHeader:"Вхід",

    indexTitle:"Довідник",

    bombersTitle:"Бомбери",

    fpvTitle:"FPV",

    rozvidkaTitle:"Mavic/Autel",

    kamikazeWingTitle:"Крило камікадзе",

    knowledgeTitle:"Знання",

    models3dTitle: "3D Моделі",

    reviewsTitle: "Відгуки"
  },

  test: {

    mediaBase:"https://media.125.co.ua",

    knowledgeBase:"https://media.125.co.ua/knowledge",

    streamBase:"https://customer-ovprf67dzg1lp1nk.cloudflarestream.com",

    cloudflareWorker:"https://silent-sun-7c28.tantsa98.workers.dev",

    loginTitle:"Вхід - Довідник (тест)",

    loginHeader:"Вхід (тест)",

    indexTitle:"Довідник (тест)",

    bombersTitle:"Бомбери (тест)",

    fpvTitle:"FPV (тест)",

    kamikazeWingTitle:"Крило камікадзе (тест)",

    rozvidkaTitle:"Mavic/Autel (тест)",

    knowledgeTitle:"Знання (тест)",

    models3dTitle: "3D Моделі (тест)",

    reviewsTitle: "Відгуки (тест)"
  }
};

Object.assign(
  CONFIG,
  CONFIG[CONFIG.ENV]
);