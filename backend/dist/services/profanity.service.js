"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasProfanity = void 0;
const bannedWords = ['fuck', 'shit', 'bitch']; // extend as needed
const hasProfanity = (text) => {
    if (text == null || typeof text !== 'string')
        return false;
    const lower = String(text).trim().toLowerCase();
    if (lower.length === 0)
        return false;
    return bannedWords.some((w) => lower.includes(w));
};
exports.hasProfanity = hasProfanity;
