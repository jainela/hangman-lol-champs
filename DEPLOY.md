# Deploy a GitHub Pages

Este proyecto incluye un workflow de GitHub Actions (`.github/workflows/deploy.yml`)
que construye el sitio y lo publica automáticamente en GitHub Pages cada vez que
haces push a la rama `main`.

## ⚠️ Importante

El proyecto usa **TanStack Start** con SSR/Cloudflare Workers. GitHub Pages solo
sirve archivos **estáticos**, por lo que:

- ✅ El juego del ahorcado funciona perfectamente (es 100% cliente).
- ❌ Cualquier *server function* o ruta `/api/*` que añadas en el futuro **NO**
  funcionará en GitHub Pages. Para esas, despliega en Cloudflare/Vercel.

## Pasos para activarlo

1. Conecta tu proyecto Lovable a GitHub (botón **GitHub → Connect** en Lovable).
2. En tu repo de GitHub: **Settings → Pages → Build and deployment → Source**:
   selecciona **GitHub Actions**.
3. Haz un push a `main` (o ejecuta el workflow manualmente desde la pestaña
   **Actions**).
4. Tu juego estará disponible en:
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`

## Variable BASE_PATH

El workflow inyecta automáticamente `BASE_PATH=/<nombre-del-repo>/` durante el
build para que las rutas de assets funcionen bajo el sub-path de GitHub Pages.

Si despliegas en un dominio raíz (ej. `usuario.github.io`), edita el workflow y
pon `BASE_PATH: /`.
