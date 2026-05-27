# LAUNCH REPORT — regeneracjafalownikow.pl

**Data**: 2026-05-27
**Tryb**: AUTONOMOUS
**Wynik**: live, działa

---

## ⚠ Karol — uzupełnij to po przeczytaniu

Strona idzie live z placeholderami w sekcji prawnej. **Nic na stronie ich nie wyświetla**
(stopka ukrywa dane gdy `adminName` zaczyna się od `ADMIN_NAME_PLACEHOLDER`), więc to nie świeci użytkownikom.
Ale `/polityka-prywatnosci` zawiera teksty `ADMIN_NAME_PLACEHOLDER`, `ADMIN_ADDRESS_PLACEHOLDER`,
`NIP_PLACEHOLDER` — RODO wymaga prawdziwych danych administratora.

**Wybierz jedno**:

1. **Strona pozostaje zapleczowa, bez ujawniania firmy** → usuń linki do `/polityka-prywatnosci`
   ze stopki i CookieConsent (i wyłącz GA4: `ga4: null` w `src/config/site.ts`, bo wtedy
   nie potrzebujesz polityki). To najczystsze podejście dla satelity.
2. **Zostaje firma jawna** → wpisz prawdziwe dane do `src/config/site.ts`:
   ```ts
   legal: {
     adminName: "Pełna nazwa firmy / Jan Kowalski",
     adminAddress: "ul. Przykładowa 1, 00-000 Miasto",
     adminNip: "1234567890",
     adminEmail: "kontakt@regeneracjafalownikow.pl",
   },
   ```
   i `./deploy.sh`. Stopka automatycznie pokaże nazwę / NIP / adres,
   polityka prywatności podmieni placeholdery.

**Skrzynka kontakt@regeneracjafalownikow.pl** — MX wskazuje na `mx1.aftermarket.pl`.
Musisz **założyć tę skrzynkę na panelu Aftermarket** dla domeny (Aftermarket → Twoje domeny →
regeneracjafalownikow.pl → Poczta) z forwardem na Twój prywatny adres. Bez tego maile
z formularza nie dotrą.

---

## ✅ Zweryfikowano

- **DNS**: NS wskazują na AWS Route53 (`Z09031913EEOBH8KP22GQ`). MX na Aftermarket forwarding.
- **TLS**: ACM cert `*.regeneracjafalownikow.pl` w `us-east-1`, ważny dla `www.` + naked.
- **CloudFront**:
  - `www.regeneracjafalownikow.pl` → `E81NQ2HIXMF3Y` (`d2b4kbvcyuulwo.cloudfront.net`) → S3 `www.regeneracjafalownikow.pl`
  - `regeneracjafalownikow.pl` → `E43G873EFZ9UK` → S3 redirect bucket → 301 → `https://www.regeneracjafalownikow.pl/`
- **Redirect naked → www**: zwraca `301 Moved Permanently`, `Location: https://www.regeneracjafalownikow.pl/` ✓
- **HTTPS enforce**: HTTP redirect-to-HTTPS na obu dystrybucjach.
- **HTTP/3**: `Alt-Svc: h3=":443"; ma=86400` w odpowiedziach.
- **Sitemap**: `https://www.regeneracjafalownikow.pl/sitemap-index.xml` → 200 OK.
- **Robots**: `https://www.regeneracjafalownikow.pl/robots.txt` → 200 OK, Sitemap wskazany.
- **Pages**: `/`, `/blog/`, `/polityka-prywatnosci/`, `/404` — wszystkie 200/404.
- **GA4**: property `properties/539254706` (display "regeneracjafalownikow.pl") + Web stream `G-JTRKMX9728`. Consent Mode v2 default-on, banner się renderuje.
- **Contact form**:
  - Lambda `regfal-contact` (`arn:aws:lambda:eu-central-1:381492300277:function:regfal-contact`)
  - API GW `https://s2z0kjp2o4.execute-api.eu-central-1.amazonaws.com/contact`
  - CORS preflight OPTIONS → 204 z poprawnymi nagłówkami dla `https://www.regeneracjafalownikow.pl`
  - SES domain status: **Success** (DKIM + verification)
  - SES production access: **enabled**
  - Honeypot pole `company` w formularzu, pomijane przez Lambdę
  - From: `Regeneracja Falowników <formularz@regeneracjafalownikow.pl>`, Reply-To: nadawca
