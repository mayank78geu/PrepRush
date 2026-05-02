import React from "react";

interface QuestionCardProps {
  question: string;
  difficulty: string;
  topicName: string;
}

export default function QuestionCard({
  question,
  difficulty,
  topicName,
}: QuestionCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "text-green-400 border-green-500/30 bg-green-500/10";
      case "hard":
        return "text-red-400 border-red-500/30 bg-red-500/10";
      default:
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-blue-400 font-semibold tracking-wider text-sm uppercase">
          {topicName}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getDifficultyColor(
            difficulty
          )}`}
        >
          {difficulty}
        </span>
      </div>
      <p className="text-white text-xl leading-relaxed">{question}</p>
    </div>
  );
}
