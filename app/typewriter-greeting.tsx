"use client";

import { useEffect, useState } from "react";
import { advanceTypewriter, greetings, type TypewriterState } from "./typewriter-state";

function GreetingLines({ text, language }: { text: string; language: string }) {
  const breakAt = language === "zh-Hans" ? 3 : 8;
  return <>{text.slice(0, breakAt)}{text.length > breakAt && <><br className="greeting-break" />{text.slice(breakAt)}</>}</>;
}

export function TypewriterGreeting() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let state: TypewriterState;

    function tick() {
      const next = advanceTypewriter(state);
      state = next.state;
      setText(next.text);
      setLanguage(next.language);
      timer = setTimeout(tick, next.delay);
    }

    function restart() {
      clearTimeout(timer);
      setLanguage("en");
      if (reducedMotion.matches) {
        setText(greetings[0].text);
        return;
      }
      state = { phrase: 0, length: 0, deleting: false };
      setText("");
      timer = setTimeout(tick, 250);
    }

    restart();
    reducedMotion.addEventListener("change", restart);
    return () => {
      clearTimeout(timer);
      reducedMotion.removeEventListener("change", restart);
    };
  }, []);

  return (
    <h1 className="typewriter-heading">
      <span className="sr-only">Hi, I’m Rhema Zhang. <span lang="zh-Hans">你好，我是张睿谦。</span></span>
      {greetings.map((greeting) => <span className="typewriter-reserve" aria-hidden="true" lang={greeting.language} key={greeting.language}><GreetingLines text={greeting.text} language={greeting.language} /></span>)}
      <span className="typewriter-text" aria-hidden="true" lang={language}><GreetingLines text={text} language={language} /></span>
      <noscript><span className="typewriter-fallback" aria-hidden="true"><GreetingLines text={greetings[0].text} language="en" /></span></noscript>
    </h1>
  );
}
