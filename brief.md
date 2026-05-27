# Brief — regeneracjafalownikow.pl

**Mode**: AUTONOMOUS
**Data**: 2026-05-27
**Status**: draft

---

## Cel biznesowy

Strona zapleczowa dla `inwert.pl` (klient Karola, serwis falowników). Buduje topical authority wokół fraz "naprawa falownika", "regeneracja falownika", "serwis przemienników częstotliwości" w polskim Google. Konwersja nieliczona, brak otwartych odnośników do inwert.pl — domeny pozostają jawnie rozdzielone (decyzja Karola). Strona stoi sama, sygnał SEO zostanie w razie potrzeby przeniesiony później.

## Audytorium

- **Typ**: B2B (utrzymanie ruchu w zakładach przemysłowych, automatycy, działy techniczne)
- **Region**: krajowy (PL)
- **Charakterystyka**: technik utrzymania ruchu / kierownik działu technicznego w fabryce, którego przemiennik częstotliwości właśnie wyrzucił błąd. Szuka szybko: kto naprawia, jak długo trwa, czy mają jego markę, czy wycena płatna.
- **Język**: PL

## USP

Regeneracja falowników wszystkich marek z naciskiem na linię Lenze (od ESMD przez i500 po 9300) — z testami pod obciążeniem na własnej hamowni i 12-miesięczną gwarancją na każdą naprawę.

## Sekcje strony

1. **Hero** — co + dla kogo + szczegół (Lenze, hamownia, gwarancja) + CTA "Wyślij falownik do wyceny"
2. **Co naprawiamy** — falowniki ogólnie + akcent Lenze (lista serii) + lista pozostałych marek
3. **Jak wygląda naprawa** — proces krok po kroku: przyjęcie → diagnoza → wycena → naprawa → testy → gwarancja
4. **Hamownia i testy** — czemu testujemy pod obciążeniem, co to daje klientowi
5. **Przeglądy okresowe** — prewencja: co robimy, czemu to ma sens
6. **FAQ** — koszty, czas, gwarancja, czy odbieramy z zakładu, co jeśli niemożliwa naprawa
7. **Kontakt** — formularz + telefon (placeholder) + adres (placeholder)
8. **Blog** — szkielet (`/blog`), bez wpisów na start

## Branding

- **Logo**: brak / typograficzne
- **Preset designu**: corporate (z elementami tech) — branża industrial / utrzymanie ruchu, target lubi zaufanie i konkret, nie efekt "wow"
- **Paleta**: neutral cool gray + accent industrial blue (`#0F4C81` light, `#3B82F6` dark)
- **Typografia**: Inter (sans, body + UI) + Source Serif 4 (nagłówki, lekki autorytet bez kwiecistości)
- **Ton**: rzeczowy ekspercki, partnerskie "Ty", krótkie zdania, brak korpomowy. Czytelnik to inżynier.

## Formularz kontaktowy

- **Wymagany**: tak
- **Pola**: imię/firma, e-mail, telefon, marka i model falownika, opis usterki, możliwość załączenia zdjęcia/PDF (max 5 MB)
- **Skrzynka docelowa**: `kontakt@regeneracjafalownikow.pl` (Karol zakłada na Aftermarket, forwarding na jego prywatny mailbox albo na inwert.pl)
- **MX provider**: aftermarket

## Treść

- **Źródło**: piszę od zera. Karol dostarczył opis usług od inwert.pl jako referencję faktów (marki, procedury, polityki gwarancji). Tekst MUSI być w pełni oryginalny — żadnej kopii fraz z inwert.pl, inaczej ten sam content pod dwoma domenami zabije SEO obu.
- **Materiały**: brak zdjęć — używam tylko ilustracji ikonowych / abstrakcyjnych. Żadnych stockowych „mężczyzna w kasku".

## SEO

- **Główne frazy**: "regeneracja falownika", "naprawa falownika", "serwis falowników Lenze", "naprawa przemiennika częstotliwości", "regeneracja falownika Lenze 9300", "wycena naprawy falownika"
- **Konkurencja**: inwert.pl (klient — celowo nie skanujemy bezpośrednio jego copy), serwisfalownikow.pl, energoelektronika.pl, lokalne serwisy regionalne

## Feature flags (siteConfig)

- [x] **ga4** → auto-provisioning przez Admin API (decyzja Karola)
- [x] **contactForm** → `true`
- [ ] **hasShop** → `false` (lead-gen, brak checkoutu)
- [x] **hasBlog** → `true` (Karol explicite poprosił o szkielet bloga, BEZ wpisów na start)

## Co claude założył (bo nie zapytał)

- **Brak linków wychodzących do inwert.pl** — Karol powiedział "na razie NIE LINKUJEMY". Zero anchor textów, zero stopek typu "część grupy X", zero JSON-LD `sameAs`.
- **Adres firmy, NIP, telefon** — nie znam. Zostawiam placeholdery (`ADMIN_NAME_PLACEHOLDER`, `NIP_PLACEHOLDER`) z notą w `LAUNCH-REPORT.md`. Stopka i `LocalBusiness` JSON-LD będą gotowe do podmiany jednym editem `site.ts`.
- **Brak realnych opinii klientów** — sekcja opinii pomijana (nie wymyślam cytatów).
- **Brak konkretnych zdjęć z warsztatu** — używam minimalnych ilustracji wektorowych / heroes generowanych jako CSS gradient + ikona. Zdjęcia jeśli Karol prześle później.
- **Preset corporate (nie craft / nie tech)** — target B2B utrzymania ruchu woli powściągliwe corporate. Industrial blue jako accent zamiast czerwonego (czerwone w industrial = error, źle czytelne).
- **Blog jako szkielet** — `/blog` z układem listy + szablon pojedynczego wpisu w `src/content/blog/*.md`, ale `src/content/blog/` puste. Karol później dorzuca wpisy.
- **Konfiguracja TLS / GA4 / SES** — domyślne wartości generatora.

## Co świadomie pominięto

- Sekcja "opinie klientów" — brak materiału, nie generuję
- Sekcja "realizacje / case studies" — brak materiału
- Zdjęcia warsztatu / sprzętu — brak materiału
- Sklep / regulamin — lead-gen, nie potrzeba

## Materiały do uzupełnienia przez Karola po launch

- [ ] Pełna nazwa firmy + adres + NIP do `src/config/site.ts` `legal.*` (lub potwierdzenie że strona zapleczowa ma zostać bez tych danych — wtedy pomijamy `LocalBusiness` JSON-LD)
- [ ] Numer telefonu kontaktowego (lub potwierdzenie, że tylko mail)
- [ ] Zdjęcia warsztatu / hamowni — jeśli będą, podmieniam ilustracje
- [ ] Opinie klientów z RODO (3-5 sztuk) — wtedy aktywuję sekcję
- [ ] Pierwsze wpisy bloga (najlepiej 3-5 razy w roku, długie poradnikowe — pod long-tail frazy z "naprawa falownika [marka] [model] błąd [kod]")
