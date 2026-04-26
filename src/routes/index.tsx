import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HangmanGame } from "@/components/HangmanGame";
import { CoverScreen } from "@/components/CoverScreen";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ahorcado de Runeterra | Juego LoL" },
      {
        name: "description",
        content:
          "Ahorcado con temática de League of Legends: adivina campeones, objetos y regiones de Runeterra antes de que se consuman las runas.",
      },
      { property: "og:title", content: "Ahorcado de Runeterra | Juego LoL" },
      {
        property: "og:description",
        content: "Pon a prueba tus conocimientos de Runeterra en este ahorcado épico.",
      },
    ],
  }),
});

function Index() {
  const [started, setStarted] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (started && gameRef.current) {
      gameRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [started]);

  if (!started) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <CoverScreen onStart={() => setStarted(true)} />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Decorative background runes */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, oklch(0.55 0.18 230 / 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.78 0.14 80 / 0.3) 0%, transparent 40%)",
        }}
      />
      <div ref={gameRef} className="relative px-4 py-10 sm:py-16">
        <HangmanGame />
      </div>
    </main>
  );
}
