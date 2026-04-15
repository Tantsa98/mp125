export async function onRequest(context) {
  return new Response("OK", {
    headers: {
      "Set-Cookie": "auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
    }
  });
}