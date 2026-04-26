interface Props {
  guessed: Set<string>;
  word: string;
  onGuess: (letter: string) => void;
  disabled: boolean;
}

const ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKLÑ".split(""),
  "ZXCVBNM".split(""),
];

export function Keyboard({ guessed, word, onGuess, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1 sm:gap-1.5">
          {row.map((letter) => {
            const isGuessed = guessed.has(letter);
            const isCorrect = isGuessed && word.includes(letter);
            const isWrong = isGuessed && !word.includes(letter);

            return (
              <button
                key={letter}
                onClick={() => onGuess(letter)}
                disabled={isGuessed || disabled}
                className={`
                  h-10 w-7 sm:h-12 sm:w-9 rounded-md font-display text-sm sm:text-base font-bold
                  transition-all duration-200 select-none
                  ${
                    isCorrect
                      ? "bg-[var(--gradient-hextech)] text-accent-foreground glow-hextech border border-hextech"
                      : isWrong
                        ? "bg-destructive/20 text-destructive border border-destructive/50 line-through opacity-60"
                        : disabled
                          ? "bg-muted/40 text-muted-foreground border border-border cursor-not-allowed"
                          : "frame-ornate text-gold-gradient hover:scale-110 hover:glow-gold active:scale-95 cursor-pointer"
                  }
                `}
                style={
                  isCorrect
                    ? { background: "var(--gradient-hextech)" }
                    : undefined
                }
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
