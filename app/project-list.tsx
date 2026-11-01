import Image from "next/image";
import Link from "next/link";
import { projects } from "./project-data";

export function ProjectList({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link className="project-link" href={`/projects/${project.slug}/`}>
            <div className="project-thumbnail">
              <Image src={project.image} alt={project.imageAlt} sizes="(max-width: 600px) 100vw, 420px" />
            </div>
            <div className="project-summary">
              <Heading>{project.title}</Heading>
              <p>{project.caption}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
