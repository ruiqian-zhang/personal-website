export function FooterLandscape() {
  return (
    <div className="footer-landscape">
      <div className="landscape-art" aria-hidden="true">
        <picture>
          <source media="(min-width: 601px)" srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landscapes/footer-sea-1793758157519-wide-ink.webp`} />
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/landscapes/footer-sea-1793758157519-ink.webp`} width="1920" height="1100" alt="" loading="lazy" decoding="async" />
        </picture>
      </div>
    </div>
  );
}

export function LandscapeCredit() {
  return <p className="landscape-credit"><a href="https://github.com/LingDong-/shan-shui-inf" target="_blank" rel="noopener noreferrer">Shan, Shui</a> by Lingdong Huang</p>;
}
