export type TypewriterState = {
  phrase: number;
  length: number;
  deleting: boolean;
};

export const greetings = [
  { text: "Hi, I’m Rhema Zhang.", language: "en" },
  { text: "你好，我是张睿谦。", language: "zh-Hans" },
] as const;

const typingRhythm = [100, 170, 80, 125, 210, 95, 145, 75];
const deletingRhythm = [45, 65, 35, 55, 40];

export function advanceTypewriter(state: TypewriterState) {
  const phrase = greetings[state.phrase];
  const characters = Array.from(phrase.text);
  const length = state.deleting ? Math.max(0, state.length - 1) : Math.min(characters.length, state.length + 1);
  const text = characters.slice(0, length).join("");

  if (state.deleting) {
    return {
      text,
      language: phrase.language,
      delay: length === 0 ? 450 : deletingRhythm[length % deletingRhythm.length] * (phrase.language === "zh-Hans" ? 2 : 1),
      state: length === 0
        ? { phrase: (state.phrase + 1) % greetings.length, length: 0, deleting: false }
        : { ...state, length },
    };
  }

  const complete = length === characters.length;
  const punctuation = /[,，。!?]/u.test(characters[length - 1]);
  return {
    text,
    language: phrase.language,
    delay: complete ? (phrase.language === "zh-Hans" ? 4500 : 2200) : punctuation ? 310 : typingRhythm[(length + state.phrase * 3) % typingRhythm.length],
    state: { ...state, length, deleting: complete },
  };
}
