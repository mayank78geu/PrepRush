import React from 'react';

interface Props {
  points: string[];
}

export default function ImportantPoints({ points }: Props) {
  if (!points || points.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Important Points</h3>
      <ul className="list-disc pl-5 space-y-2">
        {points.map((point, i) => (
          <li key={i} className="text-gray-700 dark:text-gray-300">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
