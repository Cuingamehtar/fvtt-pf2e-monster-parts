import * as fs from "fs";
import * as yaml from "yaml";
import showdown from "showdown";
import * as path from "path";

const mdConverter = new showdown.Converter();

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}

export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

function parseFile(path) {
    const content = fs.readFileSync(path, "utf-8");
    if (content === "") return undefined;
    try {
        return !path.endsWith(".yml")
            ? JSON.parse(content)
            : yaml.parse(content, (_k, v) => {
                  if (typeof v === "string") {
                      const html = mdConverter.makeHtml(v);
                      const noP = html.replace(/<\/?p>/g, "");
                      return `<p>${noP}</p>` === html ? noP : html;
                  } else {
                      return v;
                  }
              });
    } catch (e) {
        console.error(`Error when converting file ${path}`, e.message);
        return undefined;
    }
}

function parsePartialLocalizations(dir) {
    const entries = fs
        .readdirSync(dir, { withFileTypes: true })
        .sort((a, b) => {
            const d = a.isDirectory() - b.isDirectory();
            return d !== 0 ? d : a.name.localeCompare(b.name);
        });
    return entries.reduce((acc, cur) => {
        const p = path.join(cur.path, cur.name);
        if (cur.isDirectory()) {
            const data = parsePartialLocalizations(p);
            if (Object.keys(data).length > 0)
                return mergeDeep(acc, { [cur.name]: data });
        } else {
            return mergeDeep(acc, {
                [cur.name.split(".").slice(0, -1).join(".")]: parseFile(p),
            });
        }
        return acc;
    }, {});
}

function debounce(func, delay) {
    let timeoutId; // This will hold the timer ID

    return function (...args) {
        const context = this; // Preserve the 'this' context

        clearTimeout(timeoutId); // Clear any existing timer

        timeoutId = setTimeout(() => {
            func.apply(context, args); // Execute the original function after the delay
        }, delay);
    };
}

function combineLocalizationsInner() {
    const partial = parsePartialLocalizations("./lang/partial");
    fs.writeFileSync(
        "./lang/en.json",
        JSON.stringify(mergeDeep({}, partial), null, 2),
    );
    console.log(
        `(${new Date(Date.now()).toLocaleTimeString()}) Localizations combined`,
    );
}

export const combineLocalizations = debounce(combineLocalizationsInner, 1000);
