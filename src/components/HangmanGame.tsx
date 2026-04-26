import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORIES, MAX_WRONG, WORDS, type Category } from "@/lib/hangman-data";
import { HangmanFigure } from "./HangmanFigure";
import { Keyboard } from "./Keyboard";
import { WordDisplay } from "./WordDisplay";

type Filter = Category | "todos";

// 1 fragmento hextech por cada 2 errores. Cuesta 1 fragmento usar una pista.
const ERRORS_PER_HINT = 2;

function pickWord(filter: Filter) {
  const pool = filter === "todos" ? WORDS : WORDS.filter((w) => w.category === filter);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function HangmanGame() {
  const [filter, setFilter] = useState<Filter>("todos");
  // Avoid SSR/client mismatch: start with a deterministic word, randomize after mount.
  const [current, setCurrent] = useState(() => WORDS[0]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [bonusHints, setBonusHints] = useState(0);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hintFlash, setHintFlash] = useState<string | null>(null);
  const [streakFlash, setStreakFlash] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Streak milestones — granted when streak reaches these counts.
  const STREAK_MILESTONES = [3, 5, 7, 10];

  // Pick a random word once on the client to avoid hydration mismatch.
  useEffect(() => {
    setCurrent(pickWord(filter));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrongLetters = useMemo(
    () => [...guessed].filter((l) => !current.word.includes(l)),
    [guessed, current.word],
  );
  const wrong = wrongLetters.length;

  // Earned hints = errors-based + bonuses from streak milestones; spent hints subtract.
  const hintsAvailable =
    Math.floor(wrong / ERRORS_PER_HINT) + bonusHints - hintsUsed;
  const errorsToNextHint = ERRORS_PER_HINT - (wrong % ERRORS_PER_HINT);

  const won = useMemo(
    () => current.word.split("").every((l) => guessed.has(l)),
    [current.word, guessed],
  );
  const lost = wrong >= MAX_WRONG;
  const finished = won || lost;

  // Score + streak handling on finish
  useEffect(() => {
    if (won) {
      setScore((s) => ({ ...s, wins: s.wins + 1 }));
      setStreak((prev) => {
        const next = prev + 1;
        setBestStreak((b) => Math.max(b, next));
        // Milestone reward: grant a bonus hint that carries to the next round.
        if (STREAK_MILESTONES.includes(next)) {
          setBonusHints((bh) => bh + 1);
          setStreakFlash(`🔥 ¡Racha de ${next}! +1 pista hextech`);
          setTimeout(() => setStreakFlash(null), 3500);
        }
        return next;
      });
    } else if (lost) {
      setScore((s) => ({ ...s, losses: s.losses + 1 }));
      setStreak(0);
    }
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

  const useHint = useCallback(() => {
    if (finished || hintsAvailable <= 0) return;
    const remaining = [...new Set(current.word.split(""))].filter(
      (l) => !guessed.has(l),
    );
    if (remaining.length === 0) return;
    const letter = remaining[Math.floor(Math.random() * remaining.length)];
    setGuessed((prev) => {
      const next = new Set(prev);
      next.add(letter);
      return next;
    });
    setHintsUsed((n) => n + 1);
    setHintFlash(letter);
    setTimeout(() => setHintFlash(null), 1200);
  }, [finished, hintsAvailable, current.word, guessed]);

  const newRound = useCallback(
    (f: Filter = filter) => {
      setCurrent(pickWord(f));
      setGuessed(new Set());
      setHintsUsed(0);
      setHintFlash(null);
    },
    [filter],
  );

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setCurrent(pickWord(f));
    setGuessed(new Set());
    setHintsUsed(0);
    setHintFlash(null);
  };

  // Physical keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (k === "ENTER" && finished) {
        newRound();
        return;
      }
      if (k === " " || e.key === "Tab") {
        e.preventDefault();
        useHint();
        return;
      }
      if (/^[A-ZÑ]$/.test(k)) handleGuess(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleGuess, finished, newRound, useHint]);

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

            {/* Hextech hint panel */}
            <div className="flex flex-col gap-2 rounded-lg border border-hextech/30 bg-secondary/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔮</span>
                  <div className="flex flex-col">
                    <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                      Fragmentos Hextech
                    </span>
                    <div className="mt-0.5 flex gap-1">
                      {Array.from({ length: Math.max(hintsAvailable, 1) }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-2.5 w-2.5 rotate-45 ${
                            i < hintsAvailable
                              ? "bg-hextech glow-hextech"
                              : "border border-hextech/30 bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={useHint}
                  disabled={hintsAvailable <= 0 || finished}
                  className={`rounded-md px-3 py-2 font-display text-xs uppercase tracking-wider transition-all ${
                    hintsAvailable > 0 && !finished
                      ? "text-primary-foreground hover:scale-105 active:scale-95 cursor-pointer"
                      : "cursor-not-allowed opacity-40"
                  }`}
                  style={
                    hintsAvailable > 0 && !finished
                      ? {
                          background: "var(--gradient-hextech)",
                          boxShadow: "var(--shadow-hextech)",
                        }
                      : { background: "oklch(0.28 0.05 240)" }
                  }
                >
                  Revelar letra
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {hintsAvailable > 0 ? (
                  <>
                    Tienes <span className="text-hextech-gradient font-bold">{hintsAvailable}</span>{" "}
                    {hintsAvailable === 1 ? "pista disponible" : "pistas disponibles"}.
                  </>
                ) : (
                  <>
                    Falla {errorsToNextHint}{" "}
                    {errorsToNextHint === 1 ? "letra más" : "letras más"} para ganar una pista.
                  </>
                )}
                {hintFlash && (
                  <span className="ml-2 text-gold-gradient font-bold">
                    ✨ Letra revelada: {hintFlash}
                  </span>
                )}
              </p>
            </div>

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
        Teclado físico para jugar · Espacio para usar pista · Enter para nueva partida
      </p>
    </div>
  );
}
