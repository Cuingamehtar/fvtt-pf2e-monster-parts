import fs from "node:fs";
import path from "node:path";
import { compilePack } from "@foundryvtt/foundryvtt-cli";

const renewDirectory = (path) => {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
    }
    fs.mkdirSync(path);
};

const root = process.cwd();
const manifest = JSON.parse(
    fs.readFileSync(path.resolve(root, "module.json"), "utf-8"),
);
const packs = manifest.packs.filter((p) => !p.name.includes("sf2e"));

for (const pack of packs) {
    await compilePack(
        path.resolve(root, pack.path, "_source"),
        path.resolve(root, pack.path),
    );
    const sf2ePack = manifest.packs.find((p) => p.name === `${pack.name}-sf2e`);
    if (sf2ePack) {
        renewDirectory(path.resolve(root, sf2ePack.path));
        renewDirectory(path.resolve(root, sf2ePack.path, "_source"));

        fs.readdirSync(path.resolve(root, pack.path, "_source")).map((f) => {
            const content = fs.readFileSync(
                path.resolve(root, pack.path, "_source", f),
                "utf-8",
            );
            const data = JSON.parse(content);
            data._stats.systemId = "sf2e";
            fs.writeFileSync(
                path.resolve(root, sf2ePack.path, "_source", f),
                JSON.stringify(data),
            );
        });

        await compilePack(
            path.resolve(root, sf2ePack.path, "_source"),
            path.resolve(root, sf2ePack.path),
        );

        fs.rmSync(path.resolve(root, sf2ePack.path, "_source"), {
            recursive: true,
        });
    }
}

const packDir = path.resolve(process.cwd(), "packs");
const subDirs = fs
    .readdirSync(packDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.includes("sf2e"))
    .map((d) => path.resolve(packDir, d.name));

for (const dir of subDirs) {
    const sourceDir = path.resolve(dir, "_source");
    await compilePack(sourceDir, dir);
}
