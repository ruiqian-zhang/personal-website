import Link from "next/link";
import { SleepingOwl } from "./sleeping-owl";

export default function NotFound() {
  return (
    <article className="not-found-page">
      <h1>Page not found</h1>
      <div className="blog-placeholder">
        <SleepingOwl />
        <p>This page doesn’t exist. <Link href="/">Return to About</Link>.</p>
      </div>
    </article>
  );
}

