import { WorkInProgress } from "../work-in-progress";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blogs" };

export default function Blogs() {
  return (
    <article className="blogs-page">
      <h1>Blogs</h1>
      <WorkInProgress />
    </article>
  );
}

