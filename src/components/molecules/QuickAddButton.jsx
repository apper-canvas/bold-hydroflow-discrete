import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const QuickAddButton = ({ 
  amount, 
  unit = 'oz', 
  onAdd, 
  className = '' 
}) => {
  const [isAdding, setIsAdding] = useState(false)

  const handleClick = async () => {
    if (isAdding) return
    
    setIsAdding(true)
    
    try {
      await onAdd(amount, unit)
      toast.success(`Added ${amount}${unit} of water!`, {
        icon: '💧'
      })
    } catch (error) {
      toast.error('Failed to add water intake')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isAdding}
      className={`
        glass rounded-2xl p-6 flex flex-col items-center justify-center
        transition-all duration-200 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden group
        ${className}
      `}
    >
      {/* Ripple effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Water drop icon */}
      <motion.div
        animate={isAdding ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <ApperIcon 
          name="Droplets" 
          size={32} 
          className={`mb-3 transition-colors duration-200 ${
            isAdding ? 'text-primary' : 'text-secondary group-hover:text-primary'
          }`} 
        />
      </motion.div>
      
      {/* Amount text */}
      <div className="relative z-10 text-center">
        <motion.div
          animate={isAdding ? { scale: [1, 1.1, 1] } : {}}
          className="text-lg font-semibold text-gray-900 mb-1"
        >
          {amount}{unit}
        </motion.div>
        <div className="text-sm text-gray-600 font-medium">
          {isAdding ? 'Adding...' : 'Quick Add'}
        </div>
      </div>
      
      {/* Loading spinner */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon name="Loader2" size={24} className="text-primary" />
          </motion.div>
        </motion.div>
      )}
    </motion.button>
  )
}

export default QuickAddButton