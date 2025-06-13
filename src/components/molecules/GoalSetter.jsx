import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { toast } from 'react-toastify'

const GoalSetter = ({ 
  currentGoal = 64, 
  unit = 'oz', 
  onSave, 
  onCancel,
  className = '' 
}) => {
  const [goal, setGoal] = useState(currentGoal)
  const [isLoading, setIsLoading] = useState(false)

  const presetGoals = [48, 64, 80, 96, 128]

  const handleSave = async () => {
    if (goal <= 0) {
      toast.error('Please enter a valid goal amount')
      return
    }

    setIsLoading(true)
    
    try {
      await onSave(goal, unit)
      toast.success('Daily goal updated!')
    } catch (error) {
      toast.error('Failed to update goal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-2xl p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Set Daily Goal
        </h3>
        <p className="text-gray-600">
          How much water do you want to drink today?
        </p>
      </div>

      {/* Custom input */}
      <div className="mb-6">
        <Input
          type="number"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          suffix={unit}
          label="Daily Goal"
          min="1"
          max="200"
        />
      </div>

      {/* Preset options */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Quick Select:
        </div>
        <div className="grid grid-cols-5 gap-2">
          {presetGoals.map((preset) => (
            <motion.button
              key={preset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGoal(preset)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${goal === preset 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {preset}{unit}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleSave}
          loading={isLoading}
        >
          Save Goal
        </Button>
      </div>
    </motion.div>
  )
}

export default GoalSetter