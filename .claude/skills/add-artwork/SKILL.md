---
name: add-artwork
description: Neues Kunstwerk zur Galerie hinzufügen, wenn der Nutzer ein Bild eines gemalten Werks anhängt und es in die Seite aufnehmen möchte. Fragt fehlende Angaben (Titel, Maße, Material, Preis, Jahr, Tags, Beschreibung) gezielt ab, legt Bild und Markdown-Datei an, baut die Seite zur Prüfung und committet direkt auf main.
---

# Kunstwerk zur Galerie hinzufügen

Dieser Skill deckt den kompletten Ablauf ab, ein neues Kunstwerk in dieses
Eleventy-Projekt aufzunehmen: Bild speichern, Markdown-Datei mit Frontmatter
anlegen, Build/Screenshot-Test, Commit direkt auf `main` (kein Feature-Branch,
kein PR — siehe `CLAUDE.md`, Abschnitt "Git-Workflow").

## Voraussetzung

Der Nutzer hat ein Bild des Kunstwerks an die Nachricht angehängt. Das Bild
ist bereits sichtbar; der lokale Dateipfad steht in einem
`<system-reminder>` (`/root/.claude/uploads/.../*.jpg`). Diesen Pfad nur zum
Kopieren verwenden, nicht erneut lesen/anzeigen.

## Ablauf


0. Wechsle im Repo auf den Branch 'main'
1. **Bild kurz beschreiben.** Motiv/Stimmung in ein bis zwei Sätzen nennen,
   damit der Nutzer sieht, dass das richtige Bild erkannt wurde.

2. **Fehlende Angaben erfragen.** Frontmatter-Schema laut `CLAUDE.md`:
   `title`, `dimensions`, `price`, `ground`, `technique`, `year`, `tags`
   (Liste), optional `sold: true`. Mit `AskUserQuestion` abfragen, in
   sinnvollen Gruppen (z. B. Titel+Maße, Material, Preis+Status, Jahr+Tags).
   Sinnvolle Vorschläge aus bestehenden Werken ableiten (z. B. per
   `grep -h '^price:' src/artworks/*.md` typische Preise/Formate ermitteln),
   aber nichts raten, was der Nutzer erkennbar selbst festlegen will.
   - Kommen widersprüchliche oder erkennbar vertauschte Antworten zurück
     (z. B. Material im Preis-Feld), gezielt nachfragen statt zu raten.
   - Bei `dimensions` das Format `<b> x <h>cm` verwenden (siehe Bestandsdaten).

3. **Beschreibungstext klären.** Fragen, ob der Nutzer den Body-Text selbst
   liefert oder einen kurzen Entwurf (2 Absätze, persönlicher Ton wie in
   bestehenden Werken) wünscht. Bei Entwurf: Bildmotiv aufgreifen, keine
   Fakten erfinden, die nicht aus Bild oder Nutzerangaben hervorgehen.

4. **Slug bestimmen.** Aus dem Titel einen kebab-case-Slug ableiten (Umlaute
   transliterieren, z. B. Schutzengel → `schutzengel`). Prüfen, dass
   `src/artworks/<slug>.md` und `src/images/<slug>.<ext>` noch nicht
   existieren.

5. **Bild kopieren:**
   ```bash
   cp "<uploads-pfad-aus-system-reminder>" src/images/<slug>.jpg
   ```

6. **Markdown-Datei anlegen** unter `src/artworks/<slug>.md`:
   ```yaml
   ---
   title: <Titel>
   layout: artwork.njk
   date: <heutiges Datum, YYYY-MM-DD>
   image: <slug>.jpg
   dimensions: <B x Hcm>
   price: <Zahl>
   ground: <Material>
   technique: <Technik>
   year: <Jahr>
   tags:
    - <Tag1>
    - <Tag2>
   ---
   <Beschreibungstext>
   ```
   `sold: true` nur ergänzen, wenn das Werk bereits verkauft ist.

7. **Build verifizieren:**
   ```bash
   npm run build
   ```
   Prüfen, dass `dist/artworks/<slug>/index.html` und das Thumbnail
   erzeugt wurden.

8. **Visuell prüfen** (Playwright, Chromium ist vorinstalliert unter
   `/opt/pw-browsers/chromium`, Modul unter
   `/opt/node22/lib/node_modules/playwright/index.js`):
   ```bash
   npx eleventy --serve --port <freier Port> &
   ```
   Screenshot der neuen Detailseite (`/marc-gerrit-artist/artworks/<slug>/`)
   erstellen und ansehen, danach den Serverprozess wieder beenden
   (`pkill -f "eleventy --serve"`).

09. **Kurz zusammenfassen**, was angelegt wurde (Maße, Material, Preis,
    Jahr, Tags), und darauf hinweisen, dass der Beschreibungstext bei Bedarf
    noch angepasst werden kann.

10. **Direkt auf main committen und pushen** (kein Branch, kein PR):
   ```bash
   git add src/artworks/<slug>.md src/images/<slug>.jpg
   git commit -m "Neues Kunstwerk <Titel> hinzufügen

   Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
   git push origin main
   ```
   Vor dem Commit aber nochmal rückfragen, ob der commit jetzt ausgeführt werden soll. 

## Hinweise

- Kein Feature-Branch, kein Pull Request — dieses Projekt wird nur von einer
  Person genutzt (siehe `CLAUDE.md`).
- `npm install` nur ausführen, wenn `node_modules` fehlt oder `npm run build`
  wegen fehlender Abhängigkeiten (z. B. `rimraf: not found`) scheitert.
- Nachträgliche Änderungen an bereits angelegten Werken (Preis, Tags,
  `sold`-Status, Beschreibung) sind einfache Edits an der bestehenden
  Markdown-Datei, kein erneuter Durchlauf dieses Skills nötig.
