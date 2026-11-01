import type { Metadata } from "next";

export const metadata: Metadata = { title: "Resume" };

export default function Resume() {
  const resumeUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/Ruiqian_Zhang_Resume.pdf`;

  return (
    <article className="resume-page">
      <header className="resume-header">
        <h1>Resume</h1>
        <div className="resume-actions">
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Open PDF<span className="sr-only"> in a new tab</span></a>
          <a href={resumeUrl} download="Ruiqian_Zhang_Resume.pdf">Download</a>
        </div>
      </header>
      <object
        className="resume-preview"
        data={`${resumeUrl}#view=FitH`}
        type="application/pdf"
        aria-label="Ruiqian Zhang resume PDF preview"
      >
        <p>Your browser can’t display the preview. <a href={resumeUrl}>Open the resume PDF</a>.</p>
      </object>
    </article>
  );
}

