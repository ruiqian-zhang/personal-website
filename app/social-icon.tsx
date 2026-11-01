// Original SVG assets: Font Awesome Free 6.7.2 (CC BY 4.0).
// Attribution and license: public/icons/FONT-AWESOME-LICENSE.txt.
export function SocialIcon({ name }: { name: "email" | "x" | "github" | "linkedin" }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <span
      className="social-icon"
      aria-hidden="true"
      style={{ maskImage: `url(${basePath}/icons/${name}.svg)` }}
    />
  );
}
