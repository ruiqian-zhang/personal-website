import Link from "next/link";
import { projects } from "./project-data";

function Arrow({ back = false }: { back?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" transform={back ? "rotate(180 12 12)" : undefined} /></svg>;
}

export function ProjectNavigation({ slug }: { slug: string }) {
  const index = projects.findIndex(project => project.slug === slug);
  const next = projects[(index + 1) % projects.length];
  return <nav className="project-navigation" aria-label="Project navigation">
    <Link className="project-back" href="/projects/"><Arrow back /><span>All projects</span></Link>
    <Link className="project-next" href={`/projects/${next.slug}/`} aria-label={`Next project: ${next.title}`}><span>{next.title}</span><Arrow /></Link>
  </nav>;
}
