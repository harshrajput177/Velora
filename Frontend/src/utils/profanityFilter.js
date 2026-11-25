/**
 * VELORA CLEAN PLATFORM - PROFANITY & HARASSMENT FILTER
 * File: Frontend/src/utils/profanityFilter.js
 * 
 * Protects users by preventing abusive, vulgar, sexual, or derogatory comments
 * from ever being submitted or displayed on Velora.
 */

// Normalized list of vulgar, abusive, derogatory, and sexually explicit words
// covers Hindi, Hinglish, and English slurs.
const BANNED_PATTERNS = [
  // Hindi / Hinglish sexual & vulgar slurs
  /\bchutiya\b/i,
  /\bchutiye\b/i,
  /\bchoot\b/i,
  /\bchut\b/i,
  /\bchudai\b/i,
  /\bchodo\b/i,
  /\bchod\b/i,
  /\blund\b/i,
  /\blauda\b/i,
  /\bloda\b/i,
  /\blouda\b/i,
  /\bgaand\b/i,
  /\bgand\b/i,
  /\bgandu\b/i,
  /\bgaandu\b/i,
  /\bmadarchod\b/i,
  /\bmadarchodd\b/i,
  /\bmadar\s*chod\b/i,
  /\bmaderchod\b/i,
  /\bbhenchod\b/i,
  /\bbehenchod\b/i,
  /\bbhen\s*chod\b/i,
  /\bbsdk\b/i,
  /\bbhosdike\b/i,
  /\bbhosadi\b/i,
  /\brandi\b/i,
  /\brondee\b/i,
  /\brndi\b/i,
  /\bharami\b/i,
  /\bharamee\b/i,
  /\bkutta\b/i,
  /\bkutti\b/i,
  /\bsaala\b/i,
  /\bsaali\b/i,
  /\bkamina\b/i,
  /\bkamine\b/i,
  /\bchuchi\b/i,
  /\bchuchiya\b/i,
  /\bboobs\b/i,
  /\bboob\b/i,
  /\bnude\b/i,
  /\bnudes\b/i,
  /\bnanga\b/i,
  /\bnangi\b/i,
  /\bmuth\b/i,
  /\bmutthal\b/i,
  /\bsex\b/i,
  /\bsexy\b/i,
  /\bsexxx\b/i,
  /\bporn\b/i,
  /\bporno\b/i,
  /\bcallgirl\b/i,
  /\bescort\b/i,
  /\bprostitute\b/i,
  /\bprostitution\b/i,
  /\bdildo\b/i,

  // English profanities & abusive slurs
  /\bfuck\b/i,
  /\bfucking\b/i,
  /\bfucker\b/i,
  /\bf\*ck\b/i,
  /\bbitch\b/i,
  /\bbitches\b/i,
  /\bb\*tch\b/i,
  /\basshole\b/i,
  /\bass\b/i,
  /\bbastard\b/i,
  /\bslut\b/i,
  /\bwhore\b/i,
  /\bdick\b/i,
  /\bpussy\b/i,
  /\bcunt\b/i,
  /\bcock\b/i,
  /\btits\b/i,
  /\bnigger\b/i,
  /\bnigga\b/i,
  /\bshit\b/i
];

// Leetspeak & character normalization
const normalizeText = (text = "") => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/[7+]/g, "t")
    .replace(/[\*\.\_\-\#]/g, ""); // strip masked separators like ch*tiya -> chutiya
};

/**
 * Checks if a comment contains prohibited or vulgar language.
 * @param {string} text 
 * @returns {{ hasProfanity: boolean, flaggedWords: string[], message: string | null }}
 */
export const checkProfanity = (text = "") => {
  if (!text || typeof text !== "string") {
    return { hasProfanity: false, flaggedWords: [], message: null };
  }

  const rawCleaned = text.toLowerCase();
  const normalized = normalizeText(text);
  const flaggedWords = [];

  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(rawCleaned) || pattern.test(normalized)) {
      const match = rawCleaned.match(pattern) || normalized.match(pattern);
      if (match && match[0]) {
        flaggedWords.push(match[0]);
      }
    }
  }

  const uniqueFlagged = [...new Set(flaggedWords)];

  if (uniqueFlagged.length > 0) {
    return {
      hasProfanity: true,
      flaggedWords: uniqueFlagged,
      message: `Inappropriate language detected. Velora is a respectful platform for verified friendship and companion meetups. Please remove offensive or vulgar words.`
    };
  }

  return {
    hasProfanity: false,
    flaggedWords: [],
    message: null
  };
};

/**
 * Secondary safety filter: Replaces any inappropriate words with asterisks (***).
 * @param {string} text 
 * @returns {string} Sanitized string
 */
export const sanitizeComment = (text = "") => {
  if (!text) return "";
  let sanitized = text;
  for (const pattern of BANNED_PATTERNS) {
    sanitized = sanitized.replace(new RegExp(pattern, "gi"), (matched) => "*".repeat(matched.length));
  }
  return sanitized;
};
