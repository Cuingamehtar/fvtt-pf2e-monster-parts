import { ModuleManifestFlags } from "./types";
import { MODULE_ID } from "./module";

export async function loadHomebrewMaterials() {
    if (game.user.isActiveGM) await registerHomebrewFiles();

    const files = (game.settings.get(MODULE_ID, "homebrew-files") ??
        []) as string[];
    return await Promise.all(
        files.map(async (f) => {
            const json = await foundry.utils.fetchJsonWithTimeout(f);
            return Array.isArray(json) ? json : [json];
        }),
    ).then((arr) => arr.flatMap((e) => e));
}

async function registerHomebrewFiles() {
    const worldPath = `worlds/${game.world.id}`;
    const homebrewFiles = [];

    // module files
    for (const m of game.modules.values()) {
        if (!m.active) continue;
        const files = (m.flags[MODULE_ID] as ModuleManifestFlags)
            ?.homebrewFiles;
        if (!files) continue;
        const modulePath = `modules/${m.id}`;
        for (const f of files) {
            homebrewFiles.push(
                f
                    .replaceAll("@world", worldPath)
                    .replaceAll("@module", modulePath),
            );
        }
    }

    // world files
    {
        // @ts-expect-error
        const files = (game.world.flags[MODULE_ID] as ModuleManifestFlags)
            ?.homebrewFiles;
        if (files) {
            for (const f of files) {
                homebrewFiles.push(f.replaceAll("@world", worldPath));
            }
        }
    }

    const settingsPath = game.settings.get(MODULE_ID, "homebrew-folder") as
        | string
        | undefined;
    if (settingsPath) {
        const files = (
            await foundry.applications.apps.FilePicker.implementation.browse(
                "data",
                settingsPath.replaceAll("@world", worldPath),
            )
        ).files;
        homebrewFiles.push(...files);
    }
    const oldHomebrew = game.settings.get(MODULE_ID, "homebrew-files") as
        | string[]
        | undefined;

    if (!areArraysEqual(oldHomebrew ?? [], homebrewFiles)) {
        await game.settings.set(MODULE_ID, "homebrew-files", homebrewFiles);
    }
}

function areArraysEqual<T>(arr1: T[], arr2: T[]) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
