export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return new Response("Missing data", { status: 400 });
    }

    const savedCode = await env.CODES.get(email);

    if (!savedCode || savedCode !== code) {
      return new Response("Invalid code", { status: 401 });
    }

    // 🔐 простий токен (потім замінимо на JWT)
    const token = btoa(email + ":" + Date.now());

    return new Response(JSON.stringify({ token }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}