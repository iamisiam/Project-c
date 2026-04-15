'use client';

import { useState } from 'react';

const questions = [
  "What's my favorite color?",
  "What's my dream vacation destination?",
  "What's my favorite food?",
  "What's my favorite movie?",
  "What's my favorite hobby?",
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<'answering' | 'guessing'>('answering');

  const submitAnswer = () => {
    if (answer.trim()) {
      setAnswers([...answers, answer]);
      setAnswer('');
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setPhase('guessing');
      }
    }
  };

  const guessAnswer = (guess: string) => {
    // In real implementation, send to API and compare
    alert(`You guessed: ${guess}. In real app, this would be sent to your partner!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Quiz Time! 🧠</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {phase === 'answering' ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <p className="text-lg mb-6">{questions[currentQuestion]}</p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                rows={3}
                placeholder="Your answer..."
              />
              <button
                onClick={submitAnswer}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Guess Your Partner&apos;s Answers!</h2>
              <p className="text-gray-600 mb-6">
                Now try to guess what your partner answered for each question.
              </p>
              {questions.map((question, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-md">
                  <p className="font-semibold mb-2">{question}</p>
                  <p className="text-sm text-gray-600 mb-2">Your answer: {answers[index]}</p>
                  <input
                    type="text"
                    placeholder="Guess partner&apos;s answer..."
                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        guessAnswer((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      guessAnswer(input.value);
                      input.value = '';
                    }}
                    className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Guess
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}