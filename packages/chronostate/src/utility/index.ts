import { createHash } from "crypto";

export function base64ToArrayBuffer(base64: string) {
    const binary_string = atob ? atob(base64) : window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes;
}

export function toHex(data: Uint8Array): string {
    let out = '';
    for (const byte of data) {
        out += ('0' + byte.toString(16)).slice(-2);
    }
    return out;
}

export function sha256(uint8Array: Uint8Array) {
    return createHash("sha256").update(Buffer.from(uint8Array)).digest();
}

export function decodeUnicode(str: string) {
    return str.replace(/\\u([\dA-Fa-f]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
};