# Design system — regeneracjafalownikow.pl

**Preset**: corporate (z elementami tech)
**Mood**: rzeczowy, inżynierski, zaufanie bez kwiecistości. Strona ma wyglądać jak portal serwisowy zakładu utrzymania ruchu, nie agencja marketingowa.

## Typografia

- **Sans**: Inter (400, 500, 700) — body, UI, nawigacja
- **Serif**: Source Serif 4 (400, 600) — nagłówki H1/H2, subtelny autorytet
- **Skala**: 1.250 (major third)
- **Base**: 17px desktop / 16px mobile
- **Line height**: 1.7 body, 1.2 nagłówki

## Paleta — light

- `--color-bg` `#F8FAFC` — cool slate-50, bardzo jasne tło
- `--color-bg-elevated` `#FFFFFF`
- `--color-bg-subtle` `#F1F5F9` — sekcje wyróżnione, karty
- `--color-text` `#0F172A` — slate-900
- `--color-text-muted` `#475569` — slate-600
- `--color-text-faint` `#94A3B8` — slate-400
- `--color-border` `#E2E8F0` — slate-200
- `--color-accent` `#0F4C81` — industrial blue (głębszy niż electric blue, bardziej "trust")
- `--color-accent-hover` `#0B3A66`
- `--color-accent-fg` `#FFFFFF`

## Paleta — dark

- `--color-bg` `#0B1220` — głęboki, prawie navy
- `--color-bg-elevated` `#0F172A` — slate-900
- `--color-bg-subtle` `#1E293B` — slate-800
- `--color-text` `#F1F5F9` — slate-100
- `--color-text-muted` `#94A3B8` — slate-400
- `--color-text-faint` `#64748B` — slate-500
- `--color-border` `#1E293B`
- `--color-accent` `#3B82F6` — blue-500, czytelniejszy na dark
- `--color-accent-hover` `#60A5FA`
- `--color-accent-fg` `#0B1220`

## Komponenty kluczowe

- **Hero**: lewy kolumn tekst (H1 serif + lead sans + CTA primary + CTA secondary), prawa kolumna abstrakcyjna grafika wektorowa (płytka PCB lub schemat napięć) jako SVG inline. Bez stockowych zdjęć.
- **CTA primary**: `bg-accent`, biały tekst, rounded-md (6px), padding `px-6 py-3`, hover = ciemniejsze tło.
- **CTA secondary**: outline border + text-accent, hover = subtle background.
- **Karta usługi / marki**: `bg-bg-elevated` + border subtle, padding `p-6`, hover = border-accent. Brak `box-shadow`, brak `scale()`.
- **Sekcja list marek**: chip grid (3-4 kolumny desktop, 2 mobile), monospace dla numerów serii Lenze.
- **Proces krok-po-kroku**: pionowa lista z numeracją po lewej (cyfra w okręgu accent), tekst po prawej. Brak ikon dekoracyjnych.
- **FAQ**: native `<details>` z chevron rotującym 90° po otwarciu, border-top między pytaniami.
- **Formularz**: input ma `bg-bg-elevated`, border `1px var(--color-border)`, focus = ring 2px `var(--color-accent)`. Label nad polem. Placeholder szary `text-faint`.

## Motion

- Fade-in-up 600ms ease-out na sekcjach przez IntersectionObserver (już w BaseLayout)
- Hover: opacity 0.85 na linkach inline, transition 200ms
- `prefers-reduced-motion: reduce` wyłącza wszystko (już w global.css)
- Bez parallax, bez gradient mesh, bez animowanego tła

## Layout

- Container: max-width 1200px (`max-w-6xl` w Tailwind)
- Padding sekcji: `py-20 lg:py-28`
- Padding poziomy: `px-4 sm:px-6 lg:px-8`
- Grid 2-kolumnowy hero: `lg:grid-cols-2 lg:gap-12`

## Dark/light toggle

- W prawym górnym rogu nav, ikona sun/moon (SVG, `ThemeToggle.astro` z templatu)
- Default = system preference, override w `localStorage` pod kluczem `theme`
- Init script `is:inline` (już jest w `BaseLayout.astro`)

## Inspirations (mentalne, nie kopiujemy)

- siemens.com (industrial corporate, sporo whitespace)
- vacon.com (legacy — clean, technical)
- typowy układ portali utrzymania ruchu z PIAP

## Co celowo pomijam

- Parallax
- Hero ze zdjęciem stockowym
- Animacje typowe SaaS (Lottie, framer-motion)
- Gradient mesh / glassmorphism — nie pasuje do industrial
- Czerwony akcent (w branży = error / alarm, źle czytelne dla CTA)
- Trzecia rodzina fontów (mono nie potrzebne poza chipami serii)
