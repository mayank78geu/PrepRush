import React from "react";

interface RevisionPlanProps {
  plan: Record<string, string[]>;
}

export default function RevisionPlan({ plan }: RevisionPlanProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-4">
        24-Hour Revision Plan
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(plan).map(([timeSlot, topics]) => (
          <div key={timeSlot} className="bg-slate-900 rounded-lg p-4">
            <h4 className="text-lg font-medium text-blue-400 capitalize mb-3 border-b border-slate-700 pb-2">
              {timeSlot}
            </h4>
            <ul className="space-y-2">
              {topics.map((topic, idx) => (
                <li key={idx} className="flex items-start text-slate-300 text-sm">
                  <span className="text-blue-500 mr-2 mt-0.5">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
