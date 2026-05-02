import React from 'react';
import { QuizResultResponse } from '@/lib/types';

interface Props {
  result: QuizResultResponse;
  onRetry: () => void;
}

export default function QuizResult({ result, onRetry }: Props) {
  const percentage = (result.score / result.total) * 100;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
      <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
      <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
        {result.score} / {result.total}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {percentage >= 80 ? 'Excellent job!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!'}
      </p>
      <button 
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Try Another Topic
      </button>
    </div>
  );
}
