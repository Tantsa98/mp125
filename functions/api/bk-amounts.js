import {
  CONFIG
} from "../../config/login-config.js";

import {
  getAuthenticatedUser
} from "../_lib/auth.js";


function jsonResponse(
  data,
  status = 200
) {

  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {

        "Content-Type":
          "application/json; charset=utf-8",

        "Cache-Control":
          "no-store"

      }

    }
  );

}


export async function onRequestGet(
  context
) {

  const {
    request,
    env
  } = context;


  try {

    /*
     * Перевіряємо
     * авторизованого користувача
     */

    const auth =
      await getAuthenticatedUser(
        request,
        env,
        CONFIG
      );


    if (!auth) {

      return jsonResponse(
        {
          success: false,
          error: "Unauthorized"
        },
        401
      );

    }


    /*
     * Доступ до кількості БК
     * мають тільки admin, duty, pilotbk
     */

    const allowedRoles = [
      "admin",
      "duty",
      "pilotbk"
    ];


    const role =
      auth.user.role;


    /*
     * Якщо роль не має доступу —
     * дані з Worker навіть
     * не запитуються
     */

    if (
      !allowedRoles.includes(
        role
      )
    ) {

      return jsonResponse({

        success: true,

        counts: null

      });

    }


    /*
     * URL захищеного Worker
     */

    const workerUrl =
      env.BK_AMOUNTS_WORKER_URL;


    if (!workerUrl) {

      throw new Error(
        "BK_AMOUNTS_WORKER_URL is not configured"
      );

    }


    /*
     * Секрет для доступу
     * до Worker
     */

    const workerSecret =
      env.BK_AMOUNTS_API_SECRET;


    if (!workerSecret) {

      throw new Error(
        "BK_AMOUNTS_API_SECRET is not configured"
      );

    }


    /*
     * Запит до захищеного Worker
     */

    const workerResponse =
      await fetch(
        workerUrl,
        {

          method: "GET",

          headers: {

            "Authorization":
              `Bearer ${workerSecret}`,

            "Cache-Control":
              "no-store"

          }

        }
      );


    /*
     * Worker повернув помилку
     */

    if (
      !workerResponse.ok
    ) {

      throw new Error(
        `BK Worker error: ${workerResponse.status}`
      );

    }


    /*
     * Отримуємо кількості БК
     */

    const counts =
      await workerResponse.json();


    /*
     * Повертаємо дані
     * тільки для admin / duty / pilotbk
     */

    return jsonResponse({

      success: true,

      counts

    });

  }
  catch (
    error
  ) {

    console.error(
      "api/bk-amounts error:",
      error
    );


    return jsonResponse(
      {

        success: false,

        error:
          "Server error"

      },
      500
    );

  }

}