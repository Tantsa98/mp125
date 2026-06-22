export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // ✅ читаємо body ОДИН раз
    const body = await request.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return new Response("Missing email", { status: 400 });
    }

    console.log("EMAIL:", email);

    // 🔐 перевірка доступу
    const allowed = await env.USERST.get(email);

    if (!allowed) {
      console.log("NOT ALLOWED:", email);
      return new Response("Not allowed", { status: 403 });
    }

    // 🛑 rate limit
    const lastKey = "last_" + email;
    const last = await env.CODEST.get(lastKey);

    if (last && Date.now() - parseInt(last) < 60000) {
      return new Response("Too many requests", { status: 429 });
    }

    await env.CODEST.put(lastKey, Date.now().toString(), {
      expirationTtl: 60
    });

    // 🔢 код
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await env.CODEST.put(email, code, {
      expirationTtl: 300
    });

    console.log("CODE:", code);

    // 📧 email
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "noreply@mail.125.co.ua",
        to: email,
        subject: "Код доступу",
        html: `
          <div style="font-family:sans-serif">
            <h2>Код входу</h2>
            <p>Твій код:</p>
            <h1>${code}</h1>
            <p>Дійсний 5 хвилин</p>
          </div>
        `
      })
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.log("Resend error:", err);
      return new Response("Email error", { status: 500 });
    }

    return new Response("OK");

  } catch (err) {
    console.log("ERROR:", err);
    return new Response("Server error", { status: 500 });
  }
}