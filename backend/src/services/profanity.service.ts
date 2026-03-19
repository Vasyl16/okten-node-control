const bannedWords = ['fuck', 'shit', 'bitch']; // extend as needed

export const hasProfanity = (text: string): boolean => {
  if (text == null || typeof text !== 'string') return false;
  const lower = String(text).trim().toLowerCase();
  if (lower.length === 0) return false;
  return bannedWords.some((w) => lower.includes(w));
};
