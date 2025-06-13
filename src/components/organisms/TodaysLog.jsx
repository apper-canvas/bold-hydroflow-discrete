import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WaterEntryCard from '@/components/molecules/WaterEntryCard'
import ApperIcon from '@/components/ApperIcon'

const TodaysLog = ({ 
  entries = [], 
  onDeleteEntry, 
  loading = false,
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900">
          Today's Log
        </h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="animate-pulse flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-center py-12 ${className}`}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Droplets" size={48} className="text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No water logged yet
        </h3>
        <p className="text-gray-500">
          Start tracking your hydration by adding your first glass!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Today's Log
<div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </div>
          <div className="text-sm font-medium text-primary">
            {Math.round(entries.reduce((total, entry) => 
              total + (entry.hydrationPoints || entry.amount), 0
            ) * 100) / 100} hydration pts
          </div>
        </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <WaterEntryCard
                entry={entry}
                onDelete={onDeleteEntry}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default TodaysLog