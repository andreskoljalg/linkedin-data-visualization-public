import { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateRangeSliderProps {
  maxDays: number
  comparisonDays: number
  onComparisonDaysChange: (days: number) => void
}

export function DateRangeSlider({ maxDays, comparisonDays, onComparisonDaysChange }: DateRangeSliderProps) {
  const [inputValue, setInputValue] = useState(comparisonDays.toString())
  const [error, setError] = useState<string | null>(null)

  const handleSliderChange = (value: number[]) => {
    const days = value[0]
    onComparisonDaysChange(days)
    setInputValue(days.toString())
    setError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    const days = parseInt(value, 10)
    if (isNaN(days)) {
      setError('Please enter a valid number')
    } else if (days > maxDays) {
      setError(`Maximum ${maxDays} days allowed`)
    } else if (days < 1) {
      setError('Minimum 1 day required')
    } else {
      setError(null)
      onComparisonDaysChange(days)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Label htmlFor="date-range">Comparison period (days):</Label>
        <Slider
          id="date-range"
          min={1}
          max={maxDays}
          step={1}
          value={[comparisonDays]}
          onValueChange={handleSliderChange}
          className="w-[200px]"
        />
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          className={`w-20 ${error ? 'border-red-500' : ''}`}
          min={1}
          max={maxDays}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

