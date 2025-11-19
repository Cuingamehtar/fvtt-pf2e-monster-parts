import * as esbuild from "esbuild";
import * as fs from "fs";
import { combineLocalizations } from "./pack-localizations.js";

async function startWatch() {
    let ctx = await esbuild.context({
        entryPoints: ["src/module.ts"],
        outfile: "scripts/module.js",
        bundle: true,
        keepNames: true,
        sourcemap: true,
        plugins: [
            {
                name: "watch-notify",
                setup(build) {
                    build.onEnd((par) => {
                        if (par.errors.length === 0) {
                            console.log(
                                `(${new Date(Date.now()).toLocaleTimeString()}) Build successful`,
                            );
                        }
                    });
                },
            },
        ],
        // ... other build options
    });

    await ctx.watch();
    console.log("watching...");
}

combineLocalizations();
fs.watch("./lang/partial", { recursive: true }, (_event, _filename) => {
    combineLocalizations();
});

startWatch();
