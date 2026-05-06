import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden  selection:bg-amber-500/30 font-geist-mono">
			{/* Architectural Grid Background */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none"></div>

			{/* Subtle Amber Glow at the center */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-amber-500/5 blur-[120px] pointer-events-none"></div>

			<div className="z-10 flex flex-col items-center max-w-3xl w-full px-6 text-center">
				{/* Stark Hero Typography */}
				<div className="space-y-6">
					<p className="text-gray-400 text-lg max-w-xl mx-auto font-light tracking-wide ">
						Your <span className="font-bold text-2xl">React</span> environment
						has been initialized. Standard protocol dictates you begin building
						immediately.
					</p>
				</div>

				{/* Sharp Tech Stack Tags */}
				<div className="flex flex-wrap items-center justify-center gap-2 mt-8">
					{["Tailwind", "TenStack Router"].map((tech) => (
						<span
							key={tech}
							className="px-3 py-1 text-xs font-geist-mono uppercase tracking-wider border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-default"
						>
							{tech}
						</span>
					))}
				</div>

				{/* Brutalist Terminal Window */}
				<div className="mt-12 w-full max-w-2xl bg-black border border-white/20 shadow-2xl text-left font-geist-mono">
					{/* Stark Window Header */}
					<div className="flex justify-between items-center border-b border-white/20 px-4 py-2 bg-white/5 text-xs text-gray-500 tracking-widest uppercase">
						<span>Terminal</span>
						<div className="flex gap-4 text-gray-600">
							<span className="cursor-pointer hover:text-white">_</span>
							<span className="cursor-pointer hover:text-white">□</span>
							<span className="cursor-pointer hover:text-amber-500">×</span>
						</div>
					</div>

					{/* Terminal Body */}
					<div className="p-6 space-y-4 text-sm text-gray-300">
						<div className="flex items-start gap-4">
							<span className="text-amber-500 mt-0.5">❯</span>
							<div>
								<span className="text-gray-500"># target identified</span>
								<p className="mt-1">
									Navigate to your source code and initialize modifications.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3">
							<span className="text-amber-500">❯</span>
							<span className="text-white">vim src/App.tsx</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
