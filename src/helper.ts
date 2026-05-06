import fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function copyTemplate(
	sourceRelativePath: string,
	destFilePath: string,
) {
	const sourcePath = join(__dirname, "..", "src", sourceRelativePath);
	try {
		await fs.copyFile(sourcePath, destFilePath);
	} catch (err) {
		p.log.error(
			`Failed to copy ${sourceRelativePath} to ${destFilePath}\n${err}`,
		);
	}
}
