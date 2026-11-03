# Ruiqian Zhang

My personal website and engineering project journal.

[Visit ruiqian.dev](https://ruiqian.dev)

I’m Rhema, an electrical engineering student at Virginia Tech interested in hardware, power electronics, PCB design, and robotics. This site brings together my background, resume, and projects, including MePad, a programmable USB macro keypad.

## Built with

Next.js, React, and TypeScript. Statically exported for GitHub Pages, with light and dark themes and English and Chinese greetings.

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Run `npm run build` to generate the static site in `out/`.

Image variants are generated automatically before development and production builds. Keep original portraits in `app/image-sources/` and project images in `app/project-assets/`; `npm run images` regenerates AVIF and WebP files in the ignored `app/generated-images/` and `public/generated-images/` directories. Responsive image variants use content-hashed filenames for static hosting, without an image server.

## Credits

- Typography: [PP Kyoto by Pangram Pangram](https://pangrampangram.com/products/kyoto).
- Social icons: [Font Awesome Free](https://github.com/FortAwesome/Font-Awesome/tree/6.7.2), licensed under CC BY 4.0. License details are included in [public/icons/FONT-AWESOME-LICENSE.txt](public/icons/FONT-AWESOME-LICENSE.txt).
