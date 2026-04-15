export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return new Response("Missing data", { status: 400 });
    }

    const saved = await env.CODEST.get(email);

    if (!saved || saved !== code) {
      return new Response("Invalid code", { status: 401 });
    }

    const token = btoa(email + ":" + Date.now());

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
      }
    });

  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}