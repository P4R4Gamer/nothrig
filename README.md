# Nothrig — Website

Website der Streetwear-Marke **Nothrig**. Statische Multi-Page-Site, gebaut mit
[Eleventy](https://www.11ty.dev/). Jede Section der Seite ist eine eigene Datei
und wird per Include zusammengesetzt — dadurch bearbeitet man Kopf, Footer, Hero
usw. jeweils an **einer** Stelle.

Diese Doku richtet sich an alle, die am Projekt mitarbeiten. Sie erklärt Setup,
lokalen Server, Aufbau und die üblichen Änderungen.

---

## Inhalt

1. [Was ist das / Tech-Stack](#1-was-ist-das--tech-stack)
2. [Voraussetzungen](#2-voraussetzungen)
3. [Projekt holen & einrichten](#3-projekt-holen--einrichten)
4. [Lokalen Server starten (localhost)](#4-lokalen-server-starten-localhost)
5. [Build & Deployment](#5-build--deployment)
6. [Projektstruktur](#6-projektstruktur)
7. [Inhalte bearbeiten](#7-inhalte-bearbeiten)
8. [Produkte & Shop pflegen](#8-produkte--shop-pflegen)
9. [Drop-Termin / Countdown ändern](#9-drop-termin--countdown-ändern)
10. [Design: Farben, Schriften, Logo](#10-design-farben-schriften-logo)
11. [JavaScript-Überblick](#11-javascript-überblick)
12. [Warenkorb & Checkout](#12-warenkorb--checkout)
13. [Git-Workflow](#13-git-workflow)
14. [Offene Punkte / TODO](#14-offene-punkte--todo)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Was ist das / Tech-Stack

- **Eleventy (11ty) 3.x** — Static Site Generator. Baut aus Templates in `src/`
  fertiges HTML nach `_site/`.
- **Nunjucks** (`.njk`) — Template-Sprache für Layouts und Includes.
- **Vanilla JavaScript** — keine Frameworks. Shop, Warenkorb und Countdown laufen
  clientseitig im Browser.
- **Plain CSS** — ein Stylesheet, Design-Tokens als CSS-Variablen.
- **Kein Backend.** Der Checkout ist eine Demo (siehe [Abschnitt 12](#12-warenkorb--checkout)).

Warum Eleventy: Header, Footer und jede Section sind einzelne Dateien. Ändert man
`src/_includes/sections/footer.njk`, ändert sich der Footer auf allen Seiten.

---

## 2. Voraussetzungen

| Tool | Version | Prüfen mit |
|------|---------|-----------|
| [Node.js](https://nodejs.org/) | 18 oder neuer (getestet mit 22) | `node -v` |
| npm | kommt mit Node | `npm -v` |
| [Git](https://git-scm.com/) | beliebig aktuell | `git --version` |

Ein Editor mit Terminal (z. B. VS Code) reicht. Kein weiteres globales Tooling
nötig — Eleventy wird lokal im Projekt installiert.

---

## 3. Projekt holen & einrichten

```bash
git clone <REPO-URL> nothrig
cd nothrig
npm install
```

`npm install` lädt Eleventy und Abhängigkeiten nach `node_modules/` (ist in
`.gitignore`, wird also nicht mit eingecheckt).

### ⚠️ Windows / PowerShell: „Ausführung von Skripts ist deaktiviert“

Schlägt `npm install` oder `npm start` im **VS-Code-PowerShell-Terminal** mit
einer Meldung wie *„npm.ps1 kann nicht geladen werden, da die Ausführung von
Skripts auf diesem System deaktiviert ist“* fehl, einmalig ausführen:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Kein Admin nötig. Danach funktioniert `npm` normal.

**Alternativen ohne Policy-Änderung:**

- `npm.cmd install` / `npm.cmd start` (die `.cmd`-Variante ist kein PS-Skript)
- VS Code: Terminal → Dropdown `▾` → *Standardprofil auswählen* → *Command Prompt*

---

## 4. Lokalen Server starten (localhost)

```bash
npm start
```

- Startet den Eleventy-Dev-Server auf **http://localhost:8080**
- **Live-Reload:** Änderungen an `.njk`, CSS oder JS aktualisieren den Browser
  automatisch.
- Beenden mit `Strg + C`.

**Ohne npm** (falls nötig, z. B. wegen PowerShell-Policy):

```bash
npx @11ty/eleventy --serve
# oder direkt:
./node_modules/.bin/eleventy --serve      # Windows: .\node_modules\.bin\eleventy.cmd --serve
```

Anderer Port:

```bash
npx @11ty/eleventy --serve --port=3000
```

---

## 5. Build & Deployment

Fertiges HTML erzeugen:

```bash
npm run build
```

Ergebnis landet in `_site/`. Das ist eine komplett statische Seite — kann auf
jedes Static-Hosting.

### Hosting einrichten (Netlify / Cloudflare Pages / GitHub Pages)

| Einstellung | Wert |
|-------------|------|
| Build command | `npm run build` |
| Publish / Output directory | `_site` |
| Node-Version | 18+ (z. B. Env-Var `NODE_VERSION=22`) |

`_site/` wird **nicht** ins Git eingecheckt — der Host baut selbst.

---

## 6. Projektstruktur

```
nothrig/
├── .eleventy.js            Eleventy-Konfiguration (Input/Output, Passthrough)
├── .gitignore              node_modules/ und _site/ ausschließen
├── .nvmrc                  empfohlene Node-Version
├── package.json            Scripts + Abhängigkeiten
├── README.md               diese Doku
│
├── src/                    ← hier wird gearbeitet
│   ├── src.11tydata.json   setzt das Standard-Layout für alle Seiten
│   │
│   ├── _data/
│   │   └── build.js        Build-Zeit-Werte, z. B. {{ build.year }}
│   │
│   ├── _includes/
│   │   ├── layout.njk      HTML-Grundgerüst: <head>, <main>, Script-Tags
│   │   └── sections/       einzelne Seitenbausteine (siehe unten)
│   │       ├── header.njk        Ankündigungsleiste + Navigation
│   │       ├── footer.njk        Footer mit allen Link-Spalten
│   │       ├── page-intro.njk    wiederverwendbarer Seitenkopf
│   │       ├── hero.njk          Startseite: Hero + Countdown
│   │       ├── marke.njk         Startseite: Style-Statement + „Pillars“
│   │       ├── drop-teaser.njk   Startseite: Teaser auf aktuellen Drop
│   │       ├── featured.njk      Startseite: „Neu im Shop“
│   │       ├── newsletter.njk    Newsletter-Anmeldung
│   │       ├── drop-002.njk      Drops-Seite: kommender Drop (mit Countdown)
│   │       ├── drop-001.njk      Drops-Seite: aktueller Drop
│   │       └── drop-archive.njk  Drops-Seite: Archiv / Herkunft
│   │
│   ├── index.njk           Startseite  → /
│   ├── drops.njk           Drop-Infos  → /drops/
│   ├── shop.njk            Shop-Übersicht → /shop/
│   ├── product.njk         Produktdetail → /product/?id=…
│   ├── cart.njk            Warenkorb + Checkout → /cart/
│   │
│   ├── css/
│   │   └── style.css       komplettes Stylesheet (Design-Tokens ganz oben)
│   ├── js/
│   │   ├── products.js     Produktdaten + nächster Drop-Termin
│   │   ├── cart.js         Warenkorb-Logik (localStorage)
│   │   ├── site.js         Verhalten: Mobile-Nav, Countdown, Zähler, Newsletter
│   │   └── pages.js        Rendering: Shop-Grid, Produktdetail, Warenkorb
│   └── assets/
│       └── favicon.svg
│
├── node_modules/           (generiert, nicht im Git)
└── _site/                  (Build-Output, nicht im Git)
```

### Wie eine Seite zusammengesetzt wird

1. `src/index.njk` enthält im Kopf (Front Matter) Titel/Beschreibung und danach
   nur eine Liste von Includes:

   ```njk
   ---
   navId: home
   title: "Nothrig — Streetwear · Oversize · Heavy Clothing"
   description: "…"
   ---
   {% include "sections/hero.njk" %}
   {% include "sections/marke.njk" %}
   {% include "sections/drop-teaser.njk" %}
   {% include "sections/featured.njk" %}
   {% include "sections/newsletter.njk" %}
   ```

2. Eleventy steckt dieses Ergebnis in `src/_includes/layout.njk` (dort ist
   `<head>` und `<main>`).
3. `layout.njk` bindet zusätzlich `header.njk` und `footer.njk` ein.
4. Fertiges HTML → `_site/index.html`.

---

## 7. Inhalte bearbeiten

### Eine bestehende Section ändern

Datei in `src/_includes/sections/` öffnen, HTML anpassen, speichern. Der
Dev-Server lädt neu. Die Änderung wirkt auf **jeder** Seite, die die Section
einbindet.

### Reihenfolge der Sections ändern

In der Seiten-Datei (`src/index.njk`, `src/drops.njk`, …) die Reihenfolge der
`{% include %}`-Zeilen tauschen.

### Neue Section anlegen

1. `src/_includes/sections/meine-section.njk` erstellen — reines HTML, nutze die
   vorhandenen CSS-Klassen (`.section`, `.wrap`, `.eyebrow`, `.btn`, `.grid` …).
2. In der gewünschten Seite einbinden:
   `{% include "sections/meine-section.njk" %}`

### Seitenkopf `page-intro` verwenden

Wird von `drops.njk` und `shop.njk` genutzt. Im Front Matter der Seite:

```yaml
intro:
  eyebrow: "Kleiner Obertitel in Großbuchstaben"
  title: "Große Überschrift"
  text: "Optionaler Fließtext darunter."
```

danach `{% include "sections/page-intro.njk" %}`.

### Navigation / Footer

- **Menüpunkte:** `src/_includes/sections/header.njk`
- **Footer-Spalten & Links:** `src/_includes/sections/footer.njk`
- Der aktive Menüpunkt wird über `navId` im Front Matter der Seite gesetzt
  (`home`, `drops`, `shop`, `cart`).

### Ankündigungsleiste (schwarzer Balken oben)

Text in `src/_includes/sections/header.njk`, erste Zeile (`<div class="announce">`).

### Neue Seite anlegen

1. `src/kontakt.njk` erstellen:

   ```njk
   ---
   navId: kontakt
   title: "Kontakt — Nothrig"
   description: "…"
   ---
   <section class="section"><div class="wrap">
     <h1>Kontakt</h1>
     …
   </div></section>
   ```

2. Optional Menüpunkt in `header.njk` ergänzen.
3. Seite ist dann unter `/kontakt/` erreichbar.

---

## 8. Produkte & Shop pflegen

Alle Produkte stehen in **`src/js/products.js`** im Array `NOTHRIG_PRODUCTS`.
Kein Build nötig für JS — Datei speichern reicht.

Ein Produkt-Eintrag:

```js
{
  id: "boxy-tee-bone",          // eindeutig, nur a–z/0–9/Bindestrich; steht in der URL
  name: "Boxy Tee — Bone White",
  category: "T-Shirts",         // Anzeigename der Kategorie
  cat: "t-shirts",              // Filter-Schlüssel (Kleinbuchstaben)
  price: 45,                    // Zahl in Euro
  badge: "Neu",                 // kleines Label auf der Kachel, oder null
  mark: "NTK",                  // handschriftliches Kürzel auf der Platzhalter-Kachel
  sizes: ["S", "M", "L", "XL", "XXL"],
  soldOut: false,               // true → nicht bestellbar, „Sold out“-Overlay
  drop: "Drop 001",             // reiner Infotext
  short: "Kurzbeschreibung auf der Produktseite.",
  details: {                    // Tabelle unten auf der Produktseite
    "Material": "100% Baumwolle, 240 g/m²",
    "Passform": "Oversize / boxy"
  }
}
```

- **Produkt hinzufügen:** neuen Block ins Array. Die ersten 4 Einträge erscheinen
  automatisch als „Neu im Shop“ auf der Startseite.
- **Kategorie-Filter** im Shop entsteht automatisch aus den `cat`-Werten.
- **Produktbilder:** aktuell farbige Kacheln mit dem `mark`-Kürzel (Platzhalter,
  wie in den Vorlagen). Echte Fotos später als `<img>` — Rendering-Stellen in
  `src/js/pages.js` (`cardHTML`, Produktdetail-Block, `lineHTML`).

---

## 9. Drop-Termin / Countdown ändern

In **`src/js/products.js`** ganz unten:

```js
window.NOTHRIG_NEXT_DROP = {
  label: "Drop 002",
  season: "Herbst / Winter 2026",
  date: new Date(2026, 8, 19, 18, 0, 0) // Jahr, Monat (0-basiert!), Tag, Std, Min
};
```

**Monat ist 0-basiert:** `0` = Januar, `8` = September. Beispiel oben =
19.09.2026, 18:00 Uhr (lokale Zeit).

Der Countdown erscheint überall, wo `<div class="countdown" data-countdown></div>`
steht (Hero + `drop-002.njk`). Läuft die Zeit ab, zeigt er automatisch „LIVE“.

---

## 10. Design: Farben, Schriften, Logo

### Farben & Abstände

Ganz oben in **`src/css/style.css`** unter `:root`:

```css
--bg:       #f6f3ec;   /* Hintergrund (bone / off-white) */
--bg-alt:   #ece7dc;    /* wärmeres Sand-Panel */
--bg-dark:  #16150f;    /* dunkle Akzentflächen (Footer, Newsletter) */
--ink:      #17150f;    /* Textfarbe */
--sand:     #c7bca3;    /* Produktkacheln / Taupe */
```

Die Seite ist bewusst hell gehalten; dunkle Flächen nur als Akzent.

### Schriften (Google Fonts, in `layout.njk` eingebunden)

- **Inter** — Fließtext, Überschriften, Buttons
- **Caveat** — Logo-Schriftzug „Nothrig“ (fließende Signatur, Richtung Stüssy)
- **Permanent Marker** — kleines „NTK“-Kürzel und handschriftliche Akzente

### Logo

Aktuell ein Text-Element mit der Klasse `.logo` (Font Caveat, leicht schräg).
Vorkommen: `header.njk`, `footer.njk`, `hero.njk`, `newsletter.njk`.
**Noch nicht final** — sobald ein echtes SVG-Logo vorliegt, ersetzt es diese
Text-Elemente. Bis dahin lässt sich der Look über `.logo` in `style.css`
justieren (Font, `transform: rotate()/skewX()`, Größe).

---

## 11. JavaScript-Überblick

Alle Dateien in `src/js/`, werden in `layout.njk` in dieser Reihenfolge geladen:

| Datei | Aufgabe | Wichtige Stellschrauben |
|-------|---------|-------------------------|
| `products.js` | Produktliste + Drop-Termin | `NOTHRIG_PRODUCTS`, `NOTHRIG_NEXT_DROP` |
| `cart.js` | Warenkorb-Logik, `localStorage` | `FREE_SHIPPING_FROM` (Gratisversand-Grenze), `SHIPPING_FLAT` (Versandkosten) |
| `site.js` | Mobile-Nav, Warenkorb-Zähler, Countdown, Newsletter-Formular | Countdown-Beschriftungen, Newsletter-Meldungstexte |
| `pages.js` | Rendert Shop-Grid, Produktdetail, Warenkorb + Checkout | Card-/PDP-/Zeilen-HTML, Checkout-Felder |

Kein Build-Schritt für JS — die Dateien werden 1:1 nach `_site/js/` kopiert.

---

## 12. Warenkorb & Checkout

- Der Warenkorb liegt im **`localStorage`** des Browsers (Schlüssel
  `nothrig_cart_v1`). Er überlebt Seitenwechsel und Reload, ist aber pro Browser
  / Gerät.
- **Gratisversand ab 80 €**, sonst 4,90 € — anpassbar in `src/js/cart.js`
  (`FREE_SHIPPING_FROM`, `SHIPPING_FLAT`).
- Der Checkout ist ein **Formular ohne echte Verarbeitung**: „Jetzt kaufen“
  zeigt eine Bestätigung mit Fake-Bestellnummer und leert den Warenkorb. Es wird
  **nichts** gesendet, keine Zahlung, keine E-Mail.
- Für einen echten Shop später anzubinden: Shopify (Buy Button / Storefront API),
  Stripe Checkout oder Snipcart. Die Produkt-IDs aus `products.js` lassen sich
  dafür weiterverwenden.

---

## 13. Git-Workflow

### Repo das erste Mal anlegen und hochladen

```bash
cd nothrig
git init
git add .
git commit -m "Initiale Nothrig-Website (Eleventy)"
git branch -M main
git remote add origin <REPO-URL>
git push -u origin main
```

`.gitignore` sorgt dafür, dass `node_modules/` und `_site/` draußen bleiben.

### Normal mitarbeiten

```bash
git pull                      # neuesten Stand holen
git checkout -b feature/xyz    # eigener Branch für eine Änderung
# … arbeiten, npm start zum Prüfen …
git add .
git commit -m "Kurz was geändert wurde"
git push -u origin feature/xyz
# dann Pull Request / Merge auf GitHub
```

### Was **nicht** eingecheckt wird

- `node_modules/` — jeder macht `npm install` selbst
- `_site/` — wird gebaut, nicht versioniert

---

## 14. Offene Punkte / TODO

- [ ] Echtes Logo (SVG) statt Caveat-Schriftzug — Richtung Stüssy-Handstyle
- [ ] Echte Produktfotos statt Platzhalter-Kacheln
- [ ] Shop an echtes System anbinden (Shopify / Stripe / Snipcart)
- [ ] Newsletter an echten Anbieter anbinden (Mailchimp, Klaviyo, …)
- [ ] Footer-Seiten füllen: Versand, Rückgabe, Größentabelle, Kontakt, Impressum,
      Datenschutz (aktuell `#`)
- [ ] Texte / Drop-Statements final abstimmen
- [ ] Bilder + Meta-Tags für Social Sharing (Open Graph)
- [ ] Farben ggf. weiter justieren

---

## 15. Troubleshooting

**`npm start` bricht mit „Ausführung von Skripts ist deaktiviert“ ab (Windows)**
→ Siehe [Abschnitt 3](#️-windows--powershell-ausführung-von-skripts-ist-deaktiviert).
Kurz: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` oder `npm.cmd` nutzen.

**Port 8080 ist belegt**
→ `npx @11ty/eleventy --serve --port=3000`

**Änderung an einer Section wirkt nicht**
→ Läuft `npm start`? Datei wirklich in `src/_includes/sections/` und per
`{% include %}` eingebunden? Bei hartnäckigen Fällen `_site/` löschen und neu
starten.

**Schriften / Countdown fehlen beim direkten Öffnen der HTML-Datei**
→ Nicht `_site/index.html` doppelklicken. Immer über `npm start` (bzw. beim
Deployment über den Webserver) aufrufen — die absoluten Pfade (`/css/…`,
`/js/…`) brauchen einen Server.

**`npm install` schlägt fehl (Proxy / Firmennetz)**
→ Node-Version prüfen (`node -v` ≥ 18). Notfalls `npm cache clean --force` und
erneut.

**Eleventy startet nicht: „Cannot find module @11ty/eleventy“**
→ `npm install` wurde nicht ausgeführt oder `node_modules/` ist unvollständig.
`npm install` (neu) ausführen.

---

*Fragen zum Code: Kommentare stehen direkt in den Dateien
(`src/css/style.css`, `src/js/*.js`, `src/_includes/**`).*
