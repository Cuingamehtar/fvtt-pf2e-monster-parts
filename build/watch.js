import * as esbuild from "esbuild";
import * as fs from "fs";
import { combineLocalizations } from "./pack-localizations.js";

let time = Date.now();

async function startWatch() {
    let ctx = await esbuild.context({
        entryPoints: ["src/module.ts"],
        outfile: "scripts/module.js",
        bundle: true,
        define: {
            DEBUG: "true",
        },
        keepNames: true,
        sourcemap: true,
        plugins: [
            {
                name: "watch-notify",
                setup(build) {
                    build.onStart(() => {
                        time = Date.now();
                    });
                    build.onEnd((par) => {
                        if (par.errors.length === 0) {
                            const dt = Date.now() - time;
                            console.log(
                                `(${new Date(Date.now()).toLocaleTimeString()}, elapsed: ${Math.floor(dt / 1000)}.${dt % 1000} s) Build successful`,
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
