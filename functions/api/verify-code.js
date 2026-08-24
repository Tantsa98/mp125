import { CONFIG } from "../../config/login-config.js";

import {
  normalizeUserRecord
} from "../_lib/access.js";

import {
  createSession,
  createAuthCookie
} from "../_lib/auth.js";


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

    const code =
      body.code
        ?.toString()
        .trim();


    /*
     * Перевіряємо вхідні дані
     */

    if (
      !email ||
      !code
    ) {

      return textResponse(
        "Missing data",
        400
      );

    }


    /*
     * Перевіряємо OTP
     */

    const codesStore =
      env[CONFIG.codesDb];

    if (!codesStore) {

      throw new Error(
        `Codes KV binding not found: ${CONFIG.codesDb}`
      );

    }

    const savedCode =
      await codesStore.get(email);

    if (
      !savedCode ||
      savedCode !== code
    ) {

      return textResponse(
        "Invalid code",
        401
      );

    }


    /*
     * Завантажуємо користувача
     */

    const usersStore =
      env[CONFIG.usersDb];

    if (!usersStore) {

      throw new Error(
        `Users KV binding not found: ${CONFIG.usersDb}`
      );

    }

    const userRaw =
      await usersStore.get(email);

    if (!userRaw) {

      return textResponse(
        "User not found",
        403
      );

    }


    /*
     * Нормалізуємо користувача
     */

    const user =
      normalizeUserRecord(userRaw);

    if (!user) {

      console.error(
        "Invalid user configuration:",
        email
      );

      return textResponse(
        "Invalid user configuration",
        403
      );

    }


    /*
     * Перевіряємо active
     */

    if (
      user.active !== true
    ) {

      return textResponse(
        "User disabled",
        403
      );

    }


    /*
     * Створюємо серверну сесію
     */

    const session =
      await createSession(
        env,
        CONFIG,
        email,
        user
      );

    if (!session) {

      return textResponse(
        "Session creation failed",
        403
      );

    }


    /*
     * OTP видаляємо тільки після
     * успішного створення сесії
     */

    await codesStore.delete(email);


    /*
     * Повертаємо auth cookie
     */

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        status: 200,

        headers: {

          "Content-Type":
            "application/json; charset=utf-8",

          "Cache-Control":
            "no-store",

          "Set-Cookie":
            createAuthCookie(
              session.id,
              CONFIG
            )

        }

      }
    );

  }
  catch (error) {

    console.error(
      "Verify code error:",
      error
    );

    return textResponse(
      "Server error",
      500
    );

  }

}