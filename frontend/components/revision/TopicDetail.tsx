import React from "react";

interface TopicDetailProps {
  topicName: string;
  explanation: string;
  realWorldExample: string;
  idealAnswerFormat: string;
}

export default function TopicDetail({
  topicName,
  explanation,
  realWorldExample,
  idealAnswerFormat,
}: TopicDetailProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mt-6">
      <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
        {topicName}
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-blue-400 mb-2">
            Explanation
          </h4>
          <p className="text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-lg">
            {explanation}
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-green-400 mb-2">
            Real-World Example
          </h4>
          <p className="text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-lg border-l-4 border-green-500">
            {realWorldExample}
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-2">
            Ideal Answer Format
          </h4>
          <p className="text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-lg border-l-4 border-purple-500 whitespace-pre-line">
            {idealAnswerFormat}
          </p>
        </div>
      </div>
    </div>
  );
}
