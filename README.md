# Ruiqian Zhang / Rhema

A minimal personal website built with Next.js, React, and TypeScript. Separate About, Resume, Projects, and Blogs pages; serif headings; monochrome light (`#f5f5f5`) and dark (`#0d0d0d`) themes.

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Visit http://127.0.0.1:3000. Run `npm run typecheck` to check TypeScript and `npm run build` to generate the static website in `out/`.

Run `node --test tests/typewriter.test.mjs` to check the bilingual typewriter sequence, deletion, timing, and looping. The greeting text and timing live in `app/typewriter-state.ts`; `app/typewriter-greeting.tsx` handles playback and reduced-motion preferences.

## GitHub Pages

1. Push this project to a GitHub repository with a `main` branch.
2. Under **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Push to `main` or run **Deploy to GitHub Pages** from the Actions tab.

The included workflow builds and deploys `out/`. It gets the repository base path from GitHub Pages automatically, supporting both project sites (`username.github.io/repository/`) and root/custom-domain sites. No Node.js server is needed in production. If your default branch differs, update `.github/workflows/deploy.yml`.

For a manual project-path build in PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/your-repository-name'
npm run build
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

## Content

- `app/page.tsx`: About and bio
- `app/resume/page.tsx`: Embedded resume PDF, with open and download links
- `app/projects/page.tsx`: Project index
- `app/project-data.ts`: Shared project titles, summaries, dates, status, and preview images
- `app/projects/mepad/page.tsx`: MePad development log
- `app/projects/personal-website/page.tsx`: Original website project and design references
- `app/project-assets/`: Imported project images
- `app/blogs/page.tsx`: Work-in-progress page with a hand-drawn cat and yarn illustration
- `app/layout.tsx`: Metadata, contact information, footer, initial theme
- `app/globals.css`: Typography, responsive layout, theme colors

The theme defaults to the visitor’s system setting, then remembers their explicit choice when local storage is available. No external fonts, tracking, or API services are required.

PP Kyoto is bundled from `app/fonts/` through `next/font/local`, so browsers load the font from the site rather than depending on installed system fonts. Ensure your font license permits web embedding before publishing these files.

The MePad V1 and Personal Website content was imported from the previous site's project pages. The homepage and Projects index share the same project list. Edit `app/project-data.ts` to update their summaries and edit each project's page for the full write-up. Add new image files to `app/project-assets/` and import them through `app/project-data.ts`.

## Updating the resume

Replace `public/Ruiqian_Zhang_Resume.pdf` with your updated PDF, keeping the filename exactly the same. On GitHub, open the repository's `public` folder, choose **Add file → Upload files**, upload the replacement, and commit to `main`. The Pages workflow redeploys the site and the preview, open link, and download link all use the updated document. No page code changes are needed. Refresh the resume page after deployment; browser or GitHub Pages caching may briefly show the previous version.

The PDF is served directly by the website, with no external document service. Embedded PDF display depends on the visitor's browser; the open/download links remain available on browsers that do not support previews.

## Icon attribution

Footer icons are unmodified SVG assets from [Font Awesome Free 6.7.2](https://github.com/FortAwesome/Font-Awesome/tree/6.7.2): regular envelope and brand X, GitHub, and LinkedIn. Icons are licensed under CC BY 4.0; the license is included in `public/icons/FONT-AWESOME-LICENSE.txt`. CSS masks apply the site's text color without changing the SVG paths.
