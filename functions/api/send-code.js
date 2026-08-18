import { CONFIG } from "../../config/login-config.js";

import {
  normalizeUserRecord
} from "../_lib/access.js";


function textResponse(
  message,
  status
) {

  return new Response(
    message,
    {
      status,

      headers: {

        "Content-Type":
          "text/plain; charset=utf-8",

        "Cache-Control":
          "no-store"

      }

    }
  );

}


/*
 * Отримуємо та перевіряємо
 * OTP TTL
 */

function getOtpTtl() {

  const otpTtl =
    Number(CONFIG.otpTtl);

  if (
    !Number.isInteger(otpTtl) ||
    otpTtl <= 0
  ) {

    throw new Error(
      "Invalid OTP TTL configuration"
    );

  }

  return otpTtl;

}


/*
 * Отримуємо та перевіряємо
 * cooldown між відправленнями OTP
 */

function getOtpSendCooldown() {

  const otpSendCooldown =
    Number(CONFIG.otpSendCooldown);

  if (
    !Number.isInteger(otpSendCooldown) ||
    otpSendCooldown <= 0
  ) {

    throw new Error(
      "Invalid OTP send cooldown configuration"
    );

  }

  return otpSendCooldown;

}


/*
 * Генеруємо OTP
 */

function createOtpCode() {

  const randomValues =
    new Uint32Array(1);

  crypto.getRandomValues(
    randomValues
  );

  const code =
    100000 +
    (
      randomValues[0] %
      900000
    );

  return code.toString();

}


export async function onRequestPost(context) {

  const {
    request,
    env
  } = context;

  try {

    /*
     * Читаємо request body
     */

    const body =
      await request.json();

    const email =
      body.email
        ?.toLowerCase()
        .trim();


    /*
     * Перевіряємо email
     */

    if (!email) {

      return textResponse(
        "Missing email",
        400
      );

    }


    /*
     * Перевіряємо KV bindings
     */

    const codesStore =
      env[CONFIG.codesDb];

    if (!codesStore) {

      throw new Error(
        `Codes KV binding not found: ${CONFIG.codesDb}`
      );

    }

    const usersStore =
      env[CONFIG.usersDb];

    if (!usersStore) {

      throw new Error(
        `Users KV binding not found: ${CONFIG.usersDb}`
      );

    }


    /*
     * Завантажуємо користувача
     */

    const userRaw =
      await usersStore.get(
        email
      );

    const user =
      normalizeUserRecord(
        userRaw
      );

    if (
      !user ||
      user.active !== true
    ) {

      return textResponse(
        "Not allowed",
        403
      );

    }


    /*
     * Отримуємо конфігурацію OTP
     */

    const otpTtl =
      getOtpTtl();

    const otpSendCooldown =
      getOtpSendCooldown();


    /*
     * Перевіряємо cooldown
     */

    const cooldownKey =
      `otp:cooldown:${email}`;

    const cooldown =
      await codesStore.get(
        cooldownKey
      );

    if (cooldown) {

      return textResponse(
        "Too many requests",
        429
      );

    }


    /*
     * Створюємо OTP
     */

    const code =
      createOtpCode();


    /*
     * Зберігаємо OTP
     */

    await codesStore.put(
      email,
      code,
      {
        expirationTtl:
          otpTtl
      }
    );


    /*
     * Створюємо cooldown
     */

    await codesStore.put(
      cooldownKey,
      "1",
      {
        expirationTtl:
          otpSendCooldown
      }
    );


    /*
     * Відправляємо email
     */

    const resendResponse =
      await fetch(
        "https://api.resend.com/emails",
        {
          method:
            "POST",

          headers: {

            "Authorization":
              `Bearer ${env.RESEND_API_KEY}`,

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              from:
                CONFIG.mailSender,

              to:
                email,

              subject:
                "Код доступу",

              html: `
                <div style="font-family:sans-serif">
                  <h2>Код входу</h2>

                  <p>Твій код:</p>

                  <h1>${code}</h1>

                  <p>
                    Дійсний 3 хвилини
                  </p>
                </div>
              `

            })

        }
      );


    /*
     * Помилка Resend
     */

    if (
      !resendResponse.ok
    ) {

      const error =
        await resendResponse.text();

      console.error(
        "Resend error:",
        error
      );

      /*
       * OTP не повинен залишатися
       * активним, якщо email
       * не був відправлений
       */

      await codesStore.delete(
        email
      );

      await codesStore.delete(
        cooldownKey
      );

      return textResponse(
        "Email error",
        500
      );

    }


    /*
     * Успішна відповідь
     */

    return textResponse(
      "OK",
      200
    );

  }
  catch (error) {

    console.error(
      "Send code error:",
      error
    );

    return textResponse(
      "Server error",
      500
    );

  }

}