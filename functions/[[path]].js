import { CONFIG } from "../config/login-config.js";

import {
  getAuthenticatedUser,
  createExpiredAuthCookie
} from "./_lib/auth.js";

import {
  hasPermission,
  PERMISSIONS
} from "./_lib/access.js";


function redirectToLogin(
  url,
  clearAuth = false
) {

  const headers = {

    "Location":
      url.origin + "/login.html",

    "Cache-Control":
      "no-store"

  };

  if (clearAuth) {

    headers["Set-Cookie"] =
      createExpiredAuthCookie();

  }

  return new Response(
    null,
    {
      status: 302,
      headers
    }
  );

}


export async function onRequest(context) {

  const {
    request,
    env
  } = context;

  const url =
    new URL(request.url);

  const path =
    url.pathname;


  /*
   * Публічна сторінка входу
   */

  if (
    path === "/login" ||
    path === "/login.html"
  ) {

    return context.next();

  }


  /*
   * API мають власну
   * серверну авторизацію
   */

  if (
    path.startsWith("/api/")
  ) {

    return context.next();

  }


  /*
   * Публічна статика
   *
   * Поки залишаємо поточну
   * логіку для сумісності сайту.
   */

  if (
    /\.(css|js|png|jpg|jpeg|webp|ico|svg|woff|woff2)$/i
      .test(path)
  ) {

    return context.next();

  }


  try {

    /*
     * Перевіряємо session
     * та актуального користувача
     */

    const auth =
      await getAuthenticatedUser(
        request,
        env,
        CONFIG
      );

    if (!auth) {

      return redirectToLogin(
        url,
        true
      );

    }


    /*
     * Перевіряємо базовий
     * доступ до сайту
     */

    if (
      !hasPermission(
        auth.user,
        PERMISSIONS.SITE_ACCESS
      )
    ) {

      return new Response(
        "Forbidden",
        {
          status: 403,

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
     * Користувач авторизований
     */

    return context.next();

  }
  catch (error) {

    console.error(
      "Auth middleware error:",
      error
    );

    return new Response(
      "Authentication service unavailable",
      {
        status: 503,

        headers: {

          "Content-Type":
            "text/plain; charset=utf-8",

          "Cache-Control":
            "no-store"

        }

      }
    );

  }

}