export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email } = await request.json();

    if (!email) {
      return new Response("Email required", { status: 400 });
    }

    // 🔐 перевірка whitelist
    const allowed = await env.USERST.get(email);

    if (!allowed) {
      return new Response("Not allowed", { status: 403 });
    }

    // 🔢 генеруємо код
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // ⏱ зберігаємо на 5 хв
    await env.CODES.put(email, code, { expirationTtl: 300 });

    // 🧪 поки що просто в консоль
    console.log(`Login code for ${email}: ${code}`);
    
    console.log("ENV:", env);
    console.log("USERST:", env.USERST);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}