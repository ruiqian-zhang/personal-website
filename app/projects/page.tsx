import type { Metadata } from "next";
import { ProjectList } from "../project-list";

export const metadata: Metadata = { title: "Projects" };

export default function Projects() {
  return (
    <article className="projects-page">
      <h1>Projects</h1>
      <ProjectList />
    </article>
  );
}

