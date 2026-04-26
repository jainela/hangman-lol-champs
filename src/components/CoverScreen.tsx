import { Button } from "@/components/ui/button";
import coverImage from "@/assets/cover-runeterra.jpg";

interface CoverScreenProps {
  onStart: () => void;
}

export function CoverScreen({ onStart }: CoverScreenProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={coverImage}
        alt="Portada épica de Runeterra con horca rúnica flotante"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.04 250 / 0.55) 0%, oklch(0.12 0.05 260 / 0.85) 100%)",
        }}
      />
      {/* Glow accents */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, oklch(0.78 0.14 80 / 0.18) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber-300/80 sm:text-sm">
          League of Legends · Runeterra
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight text-white drop-shadow-[0_4px_20px_oklch(0_0_0/0.6)] sm:text-7xl">
          Ahorcado de{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.85 0.18 80) 0%, oklch(0.65 0.18 50) 100%)",
            }}
          >
            Runeterra
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-slate-200/90 sm:text-lg">
          Adivina campeones, objetos y regiones del universo de LoL antes de que
          se consuman las runas. ¿Tienes lo necesario para invocar la victoria?
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={onStart}
            className="group relative h-14 min-w-[200px] overflow-hidden rounded-md px-8 text-base font-semibold uppercase tracking-widest text-slate-950 shadow-[0_0_30px_oklch(0.78_0.14_80/0.45)] transition-transform hover:scale-105"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.88 0.16 85) 0%, oklch(0.7 0.18 55) 100%)",
            }}
          >
            <span className="relative z-10">Jugar</span>
          </Button>
          <p className="text-xs text-slate-400 sm:text-sm">
            Pulsa una letra del teclado o de la pantalla
          </p>
        </div>

        {/* Decorative bottom bar */}
        <div className="mx-auto mt-16 flex items-center justify-center gap-4 opacity-60">
          <span className="h-px w-16 bg-amber-300/50" />
          <span className="text-amber-300/70 text-xs tracking-[0.3em]">
            ⟡ DEMACIA · NOXUS · IONIA ⟡
          </span>
          <span className="h-px w-16 bg-amber-300/50" />
        </div>
      </div>
    </section>
  );
}
