export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, code } = await request.json();

    // 🔥 ВСТАВИТИ СЮДИ
    console.log("EMAIL RAW:", email);
    console.log("EMAIL LENGTH:", email.length);
    console.log("EMAIL CHARS:", [...email].map(c => c.charCodeAt(0)));

    if (!email || !code) {
      return new Response("Missing data", { status: 400 });
    }

    const saved = await env.CODES.get(email);

    // 🔥 І СЮДИ
    console.log("SAVED FROM KV:", saved);
    console.log("CODE FROM USER:", code);
    console.log("CODE LENGTH:", code.length);
    console.log("EQUAL:", saved === code);

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