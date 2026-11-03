import portraitSmall from "./generated-images/rhema-480.webp";
import portraitMedium from "./generated-images/rhema-960.webp";
import portraitLarge from "./generated-images/rhema-1440.webp";
import portraitAvif from "./generated-images/portrait-avif.json";
import { ProjectList } from "./project-list";
import { TypewriterGreeting } from "./typewriter-greeting";
import { AboutStickers } from "./about-stickers";
import { ProfilePhotoFrame } from "./profile-photo-frame";

const stickersEnabled = false;

export default function About() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <article className="about-page">
      <header className="about-intro">
        <div>
          <TypewriterGreeting />
          <p className="about-subtitle">Electrical Engineering, Class of 2028</p>
        </div>
        <ProfilePhotoFrame>
          <picture>
            <source type="image/avif" srcSet={`${basePath}${portraitAvif.small.src} ${portraitAvif.small.width}w, ${basePath}${portraitAvif.medium.src} ${portraitAvif.medium.width}w, ${basePath}${portraitAvif.large.src} ${portraitAvif.large.width}w`} sizes="(max-width: 480px) 435px, (max-width: 666px) 320px, (max-width: 960px) 48vw, 461px" />
          <img
            className="about-photo"
            draggable={false}
            src={portraitMedium.src}
            srcSet={`${portraitSmall.src} ${portraitSmall.width}w, ${portraitMedium.src} ${portraitMedium.width}w, ${portraitLarge.src} ${portraitLarge.width}w`}
            sizes="(max-width: 480px) 435px, (max-width: 666px) 320px, (max-width: 960px) 48vw, 461px"
            alt="Rhema Zhang Portrait"
            width={288}
            height={288}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          </picture>
        </ProfilePhotoFrame>
      </header>
      <section className="prose" aria-labelledby="about-heading">
        <h2 id="about-heading">About Me</h2>
        <p>I'm a junior Electrical Engineering student at <a className="university-link" href="https://www.vt.edu/" target="_blank" rel="noopener noreferrer">Virginia Tech<svg className="university-logo" viewBox="0 0 91 45" aria-hidden="true" focusable="false" fill="currentColor"><path d="M51.03616,1.647A15.44173,15.44173,0,0,0,37.455,9.74063l-3.3221,6.14015-.38618.71385-.37416.69155v0L23.33791,35.83257,6.95743,5.21623h7.28534l5.86662,10.90735,3.0783,5.72325,3.178-5.66855,6.1458-10.96205H37.8239A17.73394,17.73394,0,0,1,42.25837,1.647H30.42075L23.25252,14.43275,16.37549,1.647H1L23.32031,43.36533,35.74487,20.4017l2.05986-3.80707.38618-.71385,2.38924-4.41569q.19527-.361.413-.70464a11.91922,11.91922,0,0,1,9.25634-5.51633q.40569-.02778.81628-.02789H83.59148l-3.28411,6.12089H65.25674l-1.0071,1.89225L50.32392,39.39423h-7.3845L55.15258,16.71182l2.83311-5.26148H43.32978c-.8365,1.323-2.03512,3.56926-2.03512,3.56926H52.01015L36.96406,42.96349H52.46744L67.40026,14.90638H82.44252L89.55691,1.647Z" /></svg></a>. I love working with hardware, whether it's power electronics, PCB design, or robotics.</p>
        <p>When I’m not in the lab working on robots with RoboGrinder, you’ll probably find me city walking, cafe hopping, taking photos, or going down a new rabbit hole.</p>
        <p>I’m available for internships and co-ops starting in May 2027. Feel free to reach out at <a href="mailto:rhema@vt.edu">rhema@vt.edu</a>.</p>
      </section>
      <section className="about-projects" aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>
        <ProjectList headingLevel={3} />
      </section>
      {stickersEnabled && <AboutStickers />}
    </article>
  );
}

