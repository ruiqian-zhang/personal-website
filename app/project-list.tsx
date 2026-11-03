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
              <img
                src={project.image.src}
                srcSet={`${project.image.src} ${project.image.width}w, ${project.image2x.src} ${project.image2x.width}w`}
                sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 920px) calc(50vw - 48px), 420px"
                width={project.image.width}
                height={project.image.height}
                alt={project.imageAlt}
                loading="lazy"
                decoding="async"
              />
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
