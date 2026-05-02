import React, { useState } from "react";

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  loading: boolean;
}

export default function AnswerInput({ onSubmit, loading }: AnswerInputProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <label
        htmlFor="answer"
        className="block text-slate-300 font-medium mb-2 ml-1"
      >
        Your Answer
      </label>
      <textarea
        id="answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={loading}
        placeholder="Type your detailed answer here..."
        className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
        required
      />
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading || !answer.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Evaluating...
            </span>
          ) : (
            "Submit for Evaluation"
          )}
        </button>
      </div>
    </form>
  );
}
