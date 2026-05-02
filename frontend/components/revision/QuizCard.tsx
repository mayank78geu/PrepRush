import React, { useState } from 'react';
import { QuizQuestionResponse } from '@/lib/types';

interface Props {
  question: QuizQuestionResponse;
  onAnswer: (questionId: number, selectedOption: number) => void;
  index: number;
}

export default function QuizCard({ question, onAnswer, index }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    onAnswer(question.id, idx);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
      <h4 className="text-lg font-semibold mb-4">Q{index + 1}. {question.question}</h4>
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left p-3 rounded border transition-colors ${
              selected === idx 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="inline-block w-6 font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
          </button>
        ))}
      </div>
    </div>
  );
}
