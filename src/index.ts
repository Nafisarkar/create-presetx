#!/usr/bin/env node
import fs from "node:fs/promises";
import { join } from "node:path";
import * as p from "@clack/prompts";
import { execa } from "execa";
import color from "picocolors";
import { copyTemplate } from "./helper.js";

async function main() {
	console.clear();
	p.intro(`${color.bgCyan(color.black(" Create React App "))}`);
	const project = await p.group(
		{
			path: () => {
				return p.text({
					message: "Where should we create your project?",
					placeholder: "./my-app",
					defaultValue: "./my-app",
				});
			},
			runtime: () =>
				p.select({
					message: "Runtime:",
					options: [
						{ value: "bun", label: "Bun" },
						{ value: "npm", label: "Npm" },
					],
				}),

			router: ({ results }) =>
				p.select({
					message: `Pick a Router for ${color.cyan(results.path)}`,
					options: [
						{ value: "react-router", label: "React Router" },
						{ value: "tanstack", label: "TanStack Router" },
					],
				}),

			tailwind: () =>
				p.confirm({
					message: "Add Tailwind CSS?",
					initialValue: true,
				}),
			ui: ({ results }) => {
				if (!results.tailwind) return;
				return p.select({
					message: "Components Library:",
					options: [
						{ value: "shadcn", label: "ShadcnUI" },
						{ value: "daisy", label: "Daisy UI" },
						{ value: "none", label: "None" },
					],
				});
			},
			icons: () =>
				p.select({
					message: "Icon Library:",
					options: [
						{ value: "lucide", label: "Lucide React" },
						{ value: "remix", label: "Remix Library" },
						{ value: "none", label: "None" },
					],
				}),
			formatter: () =>
				p.select({
					message: "Choose a Formatter:",
					options: [
						{ value: "biome", label: "Biome" },
						{ value: "none", label: "None" },
					],
				}),
		},
		{
			onCancel: () => {
				p.cancel("Operation cancelled.");
				process.exit(0);
			},
		},
	);

	const s = p.spinner();
	s.start("Scaffolding Vite template...");
	const { path, runtime, router, tailwind, ui, icons, formatter } = project;
	const installCmd = runtime === "bun" ? "add" : "install";

	try {
		const extraPeramter = runtime === "bun" ? "" : "--";

		await execa(runtime, [
			"create",
			"vite@latest",
			path,
			extraPeramter,
			"--template",
			"react-compiler-ts",
		]);

		s.message("Configuring templates and routing...");
		// Build the dependency list
		const dependencies = [];
		const devDependencies = [];
		const targetSrcDir = join(path, "src");

		// Cleaning
		await fs.rm(join(targetSrcDir, "App.css"), { force: true });
		await fs.rm(join(targetSrcDir, "App.tsx"), { force: true });

		if (router === "react-router") {
			await copyTemplate(
				"templates/react_router/main.tsx",
				join(targetSrcDir, "main.tsx"),
			);
			await copyTemplate(
				"templates/react_router/App.tsx",
				join(targetSrcDir, "App.tsx"),
			);
			await copyTemplate(
				"templates/react_router/routes.tsx",
				join(targetSrcDir, "routes.tsx"),
			);
			await fs.writeFile(join(targetSrcDir, "index.css"), "");
			dependencies.push("react-router");
		}
		if (router === "tanstack") {
			dependencies.push("@tanstack/react-router");
			dependencies.push("@tanstack/react-router-devtools");
			devDependencies.push("@tanstack/router-plugin");

			// Create a route folder inside src
			await fs.mkdir(join(targetSrcDir, "routes"), { recursive: true });
			await copyTemplate(
				"templates/tanstack_router/routes/__root.tsx",
				join(join(targetSrcDir, "routes"), "__root.tsx"),
			);
			await copyTemplate(
				"templates/tanstack_router/routes/index.tsx",
				join(join(targetSrcDir, "routes"), "index.tsx"),
			);
			await copyTemplate(
				"templates/tanstack_router/index.css",
				join(targetSrcDir, "index.css"),
			);
			await copyTemplate(
				"templates/tanstack_router/main.tsx",
				join(targetSrcDir, "main.tsx"),
			);

			await fs.rm(join(path, "vite.config.ts"), { force: true });
			await copyTemplate(
				"templates/tanstack_router/vite.config.ts",
				join(path, "vite.config.ts"),
			);
		}

		if (tailwind) {
			if (router === "react-router") {
				// replace the vite.config.ts
				await fs.rm(join(path, "vite.config.ts"), { force: true });
				await fs.rm(join(targetSrcDir, "index.css"), { force: true });
				await fs.rm(join(targetSrcDir, "App.tsx"), { force: true });

				await copyTemplate(
					"templates/tailwind/react_router/vite.config.ts",
					join(path, "vite.config.ts"),
				);
				await copyTemplate(
					"templates/tailwind/react_router/index.css",
					join(targetSrcDir, "index.css"),
				);
				await copyTemplate(
					"templates/tailwind/react_router/App.tsx",
					join(targetSrcDir, "App.tsx"),
				);
			}
			if (router === "tanstack") {
				await fs.rm(join(path, "vite.config.ts"), { force: true });
				await fs.rm(join(targetSrcDir, "index.css"), { force: true });
				await fs.rm(join(join(targetSrcDir, "routes"), "index.tsx"), {
					force: true,
				});
				await copyTemplate(
					"templates/tailwind/tanstack_router/index.css",
					join(targetSrcDir, "index.css"),
				);
				await copyTemplate(
					"templates/tailwind/tanstack_router/vite.config.ts",
					join(path, "vite.config.ts"),
				);
				await copyTemplate(
					"templates/tailwind/tanstack_router/index.tsx",
					join(join(targetSrcDir, "routes"), "index.tsx"),
				);
			}
			dependencies.push("tailwindcss", "@tailwindcss/vite");
		}

		if (ui === "shadcn") {
			// Shadcn usually requires a separate CLI init, but we add the base
			dependencies.push(
				"class-variance-authority",
				"clsx",
				"lucide-react",
				"tailwind-merge",
				"tailwindcss-animate",
			);
			devDependencies.push("@types/node");

			// Create the lib directory and add utils.ts
			await fs.mkdir(join(targetSrcDir, "lib"), { recursive: true });
			await copyTemplate(
				"templates/shadcn/utils.ts",
				join(targetSrcDir, "lib/utils.ts"),
			);

			// Add components.json so the Shadcn CLI knows where to put future components
			await copyTemplate(
				"templates/shadcn/components.json",
				join(path, "components.json"),
			);

			// Overwrite tsconfig.app.json to support the mandatory "@/*" path alias
			await copyTemplate(
				"templates/shadcn/tsconfig.json",
				join(path, "tsconfig.json"),
			);
			await copyTemplate(
				"templates/shadcn/tsconfig.app.json",
				join(path, "tsconfig.app.json"),
			);
		}
		if (ui === "daisy") {
			// await fs.rm(join(targetSrcDir, "App.tsx"), { force: true });
			await copyTemplate(
				"templates/daisyui/index.css",
				join(targetSrcDir, "index.css"),
			);
			dependencies.push("daisyui@latest");
		}

		if (icons === "lucide") dependencies.push("lucide-react");
		if (icons === "remix") dependencies.push("remixicon");

		if (formatter === "biome") {
			await copyTemplate(
				"templates/biome/biome.json",
				join(path, "biome.json"),
			);
			devDependencies.push("@biomejs/biome");
		}

		const totalDeps = dependencies.length + devDependencies.length;
		if (totalDeps > 0)
			s.message(`Installing ${totalDeps} packages via ${runtime}...`);
		if (dependencies.length > 0) {
			await execa(runtime, [installCmd, ...dependencies], {
				cwd: path,
				// stdout: "inherit",
				// stderr: "inherit",
			});
		}

		if (devDependencies.length > 0) {
			await execa(runtime, [installCmd, "-D", ...devDependencies], {
				cwd: path,
				// stdout: "inherit",
				// stderr: "inherit",
			});
		}

		s.stop("Project scaffolded successfully!");

		if (dependencies.length > 0) {
			p.log.step(`${color.cyan("Dependencies:")} ${dependencies.join(", ")}`);
		}
		if (devDependencies.length > 0) {
			p.log.step(
				`${color.blue("Dev Dependencies:")} ${devDependencies.join(", ")}`,
			);
		}
	} catch (error) {
		s.stop("Installation failed");
		p.log.error(color.red(String(error)));
		process.exit(1);
	}

	const nextSteps = `cd ${project.path}\n${runtime} run dev`;

	p.note(nextSteps, "Next steps:");
	p.outro(`Good luck with your project! 🚀`);
}
main();
