# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build        # clean dist/, generate thumbnails, run Eleventy
npm run serve        # same as build but with Eleventy dev server (live reload)
npm run build:thumbnails  # only regenerate thumbnails (src/images/ → dist/thumbnails/)
npm run clean        # delete dist/
```

There are no tests or linters configured.

## Git-Workflow

Dieses Projekt wird nur von einer Person genutzt. Kein Feature-Branch-/Pull-Request-Workflow: Änderungen immer direkt auf `main` committen und pushen.

## Architecture

This is an [Eleventy (11ty)](https://www.11ty.dev/) static site for artist Marc Gerrit Langer. Output goes to `dist/` with a `pathPrefix` of `/marc-gerrit-artist/` (configured in `.eleventy.js`).

### Build pipeline

Before Eleventy runs, `build/thumbnail.mjs` uses `sharp` to resize every image in `src/images/` to a 250×250 center-cropped JPEG/PNG and writes them to `dist/thumbnails/`. The originals are passed through unchanged by Eleventy's `addPassthroughCopy`.

### Content model

Each artwork is a Markdown file under `src/artworks/` with this frontmatter:

```yaml
title: Eisvogel
layout: artwork.njk
date: 2025-11-27
image: eisvogel.jpg      # filename in src/images/
dimensions: 30 x 40cm
ground: Leinwand
technique: Acrylfarbe
year: 2024
sold: true
```

The Markdown body is the artist's description of the piece. Eleventy collects all `src/artworks/*.md` files into the `artworks` collection (defined in `.eleventy.js`).

### Templates

- `src/_includes/layout.njk` — base layout used by regular pages (index, impressum, datenschutz)
- `src/_includes/artwork.njk` — artwork detail layout; renders the image, metadata fields, and description
- `src/_includes/snippets/gallery.njk` — iterates `collections.artworks` and renders thumbnail links; included in `index.md`

### Styles

`src/assets/css/main.css` is the single entry point; it `@import`s `reset.css` and `basic.css`. Page-specific stylesheets (`gallery.css`, `artwork.css`, `header.css`, `footer.css`, `headings.css`) are linked directly from templates as needed.
