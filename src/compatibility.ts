export class Compatibility {
    static isV14: boolean;
}

declare global {
    const _del: unknown;
    const _replace: (value: unknown) => unknown;
}

export function deleteKey(key: string): Record<string, unknown> {
    if (Compatibility.isV14) {
        return { [key]: _del };
    }
    return { [`-=${key}`]: null };
}

export function replaceKey(
    key: string,
    value: unknown,
): Record<string, unknown> {
    if (Compatibility.isV14) {
        return { [key]: _replace(value) };
    }
    return { [`==${key}`]: value };
}
