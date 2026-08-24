export const CONFIG = {

  /*Середовище "prod" "test"*/
  ENV:"prod",

  /*OTP*/
  otpTtl:180,
  otpSendCooldown:60,
  otpMaxFailedAttempts:2,

  /*Session*/
  sessionTtl:86400

};

/* OTP KV*/
CONFIG.codesDb =
  CONFIG.ENV === "prod"
    ? "CODES"
    : "CODEST";

/* Users KV*/
CONFIG.usersDb =
  CONFIG.ENV === "prod"
    ? "USERS"
    : "USERST";

/*Sessions KV*/
CONFIG.sessionsDb =
  CONFIG.ENV === "prod"
    ? "SESSIONS"
    : "SESSIONST";

/*Email sender*/
CONFIG.mailSender =
  CONFIG.ENV === "prod"
    ? "noreply@mail.125.co.ua"
    : "testnoreply@mail.125.co.ua";