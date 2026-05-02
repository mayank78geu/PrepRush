import React from "react";

interface FeedbackCardProps {
  score: number;
  feedback: string;
  idealAnswer: string;
  onNextQuestion: () => void;
}

export default function FeedbackCard({
  score,
  feedback,
  idealAnswer,
  onNextQuestion,
}: FeedbackCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="mt-8 space-y-6 animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-slate-300 font-medium mb-1">Your Score</h3>
          <p className="text-sm text-slate-500">Based on accuracy and detail</p>
        </div>
        <div
          className={`text-5xl font-black ${getScoreColor(
            score
          )} tracking-tighter`}
        >
          {score}
          <span className="text-2xl text-slate-600">/10</span>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-4">
        <div>
          <h4 className="text-blue-400 font-semibold mb-2">
            AI Feedback
          </h4>
          <p className="text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-lg">
            {feedback}
          </p>
        </div>

        <div>
          <h4 className="text-green-400 font-semibold mb-2">
            The Ideal Answer
          </h4>
          <p className="text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-lg border-l-4 border-green-500">
            {idealAnswer}
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onNextQuestion}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
        >
          Try Another Question
        </button>
      </div>
    </div>
  );
}
