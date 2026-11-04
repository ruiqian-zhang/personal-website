import type { Metadata } from "next";
import Image from "next/image";
import { ProjectNavigation } from "../../project-navigation";
import { projectImages } from "../../project-data";

export const metadata: Metadata = { title: "Personal Website", description: "The original HTML, CSS, and JavaScript version of Ruiqian Zhang’s portfolio." };

export default function PersonalWebsite() {
  return (
    <article className="project-detail">
      <h1>Personal Website</h1>
      <p className="project-detail-meta">In progress · Started <time dateTime="2025-09-20">Sep 20, 2025</time></p>
      <div className="prose"><p>The original version of my personal website: a minimal, fast, responsive portfolio built with HTML, CSS, and JavaScript, with some help from AI coding tools.</p><p>I wanted to develop my web development skills by building with vanilla web technologies. This project documents that earlier version; the current site uses Next.js.</p></div>
      <a className="project-resource" href="https://github.com/rhemzema/personal-website" target="_blank" rel="noopener noreferrer">GitHub repository ↗</a>
      <figure className="project-figure"><Image src={projectImages.website} alt="The original personal website homepage" sizes="(max-width: 920px) 100vw, 856px" /><figcaption>The original website</figcaption></figure>
      <section className="project-section" aria-labelledby="goals-heading">
        <h2 id="goals-heading">Design goals</h2>
        <ul className="project-requirements"><li>Minimal</li><li>Dark mode</li><li>Visual design</li><li>Scalable</li><li>Low maintenance</li><li>Fun to build</li></ul>
      </section>
      <section className="project-section" aria-labelledby="inspiration-heading">
        <h2 id="inspiration-heading">Design references</h2>
        <figure className="project-figure"><Image src={projectImages.janeWong} alt="Jane Wong’s website, a design reference for the original portfolio" sizes="(max-width: 920px) 100vw, 856px" /><figcaption><a href="https://wongmjane.com" target="_blank" rel="noopener noreferrer">wongmjane.com ↗</a></figcaption></figure>
        <figure className="project-figure"><Image src={projectImages.apple} alt="Apple’s website, a design reference for the original portfolio" sizes="(max-width: 920px) 100vw, 856px" /><figcaption><a href="https://apple.com" target="_blank" rel="noopener noreferrer">apple.com ↗</a></figcaption></figure>
      </section>
      <ProjectNavigation slug="personal-website" />
    </article>
  );
}
