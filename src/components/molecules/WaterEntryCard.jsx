import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'

const WaterEntryCard = ({ 
  entry, 
  onDelete, 
  className = '' 
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    try {
      await onDelete(entry.id)
      toast.success('Water entry deleted')
    } catch (error) {
      toast.error('Failed to delete entry')
    } finally {
      setIsDeleting(false)
    }
  }

const getDrinkTypeIcon = (drinkType) => {
    switch (drinkType) {
      case 'water': return 'Droplets'
      case 'tea': return 'Coffee'
      case 'coffee': return 'Coffee'
      case 'juice': return 'GlassWater'
      case 'milk': return 'Milk'
      case 'sports-drink': return 'Zap'
      case 'soda': return 'Sparkles'
      case 'smoothie': return 'Cherry'
      default: return 'Droplets'
    }
  }

  const getEffectivenessColor = (multiplier) => {
    if (multiplier >= 0.9) return 'text-green-600 bg-green-50'
    if (multiplier >= 0.8) return 'text-blue-600 bg-blue-50'
    if (multiplier >= 0.7) return 'text-yellow-600 bg-yellow-50'
    return 'text-orange-600 bg-orange-50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`
        bg-white rounded-xl p-4 shadow-sm border border-gray-100
        hover:shadow-md transition-shadow duration-200
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon 
              name={getDrinkTypeIcon(entry.drinkType)} 
              size={20} 
              className="text-primary" 
            />
          </div>
          
<div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">
                {entry.amount}{entry.unit}
              </span>
              {entry.hydrationMultiplier && entry.hydrationMultiplier !== 1.0 && (
                <span className={`
                  text-xs px-2 py-1 rounded-full font-medium
                  ${getEffectivenessColor(entry.hydrationMultiplier)}
                `}>
                  {Math.round(entry.hydrationMultiplier * 100)}%
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{format(new Date(entry.timestamp), 'h:mm a')}</span>
              {entry.hydrationPoints && entry.hydrationPoints !== entry.amount && (
                <span className="text-primary">
                  • {entry.hydrationPoints} hydration pts
                </span>
              )}
            </div>
          </div>
        
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={handleDelete}
          loading={isDeleting}
          className="text-gray-400 hover:text-error"
        />
      </div>
    </motion.div>
  )
}

export default WaterEntryCard