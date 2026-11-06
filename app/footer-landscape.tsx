import type { CSSProperties } from "react";

const landscapeStyle = {
  "--landscape-image": `url("${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landscapes/footer-mountains.webp?v=3773ba1d")`,
} as CSSProperties;

export function FooterLandscape() {
  return (
    <div className="footer-landscape" aria-hidden="true">
      <div className="landscape-art" style={landscapeStyle} />
    </div>
  );
}

export function LandscapeCredit() {
  return <p className="landscape-credit"><a href="https://github.com/LingDong-/shan-shui-inf" target="_blank" rel="noopener noreferrer">Shan, Shui</a> by Lingdong Huang</p>;
}
