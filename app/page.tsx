'use client'
import { useState } from 'react'

type Screen = 'landing' | 'question' | 'result'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [answer, setAnswer] = useState<string | null>(null)

  function handleAnswer(choice: string) {
    setAnswer(choice)
    setScreen('result')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">

      {screen === 'landing' && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-900 mb-4">
            Cognitive Bias Testing Platform
          </h1>
          <p className="text-gray-600 mb-8">
            How does your brain make decisions?
          </p>
          <button
            onClick={() => { setScreen('question'); setAnswer(null) }}
            className="bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-800"
          >
            Begin
          </button>
        </div>
      )}

      {screen === 'question' && (
        <div className="text-center max-w-lg">
          <p className="text-sm text-gray-500 mb-6">Question 1 of 1</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            A bat and ball cost $1.10 total. The bat costs $1.00 more than the ball. How much does the ball cost?
          </h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleAnswer('10 cents')}
              className="border-2 border-gray-300 rounded-lg px-6 py-4 text-left hover:border-indigo-500 hover:bg-indigo-50"
            >
              10 cents
            </button>
            <button
              onClick={() => handleAnswer('5 cents')}
              className="border-2 border-gray-300 rounded-lg px-6 py-4 text-left hover:border-indigo-500 hover:bg-indigo-50"
            >
              5 cents
            </button>
          </div>
        </div>
      )}

      {screen === 'result' && (
        <div className="text-center max-w-lg">
          <p className="text-gray-500 mb-2">You answered:</p>
          <p className="text-xl font-bold mb-4">{answer}</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The correct answer is 5 cents.
          </h2>
          <p className="text-gray-600 mb-2">
            {answer === '5 cents'
              ? '✓ You got it right.'
              : '✗ Most people say 10 cents — but that would make the total $1.20.'}
          </p>
          <button
            onClick={() => { setScreen('landing'); setAnswer(null) }}
            className="mt-8 bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-800"
          >
            Start over
          </button>
        </div>
      )}

    </main>
  )
}