import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const DashboardHeader = ({ 
  currentStreak = 0, 
  userName = 'there',
  className = '' 
}) => {
  const currentDate = new Date()
  const greeting = () => {
    const hour = currentDate.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-primary via-secondary to-accent p-6 rounded-2xl text-white ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold mb-1">
            {greeting()}, {userName}!
          </h1>
          <p className="text-blue-100 font-medium">
            {format(currentDate, 'EEEE, MMMM d')}
          </p>
        </div>
        
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <ApperIcon name="Droplets" size={32} className="text-blue-100" />
        </motion.div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge 
            variant="success" 
            icon="Flame" 
            glow={currentStreak > 0}
            className="bg-white/20 text-white border border-white/30"
          >
            {currentStreak} day streak
          </Badge>
          
          <div className="text-blue-100 text-sm">
            Keep it up! 💪
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardHeader