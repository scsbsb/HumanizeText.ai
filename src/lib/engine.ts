/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Heuristic-based AI Detection and Humanization Engine

export interface AnalysisResult {
  score: number;
  factors: {
    sentenceUniformity: number;
    vocabularyDiversity: number;
    transitionOveruse: number;
    repetitionStarters: number;
    paragraphUniformity: number;
    passiveVoice: number;
    clicheDensity: number;
    burstiness: number;
  };
  sentenceScores: { text: string; score: number }[];
}

// Factor 3: Transition Words
const AI_TRANSITIONS = [
  "furthermore", "moreover", "additionally", "in conclusion",
  "it's worth noting", "it's important to", "however", "therefore",
  "consequently", "nevertheless", "in addition", "significantly",
  "ultimately", "notably", "specifically", "essentially", "arguably",
  "it should be noted", "as such", "in light of", "consequently"
];

// Factor 7: Cliques & Filler
const AI_CLICHES = [
  "in today's world", "in this article", "let's dive in",
  "when it comes to", "at the end of the day", "it goes without saying",
  "in the realm of", "one might argue", "it's crucial to",
  "plays a vital role", "in order to", "serves as a",
  "aims to", "in the ever-evolving", "landscape of",
  "it should be noted", "delve into", "navigate the",
  "leverage", "foster", "holistic", "paradigm", "synergy",
  "cutting-edge", "state-of-the-art", "groundbreaking"
];

// Humanizer Replacements
export const HUMANIZER_REPLACEMENTS: Record<string, string[]> = {
  "furthermore": ["plus", "also", "and", "another thing is"],
  "moreover": ["on top of that", "and honestly", "what's more"],
  "additionally": ["another thing—", "oh, and", "also"],
  "however": ["but", "then again", "that said", "even so"],
  "therefore": ["so", "that's why", "because of that"],
  "in conclusion": ["all in all", "bottom line", "basically"],
  "it's worth noting": ["here's the thing", "one thing to remember"],
  "consequently": ["because of that", "so"],
  "nevertheless": ["still", "even so", "regardless"],
  "in addition": ["also", "and", "plus"],
  "in today's world": ["these days", "right now", "lately"],
  "it is important to note": ["one thing to keep in mind", "don't forget that"],
  "plays a vital role": ["really matters", "is a big deal", "is key"],
  "in order to": ["to"],
  "delve into": ["look at", "dig into", "explore"],
  "navigate the": ["deal with", "figure out", "handle"],
  "leverage": ["use", "make use of"],
  "foster": ["help", "encourage"],
  "holistic": ["full", "complete"],
  "paradigm": ["model", "way of thinking"],
  "synergy": ["teamwork", "working together"],
  "cutting-edge": ["new", "modern", "advanced"],
  "state-of-the-art": ["modern", "brand new"],
  "groundbreaking": ["impressive", "new"],
  "it should be noted": ["keep in mind", "also"],
  "aims to": ["wants to", "tries to"],
  "significantly": ["a lot", "greatly"],
  "ultimately": ["finally", "in the end"],
  "notably": ["especially", "interestingly"],
  "specifically": ["in particular"],
  "essentially": ["basically"],
  "arguably": ["maybe", "potentially"],
};

