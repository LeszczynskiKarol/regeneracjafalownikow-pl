// Lambda: regeneracjafalownikow-contact
// Formularz kontaktowy → SES → kontakt@regeneracjafalownikow.pl (forwarding Aftermarket)

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const SES_REGION = "us-east-1";
const ses = new SESClient({ region: SES_REGION });

const DOMAIN = process.env.DOMAIN || "regeneracjafalownikow.pl";
const TO_EMAIL = process.env.TO_EMAIL || `kontakt@${DOMAIN}`;
const FROM_EMAIL = process.env.FROM_EMAIL || `formularz@${DOMAIN}`;
const FROM_NAME = process.env.FROM_NAME || "Regeneracja Falowników";

const ALLOWED_ORIGINS = [
  `https://www.${DOMAIN}`,
  `https://${DOMAIN}`,
  "http://localhost:4321",
];

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : `https://www.${DOMAIN}`;
  const headers = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, email, phone, model, message, urgent, company, rodo } = body;

    // Honeypot — pole `company` jest ukryte w HTML; legalni użytkownicy zostawiają puste.
    if (company) {
      console.warn("Honeypot tripped, dropping silently");
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Brak wymaganych pól (imię/firma, e-mail, opis usterki)" }),
      };
    }
    if (!rodo) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Wymagana zgoda na przetwarzanie danych" }),
      };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Nieprawidłowy adres e-mail" }),
      };
    }

    const isUrgent = !!urgent;
    const subjectPrefix = isUrgent ? "[EKSPRES] " : "";
    const dateStr = new Date().toLocaleString("pl-PL", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

    const htmlBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f1f5f9;color:#0f172a">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px">
    <div style="border-left:4px solid #0f4c81;padding:8px 16px;margin-bottom:24px">
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#475569">Formularz · ${escapeHtml(DOMAIN)}</p>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:#0f172a">
        ${isUrgent ? "🔴 Awaria — tryb ekspres" : "Nowe zapytanie o naprawę"}
      </h1>
      <p style="margin:4px 0 0;font-size:12px;color:#94a3b8">${dateStr}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden">
      <tr><td style="padding:12px 16px;font-weight:600;width:160px;border-bottom:1px solid #e2e8f0">Imię / firma</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:12px 16px;font-weight:600;border-bottom:1px solid #e2e8f0">E-mail</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0"><a href="mailto:${escapeHtml(email)}" style="color:#0f4c81">${escapeHtml(email)}</a></td></tr>
      ${phone ? `<tr><td style="padding:12px 16px;font-weight:600;border-bottom:1px solid #e2e8f0">Telefon</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0"><a href="tel:${escapeHtml(phone.replace(/\s/g, ""))}" style="color:#0f4c81">${escapeHtml(phone)}</a></td></tr>` : ""}
      ${model ? `<tr><td style="padding:12px 16px;font-weight:600;border-bottom:1px solid #e2e8f0">Falownik</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0"><code style="font-family:Consolas,monospace;background:#f1f5f9;padding:2px 6px;border-radius:3px">${escapeHtml(model)}</code></td></tr>` : ""}
      <tr><td style="padding:12px 16px;font-weight:600;vertical-align:top">Opis usterki</td>
          <td style="padding:12px 16px;line-height:1.6">${escapeHtml(message).replace(/\n/g, "<br>")}</td></tr>
    </table>

    <div style="text-align:center;margin:28px 0">
      <a href="mailto:${escapeHtml(email)}?subject=Re%3A%20${encodeURIComponent("Wycena naprawy falownika " + (model || ""))}"
         style="display:inline-block;padding:12px 28px;background:#0f4c81;color:#ffffff;text-decoration:none;font-size:14px;border-radius:6px;font-weight:500">
        Odpowiedz nadawcy →
      </a>
    </div>

    <p style="font-size:11px;color:#94a3b8;text-align:center;text-transform:uppercase;letter-spacing:0.06em">
      Wiadomość wygenerowana automatycznie z formularza ${escapeHtml(DOMAIN)}
    </p>
  </div>
</body></html>`;

    const command = new SendEmailCommand({
      Source: `${FROM_NAME} <${FROM_EMAIL}>`,
      Destination: { ToAddresses: [TO_EMAIL] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: `${subjectPrefix}Wycena naprawy — ${name}${model ? ` · ${model}` : ""}`, Charset: "UTF-8" },
        Body: { Html: { Data: htmlBody, Charset: "UTF-8" } },
      },
    });

    const sesResult = await ses.send(command);
    console.log("SES OK", sesResult.MessageId, "→", TO_EMAIL);

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error("Contact form error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Błąd wysyłki" }) };
  }
};
