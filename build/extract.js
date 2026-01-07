import fs from "node:fs";
import path from "node:path";
import { extractPack } from "@foundryvtt/foundryvtt-cli";

const root = process.cwd();
const manifest = JSON.parse(
    fs.readFileSync(path.resolve(root, "module.json"), "utf-8"),
);
const packs = manifest.packs.filter((p) => !p.name.includes("sf2e"));

for (const pack of packs) {
    const dir = path.resolve(root, pack.path);
    const sourceDir = path.resolve(root, pack.path, "_source");
    if (fs.existsSync(sourceDir)) {
        fs.rmSync(sourceDir, { recursive: true, force: true });
    }
    fs.mkdirSync(sourceDir);
    await extractPack(dir, sourceDir);
}