export function analyzeText(text: string): AnalysisResult {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const words = text.toLowerCase().match(/\w+/g) || [];
  
  if (words.length === 0) {
    return {
      score: 0,
      factors: {
        sentenceUniformity: 0, vocabularyDiversity: 0, transitionOveruse: 0,
        repetitionStarters: 0, paragraphUniformity: 0, passiveVoice: 0,
        clicheDensity: 0, burstiness: 0
      },
      sentenceScores: []
    };
  }

  // Helper: Standard Deviation
  const stdev = (arr: number[]) => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
  };

  // Factor 1: Sentence Length Uniformity
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const sentLengthStdev = stdev(sentenceLengths);
  let f1 = 0;
  if (sentLengthStdev < 3) f1 = 95;
  else if (sentLengthStdev > 8) f1 = 20;
  else f1 = 95 - ((sentLengthStdev - 3) * (75 / 5));

  // Factor 2: Vocabulary Diversity (TTR)
  const uniqueWords = new Set(words);
  const ttr = uniqueWords.size / words.length;
  let f2 = 50; // default
  if (ttr >= 0.45 && ttr <= 0.55) f2 = 90;
  else if (ttr > 0.75 || ttr < 0.3) f2 = 20;
  else f2 = 50;

  // Factor 3: Transition Word Overuse
  let transitionsCount = 0;
  AI_TRANSITIONS.forEach(t => {
    const regex = new RegExp(`\\b${t}\\b`, 'gi');
    transitionsCount += (text.match(regex) || []).length;
  });
  const transDensity = (transitionsCount / words.length) * 100;
  let f3 = Math.min(100, transDensity * 25); // 4% density = 100 score

  // Factor 4: Repetitive Sentence Starters
  const starters = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase());
  const starterCounts: Record<string, number> = {};
  starters.forEach(s => { if (s) starterCounts[s] = (starterCounts[s] || 0) + 1; });
  let maxRepeated = 0;
  Object.values(starterCounts).forEach(v => { if (v > maxRepeated) maxRepeated = v; });
  let f4 = Math.min(100, (maxRepeated / sentences.length) * 100);

  // Factor 5: Paragraph Structure Uniformity
  const paraLengths = paragraphs.map(p => p.trim().split(/\s+/).length);
  const paraLengthStdev = paragraphs.length > 1 ? stdev(paraLengths) : 5;
  let f5 = paraLengthStdev < 5 ? 80 : 20;

  // Factor 6: Passive Voice
  const passivePatterns = text.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/gi) || [];
  const passiveDensity = (passivePatterns.length / words.length) * 100;
  let f6 = Math.min(100, passiveDensity * 40);

  // Factor 7: Cliche & Filler
  let clicheCount = 0;
  AI_CLICHES.forEach(c => {
    const regex = new RegExp(`\\b${c}\\b`, 'gi');
    clicheCount += (text.match(regex) || []).length;
  });
  let f7 = Math.min(100, (clicheCount / words.length) * 500); // 1 cliche per 50 words = 100 score

  // Factor 8: Burstiness
  const lengthDiffs = [];
  for (let i = 1; i < sentenceLengths.length; i++) {
    lengthDiffs.push(Math.abs(sentenceLengths[i] - sentenceLengths[i-1]));
  }
  const burstVariance = lengthDiffs.length > 0 ? stdev(lengthDiffs) : 0;
  let f8 = burstVariance < 2 ? 90 : 20;

  // Final Weighted Score
  const weightedScore = (
    f1 * 0.20 +
    f2 * 0.15 +
    f3 * 0.15 +
    f4 * 0.15 +
    f5 * 0.10 +
    f6 * 0.10 +
    f7 * 0.10 +
    f8 * 0.05
  );

  // Sentence highlighting
  const sentenceScores = sentences.map(s => {
    const sWords = s.toLowerCase().match(/\w+/g) || [];
    let sScore = weightedScore; // Default to base score
    // Add micro-penalties for transitions/cliches in sentence
    let sCliches = 0;
    AI_CLICHES.forEach(c => { if (s.toLowerCase().includes(c)) sCliches++; });
    AI_TRANSITIONS.forEach(t => { if (s.toLowerCase().includes(t)) sCliches++; });
    if (sCliches > 0) sScore += 20;
    
    // Add micro-bonus for extreme lengths
    if (sWords.length < 5 || sWords.length > 25) sScore -= 15;
    
    return { text: s, score: Math.max(0, Math.min(100, sScore)) };
  });

  return {
    score: Math.max(0, Math.min(100, weightedScore)),
    factors: {
      sentenceUniformity: f1,
      vocabularyDiversity: f2,
      transitionOveruse: f3,
      repetitionStarters: f4,
      paragraphUniformity: f5,
      passiveVoice: f6,
      clicheDensity: f7,
      burstiness: f8
    },
    sentenceScores
  };
}

export function humanizeText(text: string): { original: string; humanized: string; diff: { type: 'added' | 'removed' | 'same', value: string }[] } {
  let processed = text;
  const diff: { type: 'added' | 'removed' | 'same', value: string }[] = [];

  // Helper: Apply replacements
  Object.keys(HUMANIZER_REPLACEMENTS).forEach(formula => {
    const alternatives = HUMANIZER_REPLACEMENTS[formula];
    const regex = new RegExp(`\\b${formula}\\b`, 'gi');
    
    // This is a naive diffing for demo purposes
    // In a real app we would use a more robust diffing lib
    processed = processed.replace(regex, (match) => {
      const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
      return replacement;
    });
  });

  // Convert "do not" to "don't" etc
  const contractions: Record<string, string> = {
    "do not": "don't",
    "cannot": "can't",
    "it is": "it's",
    "there is": "there's",
    "we are": "we're",
    "they are": "they're",
    "I am": "I'm",
  };

  Object.entries(contractions).forEach(([long, short]) => {
    const regex = new RegExp(`\\b${long}\\b`, 'gi');
    processed = processed.replace(regex, short);
  });

  // Random human touches
  const humanPhrases = ["honestly", "to be fair", "here's the thing", "actually"];
  const sentRegex = /([^.!?]+[.!?]+)/g;
  let sentenceIndex = 0;
  processed = processed.replace(sentRegex, (match) => {
    sentenceIndex++;
    if (sentenceIndex % 5 === 0 && Math.random() > 0.5) {
      const phrase = humanPhrases[Math.floor(Math.random() * humanPhrases.length)];
      return ` ${phrase}, ${match.trim()}`;
    }
    return match;
  });

  // Simple diff highlighting (words based)
  const oldWords = text.split(/\s+/);
  const newWords = processed.split(/\s+/);
  
  // For the sake of this tool, we'll just show the final humanized text 
  // and a mockup diff if we can't do a full LCS diff easily.
  // We'll return the humanized text.
  
  return {
    original: text,
    humanized: processed,
    diff: [{ type: 'same', value: processed }] // Simplified for now
  };
}
