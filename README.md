#  create-presetx

A lightning-fast, interactive CLI to scaffold modern React applications.

Built with **Bun** and powered by the new **Vite React Compiler**, `create-presetx` gets you past the boring setup phase and straight into building. It handles the complex plumbing of routers, Tailwind, and UI libraries so you don't have to.

## Features

- ⚡️ **Vite + React Compiler:** Uses the bleeding-edge `react-compiler-ts` template out of the box.
- 🛣️ **Routing Ready:** Choose between standard **React Router** or full-typesafe **TanStack Router**.
- 🎨 **Styling & UI:** Instant setup for **Tailwind CSS**, pre-configured for either **Shadcn UI** (with path aliases and utils ready to go) or **DaisyUI**.
- 📦 **Runtime Freedom:** Choose to install your dependencies via `bun` or `npm`.
- 🪄 **Zero-Config Tooling:** Add **Biome** for instant formatting and linting, and choose between **Lucide** or **Remix** icons.

## 📦 Usage

You don't need to install anything globally. Just run the initialization command with your preferred package manager:

### Using Bun (Recommended)
```bash
bun create presetx
