const AUTHORS = {

  bbps: "бБпС",
  "1mb": "1 МБ",
  "2mb": "2 МБ",
  zrdn: "ЗРДн",
  bar: "БАР",
  sadn: "САДн",
  "1tb": "1 ТБ",
  reb: "РЕБ",
  ppo: "ППО",
  brigade: "Бригада"

};

const CATEGORIES = {

  fpv: "FPV",
  bomberh: "Важкі бомбери",
  bomberl: "Легкі бомбери",
  mavic: "Розвідувальні коптери",
  wingrecon: "Розвідувальні крила",
  wingfpv: "Крила FPV камікадзе",
  wingstrike: "Багаторазові ударні крила",
  ppo: "ППО",
  ew: "РЕБ",
  tacmed: "Такмед",
  conceal: "Маскування",
  general: "Загальне",
  a2: "А2 Бот",
  fa: "FA",
  delta: "Delta"


};

const KNOWLEDGE = [

  {
    id: 1,
    author: "bbps",
    category: "fpv",
    title: "FPV: Основи",
    contentFile: "1.html",
    files: [
      {
        title: "Антени для FPV дронів",
        file: "fpv_antennas.pdf"
      },
      {
        title: "Будова FPV-дрона і основні компоненти",
        file: "bydova_fpv_osnovni_componenty.pdf"
      },
      {
        title: "Будова FPV дрона",
        file: "bydova_fpv.pdf"
      },
      {
        title: "Основне обладнання",
        file: "main_equipment.pdf"
      },
      {
        title: "Список мастхев інструментів і матеріалів",
        file: "musthave_list.pdf"
      },
      {
        title: "Стіки радіопередавача",
        file: "radio_sticks.pdf"
      }
    ],
    photos: [
      {
        title: "Схема керування FPV",
        file: "1.1_control_scheme.webp"
      },
      {
        title: "Схема роботи відеосигналу FPV",
        file: "1.2_video_signal_scheme.webp"
      }
    ],
    videos: [
      {
        title: "",
        file: ""
      }
    ],
    updated: "2026-01-01"
  },

  {
    id: 2,
    author: "2mb",
    category: "bomberh",
    title: "Документація VAMPIRE",
    contentFile: "2.html",
    files: [
      {
        title: "Vampire КЛЕ",
        file: "kle_vampire.pdf"
      },
      {
        title: "VAMPIRE Gen3: Рекомендації з налаштування та використання",
        file: "vampire_gen3.pdf"
      }
    ],
    photos: [
      {
        title: "",
        file: ""
      }
    ],
    videos: [
      {
        title: "",
        file: ""
      }        
    ],
    updated: "2026-01-01"
  },

  {
    id: 3,
    author: "bbps",
    category: "bomberh",
    title: "Важкі бомбери: Документація",
    contentFile: "3.html",
    files: [
      {
        title: "Важкі бомбери - шпаргалка",
        file: "heavy_bombers_cheatsheet.pdf"
      },
      {
        title: "Heavy Shot КЛЕ",
        file: "kle_heavy_shot.pdf"
      },
      {
        title: "Nemesis КЛЕ",
        file: "kle_nemesis.pdf"
      },
      {
        title: "Vampire КЛЕ",
        file: "kle_vampire.pdf"
      }
      ,
      {
        title: "ТТХ антенних комплексів",
        file: "antennas_ttc.pdf"
      }
    ],
    photos: [
      {
        title: "",
        file: ""
      }
    ],
    videos: [
      {
        title: "Підготовка БК перед вильотом",
        file: "4b52c7f6b8fdbb18e3717345f9c75797"
      }        
    ],
    updated: "2026-01-01"
  },

  {
    id: 4,
    author: "bbps",
    category: "bomberh",
    title: "Переобладнання Вампіра на R2D2",
    contentFile: "4.html",
    files: [
      {
        title: "",
        file: ""
      }
    ],
    photos: [
      {
        title: "",
        file: ""
      }
    ],
    videos: [
      {
        title: "",
        file: ""
      }        
    ],
    updated: "2026-01-01"
  },

  {
    id: 5,
    author: "bbps",
    category: "mavic",
    title: "Розвідувальні коптери: Основи",
    contentFile: "5.html",
    files: [
      {
        title: "Розвідувальні коптери: Основи",
        file: "recon_copters_base.pdf"
      },
      {
        title: "Настанова Autel Evo Max 4",
        file: "autel_evo_max_manual_v1.pdf"
      },
      {
        title: "Інструкція для операторів Мавіка",
        file: "mavic_operators_instruction.pdf"
      },
      {
        title: "Matrice 4T/4E",
        file: "matrice4te.pdf"
      },
      {
        title: "Додаткове ПЗ: Кропива, Вежа, Діскорд, Мілчат",
        file: "kropyva_vezha_discord_milchat.pdf"
      }
    ],
    photos: [
      
    ],
    videos: [
      {
        title: "Скиди на розвідувальних коптерах",
        file: "bc684d8088b4248edc3b9be77b094be6"
      }      
    ],
    updated: "2026-01-01"
  },

  {
    id: 6,
    author: "brigade",
    category: "a2",
    title: "A2 BOT: Подача доповіді 'Виконане завдання БпЛА'",
    contentFile: "6.html",
    files: [
      {
        title: "Вхід в систему A2 BOT",
        file: "a2_login.pdf"
      },
      {
        title: "А2 Bot: FPV: 'Виконане завдання (БпЛА)'",
        file: "a2_fpv_mission.pdf"
      },
      {
        title: "А2 Bot: Важкий бомбер: 'Виконане завдання (БпЛА)'",
        file: "a2_heavy_bomber_mission.pdf"
      },
      {
        title: "А2 Bot: Ударне крило: 'Виконане завдання (БпЛА)'",
        file: "a2_strike_wing_mission.pdf"
      },
      {
        title: "А2 Bot: Розвідувальний коптер: 'Виконане завдання (БпЛА)'",
        file: "a2_recon_copter_mission.pdf"
      }
    ],
    photos: [
      ],
    videos: [
      {
        title: "Вхід в систему, перевірка позиції та екіпажу",
        file: "9971f8b4b1840565ea0f6f694da7d1c1"
      },
      {
        title: "Виконане завдання БпЛА - FPV ударна місія",
        file: "4a68577ed639ae52371d7352f7fb1f8b"
      },
      {
        title: "Виконане завдання БпЛА - FPV розвідка/дорозвідка",
        file: "2894963e05919191b81d702aa73a7bdb"
      },
      {
        title: "Виконане завдання БпЛА - Важкий бомбер місія доставки",
        file: "8154f81daf848b2a3176e159db83f802"
      },
      {
        title: "Виконане завдання БпЛА - Важкий бомбер місія мінування",
        file: "321bc2eb2cc2978d4f1d58fa4c82836a"
      },
      {
        title: "Виконане завдання БпЛА - Розвідувальний коптер ударна місія",
        file: "aec5fd510476d7ee3092f2207580636a"
      },
      {
        title: "Виконане завдання БпЛА - Ударне крило",
        file: "094aa56002d2d1104df16396fa92df8d"
      },
      {
        title: "Виконане завдання БпЛА - Перегляд та виправлення події",
        file: "9c9eb0317528dd43af7600b7aecd08a2"
      }

    ],
    updated: "2026-01-01"
  },

  {
    id: 7,
    author: "brigade",
    category: "a2",
    title: "A2 BOT: Подача доповіді 'Втрата БпЛА'",
    contentFile: "7.html",
    files: [
      {
        title: "Вхід в систему A2 BOT",
        file: "a2_login.pdf"
      },
      {
        title: "А2 Bot: Важкий бомбер: 'Втрата (БпЛА)'",
        file: "a2_heavy_bomber_loss.pdf"
      },
      {
        title: "А2 Bot: Розвідувальне крило: 'Втрата (БпЛА)'",
        file: "a2_recon_wing_loss.pdf"
      },
      {
        title: "А2 Bot: Розвідувальний коптер: 'Втрата (БпЛА)'",
        file: "a2_recon_copter_loss.pdf"
      }
    ],
    photos: [ 
    ],
    videos: [
      {
        title: "Вхід в систему, перевірка позиції та екіпажу",
        file: "9971f8b4b1840565ea0f6f694da7d1c1"
      },
      {
        title: "Втрата БпЛА - Розвідувальний коптер",
        file: "c598707cfdb3360bdde10b59719df7e9"
      },
      {
        title: "Втрата БпЛА - Розвідувальний коптер (ударна місія)",
        file: "7ebd742f6860c4138e72b2f049ae4af7"
      },
      {
        title: "Втрата БпЛА - Важкий бомбер (ударна місія)",
        file: "3454e1053afa0eca594c4840da7fdb16"
      },
      {
        title: "Втрата БпЛА - Перегляд та виправлення події",
        file: "78d69aaae6e9146f4d448146c0883a03"
      }      
    ],
    updated: "2026-01-01"
  },

  {
    id: 8,
    author: "brigade",
    category: "fa",
    title: "FA: Верифікація",
    contentFile: "8.html",
    files: [
      {
        title: "Вхід в систему FA",
        file: "fa_login.pdf"
      },
      {
        title: "FA: Вхід та верифікація події 'Виконане завдання БпЛА'",
        file: "fa_login_flight_verification.pdf"
      }
    ],
    photos: [
    ],
    videos: [
      {
        title: "Вхід в систему FA",
        file: "40dcdecef15db3e09ebae54775d4b601"
      },
      {
        title: "FA - Верифікація вильоту дрона",
        file: "626d1f0f6d3e1f5226df07558560b46d"
      }     
    ],
    updated: "2026-01-01"
  },

  {
    id: 9,
    author: "brigade",
    category: "fa",
    title: "A2 Bot/FA: Резерв",
    contentFile: "9.html",
    files: [
      {
        title: "Вхід в систему A2 BOT",
        file: "a2_login.pdf"
      },
      {
        title: "FA: Вхід та верифікація події 'Втрата БпЛА'",
        file: "fa_login_loss_verification.pdf"
      },
      {
        title: "А2 Bot: Важкий бомбер: 'Втрата (БпЛА)'",
        file: "a2_heavy_bomber_loss_2.pdf"
      },
      {
        title: "А2 Bot: Розвідувальне крило: 'Втрата (БпЛА)'",
        file: "a2_recon_wing_loss_2.pdf"
      },
      {
        title: "А2 Bot: Розвідувальний коптер: 'Втрата (БпЛА)'",
        file: "a2_recon_copter_loss_2.pdf"
      }
    ],
    photos: [ 
    ],
    videos: [
      {
        title: "Вхід в систему FA",
        file: "40dcdecef15db3e09ebae54775d4b601"
      },
      {
        title: "FA - Подання резервного дрона на списання",
        file: "219cf451a1759294db8cbe9e3d7e78a0"
      },
      {
        title: "FA - Верифікація втрати дрона",
        file: "5bbc90df0f0ad505eed755ca80487653"
      }   
    ],
    updated: "2026-01-01"
  },

  {
    id: 10,
    author: "brigade",
    category: "delta",
    title: "Корисні матеріали Delta",
    contentFile: "10.html",
    files: [
      {
        title: "",
        file: ""
      }
    ],
    photos: [ 
    ],
    videos: [
      {
        title: "",
        file: ""
      }      
    ],
    updated: "2026-01-01"
  },

  {
    id: 11,
    author: "bbps",
    category: "fpv",
    title: "FPV: Плати ініціації",
    contentFile: "11.html",
    files: [
      {
        title: "Каталог плат ініціації",
        file: "catalog_plat_iniciacii.pdf"
      }
    ],
    photos: [ 
    ],
    videos: [
      {
        title: "",
        file: ""
      }      
    ],
    updated: "2026-01-01"
  },

  {
    id: 12,
    author: "bbps",
    category: "fpv",
    title: "FPV: Налаштування 'Бешкет', 'Блінк', 'Спук'",
    contentFile: "12.html",
    files: [
      {
        title: "",
        file: ""
      }
    ],
    photos: [ 
    ],
    videos: [
      {
        title: "",
        file: ""
      }      
    ],
    updated: "2026-01-01"
  }

];