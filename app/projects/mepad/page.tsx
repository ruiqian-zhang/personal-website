import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { ProjectNavigation } from "../../project-navigation";
import { projectImages } from "../../project-data";

export const metadata: Metadata = { title: "MePad V1", description: "Designing a programmable USB macro keypad: layout, switch matrix, firmware, and PCB development." };

function ProjectFigure({ image, alt }: { image: StaticImageData; alt: string }) {
  return <figure className="project-figure"><Image src={image} alt={alt} sizes="(max-width: 920px) 100vw, 856px" /><figcaption>{alt}</figcaption></figure>;
}

export default function MePad() {
  return (
    <article className="project-detail">
      <h1>MePad V1</h1>
      <p className="project-detail-meta">In progress · Started <time dateTime="2026-01-03">Jan 3, 2026</time></p>
      <div className="prose">
        <p>My take on a programmable USB macro keypad. I’m exploring the entire product development process, from identifying user needs to hardware design and software implementation.</p>
      </div>
      <section className="project-section" aria-labelledby="requirements-heading">
        <h2 id="requirements-heading">Design requirements</h2>
        <ul className="project-requirements"><li>Compact design</li><li>Hot-swappable switches</li><li>Audio controls</li><li>Two USB ports</li><li>Multiple switches</li><li>Low cost</li></ul>
      </section>
      <section className="project-section" aria-labelledby="dev-log-heading">
        <h2 id="dev-log-heading">Development log</h2>
        <section className="dev-entry">
          <h3 id="mepad-day-1">Day 1: Layout design</h3>
          <time dateTime="2026-01-03">Jan 3, 2026</time>
          <div className="prose"><p>I started the project on a whim, researching and taking inspiration from online resources such as Bilibili.</p><p>I set the initial layout using <a href="http://keyboard-layout-editor.com" target="_blank" rel="noopener noreferrer">keyboard-layout-editor.com</a>. The plan is nine regular switch keys and two rotary knobs: one for audio controls and one for scrolling through webpages or Premiere Pro timelines.</p></div>
          <ProjectFigure image={projectImages.layout} alt="Initial MePad key and knob layout" />
        </section>
        <section className="dev-entry">
          <h3 id="mepad-day-2">Day 2: PCB schematics & firmware</h3>
          <time dateTime="2026-01-05">Jan 5, 2026</time>
          <ul className="project-notes"><li>Learned to optimize microcontroller connections with a switch matrix.</li><li>Implemented diodes to prevent input ghosting.</li><li>Built initial keyboard firmware with <a href="https://kbfirmware.com" target="_blank" rel="noopener noreferrer">kbfirmware.com</a>.</li><li>Designed the PCB footprint using Autodesk Fusion 360, with knob dimensions of 15mm at the top and 32mm at the bottom.</li><li>Finished the EasyEDA schematics around an ATmega32U4 microcontroller.</li></ul>
          <ProjectFigure image={projectImages.matrix} alt="MePad switch matrix" />
          <ProjectFigure image={projectImages.schematic} alt="MePad circuit schematic" />
        </section>
        <section className="dev-entry">
          <h3 id="mepad-day-3">Day 3: Component placement</h3>
          <time dateTime="2026-01-06">Jan 6, 2026</time>
          <p>I started placing components on the board and checking that they fit within the planned housing.</p>
          <ProjectFigure image={projectImages.placement} alt="Initial component placement on the MePad PCB" />
        </section>
        <section className="dev-entry">
          <h3 id="mepad-day-4">Day 4: PCB wiring</h3>
          <time dateTime="2026-01-09">Jan 9, 2026</time>
          <p>I started wiring and routing the PCB.</p>
          <ProjectFigure image={projectImages.routing} alt="MePad PCB wiring and routing" />
        </section>
        <section className="dev-entry">
          <h3 id="mepad-day-5">Day 5: Continued PCB wiring</h3>
          <time dateTime="2026-03-07">Mar 7, 2026</time>
          <p>I changed the microcontroller layout and improved the routing.</p>
          <ProjectFigure image={projectImages.revisedRouting} alt="Revised MePad microcontroller placement and PCB routing" />
        </section>
        <p className="page-note">More updates to come.</p>
      </section>
      <ProjectNavigation slug="mepad" />
    </article>
  );
}
