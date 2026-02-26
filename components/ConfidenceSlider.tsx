'use client'

import { useState } from 'react'

interface Props {
  value: number | null
  onChange: (value: number) => void
}

const labels = ['Wild guess', 'Uncertain', 'Somewhat sure', 'Confident', 'Certain']

export default function ConfidenceSlider({ value, onChange }: Props) {
  const [touched, setTouched] = useState(false)

  const displayValue = value ?? 50

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const n = Number(e.target.value)
    setTouched(true)
    onChange(n)
  }

  const labelIndex = Math.floor((displayValue / 100) * (labels.length - 1))
  const label = labels[Math.min(labelIndex, labels.length - 1)]

  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-gray-600 mb-2">
        How confident are you in your answer?
        {!touched && (
          <span className="ml-2 text-amber-500 text-xs">(move slider to continue)</span>
        )}
      </p>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 w-16 text-right">Not at all</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={displayValue}
          onChange={handleChange}
          className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer transition-all ${
            touched ? 'accent-blue-600' : 'accent-gray-300'
          }`}
        />
        <span className="text-xs text-gray-400 w-16">Completely</span>
      </div>
      <div className="text-center mt-2">
        <span
          className={`text-sm font-medium transition-colors ${
            touched ? 'text-blue-600' : 'text-gray-300'
          }`}
        >
          {touched ? label : '—'}
        </span>
      </div>
    </div>
  )
}