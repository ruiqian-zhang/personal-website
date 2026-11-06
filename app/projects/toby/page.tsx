import type { Metadata } from "next";
import Image from "next/image";
import { ProjectNavigation } from "../../project-navigation";
import { projectImages } from "../../project-data";

export const metadata: Metadata = {
  title: "TOBY: Self-Balancing Rover",
  description: "Electronics for a wheeled-legged robot prototype built at Cal Hacks 13.0.",
};

export default function Toby() {
  return (
    <article className="project-detail">
      <h1>TOBY: Self-Balancing Rover</h1>
      <p className="project-detail-meta">Prototype · Started <time dateTime="2026-10">October 2026</time></p>
      <div className="prose">
        <p>TOBY is a wheeled-legged robot exploring efficient rolling and an adjustable stance for uneven terrain. I worked on the electronics in our four-person team.</p>
      </div>
      <a className="project-resource" href="https://devpost.com/software/toby-autonomous-bipedal-robot" target="_blank" rel="noopener noreferrer">Project story on Devpost</a>
      <figure className="project-figure">
        <Image src={projectImages.tobyCad} alt="TOBY CAD rendering showing its body, articulated legs, and two wheels" sizes="(max-width: 920px) 100vw, 856px" />
        <figcaption>Fusion 360 concept rendering</figcaption>
      </figure>
      <section className="project-section" aria-labelledby="toby-electronics">
        <h2 id="toby-electronics">Electronics</h2>
        <div className="prose">
          <p>The hardware combines an ESP32, SimpleFOC motor drivers, magnetic encoders, and an MPU-6050 IMU. An 11.1 V battery feeds separate 5 V logic and 6 V servo supplies.</p>
        </div>
      </section>
      <figure className="project-figure">
        <Image src={projectImages.tobyPrototype} alt="TOBY hardware prototype with exposed wiring and electronics on a workbench" sizes="(max-width: 920px) 100vw, 856px" />
        <figcaption>Hardware integration during the hackathon</figcaption>
      </figure>
      <section className="project-section" aria-labelledby="toby-next">
        <h2 id="toby-next">Lessons &amp; next steps</h2>
        <div className="prose">
          <p>Packaging and a damaged servo communication board limited integration. The experience reinforced the need to plan circuitry before finalizing the enclosure and bring spare components.</p>
          <p>Reliable actuation comes first, followed by feedback-based balancing. Simulation, reinforcement learning, and autonomous navigation remain future goals.</p>
        </div>
      </section>
      <ProjectNavigation slug="toby" />
    </article>
  );
}
