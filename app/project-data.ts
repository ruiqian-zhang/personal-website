import tobyCad from "./generated-images/Toby_CAD.webp";
import tobyPrototype from "./generated-images/Toby_Prototype.webp";
import tobySmall from "./generated-images/Toby_CAD-420.webp";
import tobyLarge from "./generated-images/Toby_CAD-840.webp";
import layout from "./generated-images/MePad_Layout.webp";
import matrix from "./generated-images/MePad_Matrix.webp";
import schematic from "./generated-images/MePad_Schematic.webp";
import placement from "./generated-images/MePad_PCB_Day2.webp";
import routing from "./generated-images/MePad_PCB_Day3.webp";
import revisedRouting from "./generated-images/MePad_PCB_Day4.webp";
import website from "./generated-images/Website_Main.webp";
import janeWong from "./generated-images/Website_Wongmjane.webp";
import apple from "./generated-images/Website_Apple.webp";
import routingSmall from "./generated-images/MePad_PCB_Day3-420.webp";
import routingLarge from "./generated-images/MePad_PCB_Day3-840.webp";
import websiteSmall from "./generated-images/Website_Main-420.webp";
import websiteLarge from "./generated-images/Website_Main-840.webp";

export const projectImages = { tobyCad, tobyPrototype, layout, matrix, schematic, placement, routing, revisedRouting, website, janeWong, apple };

export const projects = [
  {
    slug: "toby",
    title: "TOBY: Self-Balancing Rover",
    description: "Electronics for a wheeled-legged robot prototype built at Cal Hacks 13.0.",
    caption: "A wheeled-legged robot prototype built at Cal Hacks.",
    date: "2026-10-25",
    dateLabel: "Oct 25, 2026",
    status: "Prototype",
    image: tobySmall,
    image2x: tobyLarge,
    imageAlt: "TOBY wheeled-legged robot CAD rendering",
  },
  {
    slug: "mepad",
    title: "MePad V1",
    description: "A custom programmable USB macro keypad, from layout and switch matrix to firmware and PCB design.",
    caption: "A programmable USB macro keypad.",
    date: "2026-01-03",
    dateLabel: "Jan 3, 2026",
    status: "In progress",
    image: routingSmall,
    image2x: routingLarge,
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
    image: websiteSmall,
    image2x: websiteLarge,
    imageAlt: "Screenshot of the original personal website",
  },
];
