import { useState } from "react";

export interface Rules {
  errorsPerHint: number;
  milestones: number[];
  maxWrong: number;
}

interface Props {
  rules: Rules;
  defaults: Rules;
  onChange: (rules: Rules) => void;
}

export function RulesPanel({ rules, defaults, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [milestonesText, setMilestonesText] = useState(
    rules.milestones.join(", "),
  );
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<Rules>) => {
    onChange({ ...rules, ...patch });
  };

  const commitMilestones = (raw: string) => {
    setMilestonesText(raw);
    const parsed = raw
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map(Number);

    if (parsed.some((n) => !Number.isFinite(n) || n < 1 || n > 99)) {
      setError("Los hitos deben ser números entre 1 y 99.");
      return;
    }
    const cleaned = [...new Set(parsed)].sort((a, b) => a - b);
    if (cleaned.length === 0) {
      setError("Debes definir al menos un hito.");
      return;
    }
    setError(null);
    update({ milestones: cleaned });
  };

  const reset = () => {
    setMilestonesText(defaults.milestones.join(", "));
    setError(null);
    onChange(defaults);
  };

  return (
    <section className="frame-ornate rounded-xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">📜</span>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-gold-gradient">
            Reglas
          </span>
        </span>
        <span
          className="font-display text-xs text-muted-foreground transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="space-y-5 border-t border-gold/40 px-5 py-5 text-sm">
          {/* Read-only summary */}
          <div className="grid gap-3 text-foreground/90 sm:grid-cols-2">
            <RuleLine label="Vidas por ronda" value={`${rules.maxWrong} runas`} />
            <RuleLine
              label="Errores por pista"
              value={`1 fragmento cada ${rules.errorsPerHint} ${
                rules.errorsPerHint === 1 ? "error" : "errores"
              }`}
            />
            <RuleLine
              label="Hitos de racha"
              value={rules.milestones.join(" · ")}
            />
            <RuleLine label="Recompensa" value="+1 fragmento por hito" />
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="mb-3 font-display text-xs uppercase tracking-widest text-muted-foreground">
              Personalizar
            </h3>

            {/* Errors per hint slider */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="errorsPerHint"
                  className="font-display text-xs uppercase tracking-wider"
                >
                  Errores por pista
                </label>
                <span className="font-display text-base text-hextech-gradient">
                  {rules.errorsPerHint}
                </span>
              </div>
              <input
                id="errorsPerHint"
                type="range"
                min={1}
                max={6}
                step={1}
                value={rules.errorsPerHint}
                onChange={(e) =>
                  update({ errorsPerHint: Number(e.target.value) })
                }
                className="hextech-range w-full"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Cuántos errores debes acumular para ganar 1 fragmento Hextech.
              </p>
            </div>

            {/* Milestones input */}
            <div className="mb-4">
              <label
                htmlFor="milestones"
                className="mb-1 block font-display text-xs uppercase tracking-wider"
              >
                Hitos de racha (separados por coma)
              </label>
              <input
                id="milestones"
                type="text"
                value={milestonesText}
                onChange={(e) => commitMilestones(e.target.value)}
                placeholder="3, 5, 7, 10"
                className="w-full rounded-md border border-gold/40 bg-input px-3 py-2 font-display text-sm text-foreground outline-none transition-colors focus:border-primary focus:glow-gold"
              />
              {error ? (
                <p className="mt-1 text-xs text-destructive">{error}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Al alcanzar cada número de victorias seguidas ganas +1
                  fragmento Hextech bonus.
                </p>
              )}
            </div>

            {/* Max wrong slider */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="maxWrong"
                  className="font-display text-xs uppercase tracking-wider"
                >
                  Vidas (errores permitidos)
                </label>
                <span className="font-display text-base text-hextech-gradient">
                  {rules.maxWrong}
                </span>
              </div>
              <input
                id="maxWrong"
                type="range"
                min={3}
                max={10}
                step={1}
                value={rules.maxWrong}
                onChange={(e) => update({ maxWrong: Number(e.target.value) })}
                className="hextech-range w-full"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Cambiar las vidas reinicia la ronda actual.
              </p>
            </div>

            <button
              onClick={reset}
              className="rounded-md border border-gold/50 px-4 py-1.5 font-display text-xs uppercase tracking-widest text-muted-foreground transition-all hover:text-gold-gradient hover:border-primary"
            >
              Restaurar valores por defecto
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function RuleLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-sm text-gold-gradient">{value}</span>
    </div>
  );
}
