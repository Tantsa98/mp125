import { CONFIG } from "../../config/login-config.js";

import {
  deleteSession,
  createExpiredAuthCookie
} from "../_lib/auth.js";


export async function onRequestPost(context) {

  const {
    request,
    env
  } = context;

  try {

    /*
     * Видаляємо серверну сесію
     */

    await deleteSession(
      request,
      env,
      CONFIG
    );

  }
  catch (error) {

    console.error(
      "Logout session delete error:",
      error
    );

  }


  /*
   * Cookie видаляємо завжди
   */

  return new Response(
    "OK",
    {
      status: 200,

      headers: {

        "Content-Type":
          "text/plain; charset=utf-8",

        "Cache-Control":
          "no-store",

        "Set-Cookie":
          createExpiredAuthCookie()

      }

    }
  );

}