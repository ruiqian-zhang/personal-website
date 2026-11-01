import Link from "next/link";

export default function NotFound() {
  return (
    <article>
      <h1>Page not found</h1>
      <p>This page doesn’t exist. <Link href="/">Return to About</Link>.</p>
    </article>
  );
}

