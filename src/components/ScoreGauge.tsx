/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score < 30) return "#00b894"; // Success Green
    if (score < 60) return "#fdcb6e"; // Warning Yellow
    return "#e17055"; // Danger Coral
  };

  const getStatus = () => {
    if (score < 30) return "Low Risk ✓";
    if (score < 60) return "Medium Risk ⚠";
    return "High Risk ✗";
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      <svg className="w-48 h-48 transform -rotate-90">
        {/* Background track */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="#ffffff10"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress bar */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          stroke={getColor()}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center mt-[-10px]">
        <motion.span 
          className="text-4xl font-black text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {Math.round(score)}%
        </motion.span>
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">AI Probability</span>
      </div>

      <motion.div 
        className="mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: `${getColor()}20`, color: getColor() }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {getStatus()}
      </motion.div>
    </div>
  );
}
