import React from "react";

interface TopicsListProps {
  topics: string[];
  onSelectTopic: (topic: string) => void;
  selectedTopic: string | null;
}

export default function TopicsList({
  topics,
  onSelectTopic,
  selectedTopic,
}: TopicsListProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-4">
        Top Important Topics
      </h3>
      <div className="flex flex-wrap gap-3">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onSelectTopic(topic)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTopic === topic
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
