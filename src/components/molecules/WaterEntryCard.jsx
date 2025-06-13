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
      default: return 'Droplets'
    }
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
            <div className="font-semibold text-gray-900">
              {entry.amount}{entry.unit}
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(entry.timestamp), 'h:mm a')}
            </div>
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