- **Repo**: https://github.com/LeszczynskiKarol/regeneracjafalownikow-pl (public)
- **Deploy**: GitHub Actions OIDC, role `gh-deploy-regeneracjafalownikow-pl`, `main` → S3 sync + CF invalidation. Drugi push poszedł zielony (commit `8bc6f69`).
- **Lighthouse / PageSpeed Insights** (https://www.regeneracjafalownikow.pl/):
  - Mobile: perf **87**, a11y **97**, best-practices **100**, SEO **100**
  - Desktop: perf **98**, a11y **97**, best-practices **100**, SEO **100**
  - Cel z CLAUDE.md to mobile ≥90 — mobile 87 to mała różnica (LCP fonty z Google CDN). Nie blokuje launchu, ale można podbić: self-host woff2 lub przejść na font-display variable.

## 🧱 Architektura strony (krótko)

- **Stack**: Astro 5 + Tailwind 4 (via `@tailwindcss/vite`), static build, TypeScript strict.
- **Preset designu**: corporate (industrial), accent `#0F4C81` (industrial blue), neutralne slate. Dark mode dostępny w toggle nav.
- **Typografia**: Inter (sans, body) + Source Serif 4 (nagłówki).
- **Sekcje strony głównej**: hero / co naprawiamy (Lenze + 28 marek) / proces (6 kroków) / hamownia / przeglądy okresowe / dlaczego my (4 punkty) / FAQ (8 pytań) / kontakt z formularzem.
- **Blog**: aktywna trasa `/blog`, content collection `src/content/blog/`, schemat `pubDate`/`description`/`tags`/`draft`. Na start zero wpisów — strona pokazuje placeholder "Wkrótce pierwszy wpis".
- **JSON-LD**: `WebSite` + `Service` + `FAQPage` na stronie głównej, `BlogPosting` w szablonie wpisu.
- **Konfiguracja**: `src/config/site.ts` — jedno źródło prawdy dla nazwy/URL/legal/flag.

## 📂 Co zostało w repo

```
brief.md            — decyzje Mode B + co Claude założył sam
design.md           — preset, palette, typografia, motion
LAUNCH-REPORT.md    — ten plik
src/                — Astro source
aws-lambdas/        — kod Lambdy contact-form (deployowany ręcznie przez setup-contact-form.sh)
.github/workflows/  — deploy.yml (OIDC)
.env.deploy         — gitignored, lokalne ARN-y i ID dystrybucji
```

## 🛠️ Co nie zostało zrobione (świadomie)

- **Sekcja "opinie klientów"** — brak materiału, nie zmyślam.
- **Sekcja "realizacje / case studies"** — brak materiału.
- **Zdjęcia warsztatu / hamowni** — używam ilustracji SVG (stylizowany falownik w hero).
- **OG image (`/og-image.jpg`)** — szablon BaseLayout wskazuje na `/og-image.jpg`, ale plik nie został wygenerowany. Social shares pokażą placeholder. Można dorobić `scripts/generate-og-and-touch.mjs` z brand text + logo SVG.
- **Linki wychodzące do inwert.pl** — zero. Karol explicite tak chciał ("na razie NIE LINKUJEMY").
- **Wpisy blogowe** — szkielet z poziomu kodu jest, ale `src/content/blog/` jest pusty. Karol dorzuca artykuły później jako `*.md` z frontmatterem.
- **Telefon kontaktowy** — `siteConfig.contact.phone` = `null`. Po wpisaniu numeru pojawia się automatycznie w sekcji kontakt + stopka.
- **`heartbeat` Lambda / monitoring** — pominięte (strona zapleczowa, nie krytyczna).
- **`/regulamin`** — usunięte z repo (`hasShop: false`).

## 🔧 Tech debt do rozważenia

- Mobile PSI 87 → 90+. Najszybsza poprawa: self-host Inter + Source Serif 4 jako woff2 z `font-display: swap` zamiast Google Fonts CDN (oszczędza 1 hop + connection).
- Brak `heartbeat` Lambdy → nie zauważymy jeśli formularz padnie. Można dorzucić.
- Brak rate-limit na `/contact` → honeypot wystarczy na początek, ale jeśli spam wzrośnie, dodać DynamoDB counter (per IP, max 5/h).

## 📞 Kontrolne polecenia

```powershell
# Lokalny dev
cd D:\regeneracjafalownikow.pl
$env:PUBLIC_API_BASE_URL = "https://s2z0kjp2o4.execute-api.eu-central-1.amazonaws.com"
npm run dev   # http://localhost:4321

# Deploy lokalny (jeśli kiedyś chcesz pominąć Actions)
./deploy.sh "fix: copy"

# Tail logs Lambdy
aws logs tail "/aws/lambda/regfal-contact" --since 1h --region eu-central-1

# Stan SES
aws ses get-identity-verification-attributes --identities regeneracjafalownikow.pl --region us-east-1
```
