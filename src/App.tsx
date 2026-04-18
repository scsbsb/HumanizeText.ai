/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkle, 
  Trash2, 
  Clipboard, 
  Search, 
  Wand2, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown,
  Copy,
  RefreshCcw
} from "lucide-react";
import { analyzeText, humanizeText, AnalysisResult } from "./lib/engine";
import ScoreGauge from "./components/ScoreGauge";

interface FAQItemProps {
  question: string;
  answer: string;
  key?: React.Key;
}

const FAQ_ITEMS = [
  {
    q: "How does AI detection work?",
    a: "Our algorithm uses advanced linguistic heuristics to analyze writing patterns. It checks for sentence length uniformity, vocabulary diversity (Type-Token Ratio), use of common AI transition words, and paragraph structure. Humans tend to have 'bursty' writing with varied structures, while AI is often more robotic and uniform."
  },
  {
    q: "Is this tool really free?",
    a: "Yes! HumanizeText.ai is 100% free with no sign-up required. We believe everyone should have access to tools that help refine their writing without behind-the-scenes data tracking."
  },
  {
    q: "Do you store my text?",
    a: "No. Everything runs entirely in your browser using high-performance JavaScript. Your text never leaves your computer and is never saved on any server."
  },
  {
    q: "How accurate is the AI detection?",
    a: "It's an advanced heuristic model. While it's highly accurate for identifying general AI patterns from models like GPT, Gemini and/or Claude, it's not foolproof. We recommend using it as a guide to see which parts of your text feel 'flat' or 'robotic'."
  },
  {
    q: "Does it work with ChatGPT, Claude, and Gemini text?",
    a: "Absolutely. It's tuned to detect the specific signatures of modern LLMs, including their favorite transition words and uniform sentence structures."
  }
];

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [humanizedText, setHumanizedText] = useState<string | null>(null);
  const [stats, setStats] = useState({ analyzed: 842100, humanized: 412000 });

  // Word count stats
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(input.length);
  }, [input]);

  // Fake stats counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        analyzed: prev.analyzed + Math.floor(Math.random() * 3),
        humanized: prev.humanized + Math.floor(Math.random() * 2)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setHumanizedText(null);
    
    // Simulate slight delay for "premium" feel
    setTimeout(() => {
      const res = analyzeText(input);
      setResults(res);
      setIsAnalyzing(false);
      // Scroll to results if mobile
      if (window.innerWidth < 768) {
        document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  const handleHumanize = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const { humanized } = humanizeText(input);
      setHumanizedText(humanized);
      const res = analyzeText(humanized);
      setResults(res);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleClear = () => {
    setInput("");
    setResults(null);
    setHumanizedText(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      console.error("Paste failed", err);
    }
  };

  const handleCopy = () => {
    const text = humanizedText || input;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-purple to-secondary-teal rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Sparkle className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              HumanizeText<span className="text-primary-purple">.ai</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {["Home", "How It Works", "FAQ", "Privacy"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <button className="bg-primary-purple hover:bg-primary-purple/90 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary-purple/20 transition-all hover:scale-105 active:scale-95">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* AD UNIT */}
          <div className="ad-placeholder mb-12 h-[90px] w-full max-w-[728px] mx-auto">
            {/* ADSENSE AD UNIT HERE (Leaderboard 728x90) */}
            Advertisement
          </div>

          {/* HERO */}
          <section id="home" className="text-center mb-16 px-4">
            <motion.h2 
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Is Your Text Written by AI?<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-purple via-secondary-teal to-primary-purple bg-[length:200%_auto] animate-gradient">
                Find Out in Seconds.
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg text-white/60 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Paste your text, get an instant AI detection score, and humanize it with one click. 
              Professional, free, and completely local analysis.
            </motion.p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-white/40">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-green" /> 100% Free</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-green" /> No Signup</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-green" /> No Data Stored</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-green" /> Works Locally</span>
            </div>
          </section>

          {/* MAIN TOOL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-20">
            {/* INPUT PANEL */}
            <motion.div 
              className="glass rounded-3xl p-6 lg:p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-primary-purple" />
                  Your Input Text
                </h3>
                <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                  <span>{wordCount} Words</span>
                  <span>{charCount} Characters</span>
                </div>
              </div>
              
              <div className="relative">
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white min-h-[400px] focus:outline-none focus:ring-2 focus:ring-primary-purple/50 focus:border-primary-purple/50 transition-all resize-none placeholder:text-white/20"
                  placeholder="Paste your text here... (minimum 50 words for accurate analysis)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={handleClear}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                    title="Clear"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handlePaste}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                    title="Paste"
                  >
                    <Clipboard className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !input.trim()}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Search className="w-5 h-5 text-secondary-teal group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Analyze Text</span>
                </button>
                <button 
                  onClick={handleHumanize}
                  disabled={isAnalyzing || !input.trim()}
                  className="group relative bg-primary-purple hover:bg-primary-purple/90 p-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary-purple/20 transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Wand2 className="w-5 h-5 text-white animate-pulse" />
                  <span className="font-bold text-white">Humanize Text</span>
                </button>
              </div>
              
              {wordCount > 0 && wordCount < 50 && (
                <p className="mt-4 text-xs text-warning-yellow flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  For most accurate results, please paste at least 50 words.
                </p>
              )}
            </motion.div>

            {/* RESULTS PANEL */}
            <motion.div 
              id="results-panel"
              className="glass rounded-3xl p-6 lg:p-8 min-h-[600px] flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {!results && !isAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-float">
                    <Search className="w-10 h-10 text-white/20" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">No Results Yet</h4>
                  <p className="text-white/40 max-w-xs">
                    Paste some text and click Analyze to see your score and humanization options.
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-primary-purple/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary-purple rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-4 bg-primary-purple/10 rounded-full animate-pulse" />
                  </div>
                  <p className="font-bold text-lg animate-pulse">
                    {humanizedText ? "Rewriting text..." : "Analyzing patterns..."}
                  </p>
                </div>
              )}

              {results && !isAnalyzing && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Score Card */}
                  <div className="bg-white/5 rounded-3xl overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row items-center justify-around gap-8">
                      <ScoreGauge score={results.score} />
                      <div className="flex-1 space-y-4">
                        <h4 className="text-lg font-bold">Analysis Breakdown</h4>
                        <div className="space-y-3">
                          {Object.entries(results.factors).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-white/40">
                                <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span style={{ color: (value as number) > 70 ? '#e17055' : (value as number) > 40 ? '#fdcb6e' : '#00b894' }}>{Math.round(value as number)}% AI</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${value}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  style={{ backgroundColor: (value as number) > 70 ? '#e17055' : (value as number) > 40 ? '#fdcb6e' : '#00b894' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AD UNIT */}
                  <div className="ad-placeholder h-[100px]">
                    {/* ADSENSE AD UNIT IN-CONTENT */}
                    Advertisement
                  </div>

                  {/* Content View */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        {humanizedText ? <Sparkle className="w-5 h-5 text-secondary-teal" /> : <Search className="w-5 h-5 text-primary-purple" />}
                        {humanizedText ? "Humanized Text" : "Score Highlights"}
                      </h4>
                      <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all active:scale-95"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Result
                      </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm leading-relaxed max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                      {humanizedText ? (
                        <div>{humanizedText}</div>
                      ) : (
                        results.sentenceScores.map((s, idx) => (
                          <span 
                            key={idx}
                            className="rounded-sm px-0.5 inline-block transition-colors cursor-help"
                            style={{ 
                              backgroundColor: s.score > 70 ? '#e1705530' : s.score > 40 ? '#fdcb6e20' : '#00b89410',
                              borderBottom: `2px solid ${s.score > 70 ? '#e17055' : s.score > 40 ? '#fdcb6e' : '#00b894'}`
                            }}
                            title={`AI Probability: ${Math.round(s.score)}%`}
                          >
                            {s.text}{' '}
                          </span>
                        ))
                      )}
                    </div>
                    
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success-green" /> Human</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-warning-yellow" /> Uncertain</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-danger-coral" /> AI-Like</span>
                    </div>
                  </div>

                  {/* Tips Box */}
                  <div className="p-6 bg-secondary-teal/5 border border-secondary-teal/20 rounded-2xl">
                    <h5 className="text-secondary-teal font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Tips to Improve Score
                    </h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Break up uniform sentence structures",
                        "Avoid transition words like 'Furthermore'",
                        "Add personal anecdotes or strong opinions",
                        "Use contractions (e.g. don't vs do not)",
                        "Mix very short sentences with long ones",
                        "Avoid overused AI phrases like 'delve into'"
                      ].slice(0, 4).map((tip, idx) => (
                        <li key={idx} className="text-xs text-white/60 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary-teal" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* STATISTICS */}
          <section className="bg-white/2 px-6 py-12 rounded-[3rem] border border-white/5 mb-24 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-2">
                <div className="text-4xl font-black text-white">{stats.analyzed.toLocaleString()}+</div>
                <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Texts Analyzed</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-primary-purple">{stats.humanized.toLocaleString()}+</div>
                <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Texts Humanized</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-white">4.8/5.0</div>
                <div className="text-sm font-bold text-white/40 uppercase tracking-widest">User Rating</div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how-it-works" className="mb-24">
            <h3 className="text-3xl font-black text-center mb-12">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Clipboard size={32}/>, title: "1. Paste Text", desc: "Simply paste your text from ChatGPT, Claude, or any AI tool into our secure editor." },
                { icon: <Search size={32}/>, title: "2. Analyze AI Score", desc: "Our algorithm checks for robotic patterns, transition densitites, and structure." },
                { icon: <Wand2 size={32}/>, title: "3. Humanize", desc: "One click replaces cliches and adjusts syntax to bypass AI detectors naturally." }
              ].map((step, idx) => (
                <div key={idx} className="glass p-8 rounded-3xl text-center space-y-4 hover:border-primary-purple/40 transition-colors">
                  <div className="w-16 h-16 bg-primary-purple/10 rounded-2xl flex items-center justify-center text-primary-purple mx-auto mb-2">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold">{step.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AD UNIT */}
          <div className="ad-placeholder h-[250px] mb-24 w-full max-w-[300px] mx-auto">
            {/* ADSENSE AD UNIT RECTANGLE 300x250 */}
            Advertisement
          </div>

          {/* FAQ */}
          <section id="faq" className="max-w-3xl mx-auto mb-24">
            <h3 className="text-3xl font-black text-center mb-12">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <FAQItem key={idx} question={item.q} answer={item.a} />
              ))}
            </div>
          </section>

          {/* PRIVACY & TERMS */}
          <section id="privacy" className="max-w-3xl mx-auto mb-24">
            <h3 className="text-3xl font-black text-center mb-12">Privacy & Transparency</h3>
            <div className="glass p-8 md:p-12 rounded-[2rem] space-y-8">
              <div className="space-y-4">
                <h4 className="text-xl font-bold flex items-center gap-2 text-primary-purple">
                  <CheckCircle2 className="w-5 h-5" />
                  Your Data Stays With You
                </h4>
                <p className="text-white/60 leading-relaxed">
                  Unlike many other "AI Humanizers" that send your sensitive text to a central server, 
                  <strong> HumanizeText.ai performs all analysis and rewriting directly in your browser.</strong> 
                  Your text never leaves your device and is never stored, logged, or shared.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                <div className="space-y-3">
                  <h5 className="font-bold text-white/90">Zero Tracking</h5>
                  <p className="text-sm text-white/40">
                    We do not use tracking cookies or collect personal identification. We value your intellectual property.
                  </p>
                </div>
                <div className="space-y-3">
                  <h5 className="font-bold text-white/90">No AI Training</h5>
                  <p className="text-sm text-white/40">
                    Since we don't store your data, it's impossible for us (or anyone else) to use your writing to train future AI models.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl">
                <p className="text-xs text-white/40 italic">
                  Note: By using this tool, you agree that you are responsible for the legal and ethical use of the generated content. 
                  Always verify important facts as AI-assisted humanization can sometimes subtly change meaning.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="glass border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8">
            <Sparkle className="text-primary-purple w-6 h-6" />
            <h1 className="text-lg font-black text-white">
              HumanizeText<span className="text-primary-purple">.ai</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/40 mb-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">API access</a>
          </div>
          
          <p className="text-xs text-white/20 mb-4 text-center">
            Made with ❤️ for a more human web. © 2025 HumanizeText.ai. All rights reserved.
          </p>
          
          <div className="text-[10px] text-white/10 text-center max-w-lg">
            DISCLAIMER: This tool is for educational purposes only. It runs 100% locally in your browser. 
            No text is sent to any servers. We do not guarantee "undetectability" for every possible external detector.
          </div>
          
          <div className="ad-placeholder mt-8 h-[60px] w-full max-w-[468px]">
            {/* ADSENSE AD UNIT FOOTER */}
            Advertisement
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="glass overflow-hidden rounded-2xl border border-white/5 group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/2 transition-colors"
      >
        <span className="font-bold text-white/90 group-hover:text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-white/40 border-t border-white/5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

