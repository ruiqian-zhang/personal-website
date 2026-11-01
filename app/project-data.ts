import layout from "./project-assets/MePad_Layout.jpg";
import matrix from "./project-assets/MePad_Matrix.jpg";
import schematic from "./project-assets/MePad_Schematic.png";
import placement from "./project-assets/MePad_PCB_Day2.png";
import routing from "./project-assets/MePad_PCB_Day3.png";
import revisedRouting from "./project-assets/MePad_PCB_Day4.png";
import website from "./project-assets/Website_Main.png";
import janeWong from "./project-assets/Website_Wongmjane.png";
import apple from "./project-assets/Website_Apple.png";

export const projectImages = { layout, matrix, schematic, placement, routing, revisedRouting, website, janeWong, apple };

export const projects = [
  {
    slug: "mepad",
    title: "MePad V1",
    description: "A custom programmable USB macro keypad, from layout and switch matrix to firmware and PCB design.",
    caption: "A programmable USB macro keypad.",
    date: "2026-01-03",
    dateLabel: "Jan 3, 2026",
    status: "In progress",
    image: routing,
    imageAlt: "MePad PCB layout and routing",
  },
  {
    slug: "personal-website",
    title: "Personal Website",
    description: "The original version of my portfolio, built with HTML, CSS, and JavaScript.",
    caption: "My original HTML, CSS, and JavaScript portfolio.",
    date: "2025-09-20",
    dateLabel: "Sep 20, 2025",
    status: "In progress",
    image: website,
    imageAlt: "Screenshot of the original personal website",
  },
];
