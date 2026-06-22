export const CONFIG = {
  ENV: "prod" // альбо "prod" альбо "test"
};

CONFIG.codesDb =
  CONFIG.ENV === "prod"
    ? "CODES"
    : "CODEST";

CONFIG.usersDb =
  CONFIG.ENV === "prod"
    ? "USERS"
    : "USERST";

CONFIG.mailSender =
  CONFIG.ENV === "prod"
    ? "noreply@mail.125.co.ua"
    : "testnoreply@mail.125.co.ua";