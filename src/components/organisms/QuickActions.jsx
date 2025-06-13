import React from 'react'
import { motion } from 'framer-motion'
import QuickAddButton from '@/components/molecules/QuickAddButton'
import Button from '@/components/atoms/Button'

const QuickActions = ({ 
  onQuickAdd, 
  onCustomAdd, 
  onSetGoal,
  className = '' 
}) => {
  const quickAmounts = [
    { amount: 8, label: 'Small Glass' },
    { amount: 12, label: 'Medium Glass' },
    { amount: 16, label: 'Large Glass' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`space-y-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Add
        </h2>
        <Button
          variant="secondary"
          size="sm"
          icon="Settings"
          onClick={onSetGoal}
        >
          Set Goal
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {quickAmounts.map((item, index) => (
          <motion.div
            key={item.amount}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <QuickAddButton
              amount={item.amount}
              unit="oz"
              onAdd={onQuickAdd}
              className="w-full aspect-square"
            />
          </motion.div>
        ))}
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="glass"
          className="flex-1"
          icon="Plus"
          onClick={onCustomAdd}
        >
          Custom Amount
        </Button>
      </div>
    </motion.div>
  )
}

export default QuickActions