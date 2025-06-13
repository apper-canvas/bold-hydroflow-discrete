import React from 'react'
import { motion } from 'framer-motion'
import ProgressRing from '@/components/molecules/ProgressRing'
import ApperIcon from '@/components/ApperIcon'

const ProgressSection = ({ 
  current = 0, 
  goal = 64, 
  unit = 'oz',
  className = '' 
}) => {
  const progress = Math.min((current / goal) * 100, 100)
  const remaining = Math.max(goal - current, 0)
  const isGoalReached = current >= goal

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center ${className}`}
    >
      <div className="flex flex-col items-center">
        <ProgressRing progress={progress} size={180} strokeWidth={12}>
          <div className="text-center">
            <motion.div
              key={current}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-gray-900 mb-1"
            >
              {current}<span className="text-lg text-gray-600">{unit}</span>
            </motion.div>
            <div className="text-sm text-gray-500">
              of {goal}{unit}
            </div>
          </div>
        </ProgressRing>
        
        <div className="mt-6 space-y-2">
          {isGoalReached ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-2 text-accent"
            >
              <ApperIcon name="CheckCircle" size={20} />
              <span className="font-semibold">Goal Achieved! 🎉</span>
            </motion.div>
          ) : (
            <div className="text-gray-600">
              <span className="font-semibold text-primary">{remaining}{unit}</span> to go
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            {Math.round(progress)}% complete
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProgressSection