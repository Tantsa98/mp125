const CONFIG = {
  ENV: "prod", // "prod" або "test"

  prod: {
    //codesDb: "CODES",
    //usersDb: "USERS",
    //mailSender: "noreply@mail.125.co.ua",

    cloudflareWorker:
      "https://old-fog-c80a.tantsa98.workers.dev",

    loginTitle:
      "Вхід - Довідник",

    loginHeader:
      "Вхід",

    indexTitle:
      "Довідник БК",

    bombersTitle:
      "Бомбери",

    fpvTitle:
      "FPV",

    rozvidkaTitle:
      "Mavic/Autel"
  },

  test: {
    //codesDb: "CODEST",
    //usersDb: "USERST",
    //mailSender: "testnoreply@mail.125.co.ua",

    cloudflareWorker:
      "https://silent-sun-7c28.tantsa98.workers.dev",

    loginTitle:
      "Вхід - Довідник (тест)",

    loginHeader:
      "Вхід (тест)",

    indexTitle:
      "Довідник БК (тест)",

    bombersTitle:
      "Бомбери (тест)",

    fpvTitle:
      "FPV (тест)",

    rozvidkaTitle:
      "Mavic/Autel (тест)"
  }
};

Object.assign(
  CONFIG,
  CONFIG[CONFIG.ENV]
);