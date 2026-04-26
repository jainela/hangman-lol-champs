import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORIES, MAX_WRONG, WORDS, type Category } from "@/lib/hangman-data";
import { HangmanFigure } from "./HangmanFigure";
import { Keyboard } from "./Keyboard";
import { WordDisplay } from "./WordDisplay";

type Filter = Category | "todos";

function pickWord(filter: Filter) {
  const pool = filter === "todos" ? WORDS : WORDS.filter((w) => w.category === filter);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function HangmanGame() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [current, setCurrent] = useState(() => pickWord("todos"));
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [score, setScore] = useState({ wins: 0, losses: 0 });

  const wrongLetters = useMemo(
    () => [...guessed].filter((l) => !current.word.includes(l)),
    [guessed, current.word],
  );
  const wrong = wrongLetters.length;

  const won = useMemo(
    () => current.word.split("").every((l) => guessed.has(l)),
    [current.word, guessed],
  );
  const lost = wrong >= MAX_WRONG;
  const finished = won || lost;

  // Score on finish
  useEffect(() => {
    if (won) setScore((s) => ({ ...s, wins: s.wins + 1 }));
    else if (lost) setScore((s) => ({ ...s, losses: s.losses + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won, lost]);

  const handleGuess = useCallback(
    (letter: string) => {
      if (finished) return;
      setGuessed((prev) => {
        if (prev.has(letter)) return prev;
        const next = new Set(prev);
        next.add(letter);
        return next;
      });
    },
    [finished],
  );

  const newRound = useCallback(
    (f: Filter = filter) => {
      setCurrent(pickWord(f));
      setGuessed(new Set());
    },
    [filter],
  );

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setCurrent(pickWord(f));
    setGuessed(new Set());
  };

  // Physical keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (k === "ENTER" && finished) {
        newRound();
        return;
      }
      if (/^[A-ZÑ]$/.test(k)) handleGuess(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleGuess, finished, newRound]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      {/* Header */}
      <header className="text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-hextech-gradient">
          Runeterra
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-6xl">
          <span className="text-gold-gradient">El Ahorcado</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Adivina la palabra antes de que las runas se consuman
        </p>
      </header>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => changeFilter(c.id)}
            className={`rounded-full px-4 py-1.5 font-display text-xs uppercase tracking-wider transition-all ${
              filter === c.id
                ? "frame-ornate text-gold-gradient glow-gold"
                : "border-gold text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="flex items-center justify-center gap-6 font-display text-sm">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Victorias</span>
          <span className="text-2xl text-gold-gradient">{score.wins}</span>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Derrotas</span>
          <span className="text-2xl text-destructive">{score.losses}</span>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Vidas</span>
          <span className="text-2xl text-hextech-gradient">{MAX_WRONG - wrong}</span>
        </div>
      </div>

      {/* Game board */}
      <div className="frame-ornate rounded-2xl p-5 sm:p-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="animate-float">
            <HangmanFigure wrong={wrong} />
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1 font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Categoría · {current.category}
              </p>
              <p className="text-base italic text-foreground/90 sm:text-lg">
                "{current.hint}"
              </p>
            </div>

            <WordDisplay word={current.word} guessed={guessed} reveal={lost} />

            {wrongLetters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Errores:
                </span>
                {wrongLetters.map((l) => (
                  <span
                    key={l}
                    className="rounded bg-destructive/20 px-2 py-0.5 font-display text-sm text-destructive line-through"
                  >
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End-of-round banner */}
      {finished && (
        <div
          className={`frame-ornate rounded-xl p-6 text-center ${
            won ? "glow-gold" : "animate-shake"
          }`}
        >
          {won ? (
            <>
              <p className="font-display text-3xl text-gold-gradient sm:text-4xl">
                ¡VICTORIA!
              </p>
              <p className="mt-1 text-muted-foreground">
                Una victoria digna de la Grieta del Invocador.
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-3xl text-destructive sm:text-4xl">
                DERROTA
              </p>
              <p className="mt-1 text-muted-foreground">
                La palabra era{" "}
                <span className="text-gold-gradient font-bold">{current.word}</span>
              </p>
            </>
          )}
          <button
            onClick={() => newRound()}
            className="mt-4 inline-flex items-center justify-center rounded-md px-8 py-3 font-display text-sm uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
          >
            Nueva Partida
          </button>
        </div>
      )}

      {/* Keyboard */}
      <Keyboard
        guessed={guessed}
        word={current.word}
        onGuess={handleGuess}
        disabled={finished}
      />

      <p className="text-center text-xs text-muted-foreground">
        Tip: usa tu teclado físico para jugar más rápido · Enter para nueva partida
      </p>
    </div>
  );
}
