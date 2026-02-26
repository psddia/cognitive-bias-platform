'use client'

import { useState } from 'react'
import ConfidenceSlider from '@/components/ConfidenceSlider'
import { round1Questions } from '@/data/round1Questions'

// ── Types ─────────────────────────────────────────────────────

type Answer = {
  questionId: string
  selectedId: string
  confidence: number
  correct: boolean
}

type Screen = 'intro' | 'assessment' | 'results'

// ── Scoring ───────────────────────────────────────────────────

// Brier score: (p - outcome)^2 averaged across items.
// p = confidence as 0–1, outcome = 1 if correct, 0 if not.
// Lower is better. 0.25 = what you'd score guessing 50% on everything.
// 0.00 = perfect. We use this (not MAE) because the whole instrument
// is built around Brier — Week 5 database writes will store it directly.

function computeResults(answers: Answer[]) {
  const total = answers.length
  const correct = answers.filter(a => a.correct).length
  const avgConfidence = Math.round(
    answers.reduce((sum, a) => sum + a.confidence, 0) / total
  )
  const brier =
    answers.reduce((sum, a) => {
      const p = a.confidence / 100
      const outcome = a.correct ? 1 : 0
      return sum + Math.pow(p - outcome, 2)
    }, 0) / total

  return { total, correct, avgConfidence, brier }
}

// ── Component ─────────────────────────────────────────────────

export default function Home() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showExplanation, setShowExplanation] = useState(false)

  const question = round1Questions[currentIndex]
  const isLastQuestion = currentIndex === round1Questions.length - 1

  // Both conditions must be true: option selected AND slider moved.
  // confidence stays null until the slider fires onChange, which only
  // happens on actual interaction. This is the interaction gate.
  const canAdvance = selectedOption !== null && confidence !== null

  function handleOptionSelect(optionId: string) {
    if (showExplanation) return // lock options once answer is revealed
    setSelectedOption(optionId)
  }

  function handleReveal() {
    if (!canAdvance) return
    setShowExplanation(true)
  }

  function handleNext() {
    if (!canAdvance) return

    const answer: Answer = {
      questionId: question.id,
      selectedId: selectedOption!,
      confidence: confidence!,
      correct: selectedOption === question.correctId,
    }

    const updatedAnswers = [...answers, answer]
    setAnswers(updatedAnswers)

    if (isLastQuestion) {
      setScreen('results')
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedOption(null)
      setConfidence(null)
      setShowExplanation(false)
    }
  }

  function resetAll() {
    setScreen('intro')
    setCurrentIndex(0)
    setAnswers([])
    setSelectedOption(null)
    setConfidence(null)
    setShowExplanation(false)
  }

  // ── Intro screen ──────────────────────────────────────────────

  if (screen === 'intro') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cognitive Bias Assessment
          </h1>
          <p className="text-gray-500 mb-6">
            6 questions · ~5 minutes
            <br />
            Answer each question, then rate your confidence before moving on.
          </p>
          <button
            onClick={() => setScreen('assessment')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Begin Assessment
          </button>
        </div>
      </main>
    )
  }

  // ── Results screen ────────────────────────────────────────────

  if (screen === 'results') {
    const { total, correct, avgConfidence, brier } = computeResults(answers)
    const pct = Math.round((correct / total) * 100)

    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Results</h2>
          <p className="text-gray-500 text-sm mb-6">Round 1 complete</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">{pct}%</div>
              <div className="text-xs text-gray-500 mt-1">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{avgConfidence}</div>
              <div className="text-xs text-gray-500 mt-1">Avg Confidence</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-500">
                {brier.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Brier Score</div>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mb-6">
            Brier score: lower is better · 0.25 = always guessing 50% · 0.00 = perfect
          </p>

          <div className="space-y-3 mb-6">
            {answers.map((a, i) => {
              const q = round1Questions[i]
              return (
                <div
                  key={a.questionId}
                  className={`flex items-center justify-between p-3 rounded-lg text-sm ${
                    a.correct
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  <span className="font-medium">{q.bias}</span>
                  <span>
                    {a.correct ? '✓' : '✗'} · {a.confidence}% confident
                  </span>
                </div>
              )
            })}
          </div>

          <button
            onClick={resetAll}
            className="w-full border border-gray-200 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </main>
    )
  }

  // ── Assessment screen ─────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8">

        {/* Header: bias label + counter */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {question.bias}
          </span>
          <span className="text-xs text-gray-400">
            {currentIndex + 1} / {round1Questions.length}
          </span>
        </div>

        {/* Progress bar
            Uses (currentIndex + 1) so question 1 shows progress immediately.
            Clamped to 100 on the last question. */}
        <div className="w-full bg-gray-100 rounded-full h-1 mb-6">
          <div
            className="bg-blue-600 h-1 rounded-full transition-all"
            style={{
              width: `${Math.min(
                ((currentIndex + 1) / round1Questions.length) * 100,
                100
              )}%`,
            }}
          />
        </div>

        {/* Question stem */}
        <p className="text-gray-900 font-medium text-base mb-4 leading-relaxed">
          {question.stem}
        </p>

        {/* Answer options */}
        <div className="space-y-2 mb-2">
          {question.options.map(opt => {
            const isSelected = selectedOption === opt.id
            const isCorrect = opt.id === question.correctId

            let style = 'border-gray-200 text-gray-700 hover:border-blue-300'
            if (showExplanation) {
              if (isCorrect)
                style = 'border-green-400 bg-green-50 text-green-800'
              else if (isSelected)
                style = 'border-red-300 bg-red-50 text-red-700'
              else
                style = 'border-gray-100 text-gray-400'
            } else if (isSelected) {
              style = 'border-blue-500 bg-blue-50 text-blue-800'
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(opt.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}
              >
                {opt.text}
              </button>
            )
          })}
        </div>

        {/* Explanation panel — visible after Show Answer */}
        {showExplanation && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
            {question.explanation}
          </div>
        )}

        {/* Confidence slider
            key={question.id} forces a full remount on each question.
            This resets the internal `touched` state so the "move slider
            to continue" prompt appears correctly on every item. */}
        <ConfidenceSlider
          key={question.id}
          value={confidence}
          onChange={setConfidence}
        />

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          {!showExplanation && (
            <button
              onClick={handleReveal}
              disabled={!canAdvance}
              className="flex-1 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Show Answer
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canAdvance}
            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </button>
        </div>

      </div>
    </main>
  )
}