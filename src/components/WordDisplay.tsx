interface Props {
  word: string;
  guessed: Set<string>;
  reveal: boolean;
}

export function WordDisplay({ word, guessed, reveal }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {word.split("").map((letter, i) => {
        const shown = guessed.has(letter) || reveal;
        const wasMissed = reveal && !guessed.has(letter);
        return (
          <div
            key={i}
            className="flex h-12 w-9 sm:h-16 sm:w-12 flex-col items-center justify-end"
          >
            <span
              className={`mb-1 font-display text-2xl sm:text-4xl font-bold transition-all duration-300 ${
                shown
                  ? wasMissed
                    ? "text-destructive"
                    : "text-gold-gradient"
                  : "opacity-0"
              }`}
              style={{
                textShadow: shown && !wasMissed
                  ? "0 0 20px oklch(0.78 0.18 80 / 0.6)"
                  : "none",
              }}
            >
              {letter}
            </span>
            <div
              className="h-0.5 w-full rounded-full"
              style={{
                background: shown
                  ? "var(--gradient-gold)"
                  : "oklch(0.7 0.13 80 / 0.4)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
