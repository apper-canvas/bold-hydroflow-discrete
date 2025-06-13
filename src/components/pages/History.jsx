import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks } from 'date-fns'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { waterEntryService, dailyGoalService } from '@/services'

const History = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [weeklyData, setWeeklyData] = useState([])
  const [currentGoal, setCurrentGoal] = useState({ targetAmount: 64, unit: 'oz' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadWeeklyData = async (weekDate) => {
    setLoading(true)
    setError(null)
    
    try {
      const startDate = startOfWeek(weekDate, { weekStartsOn: 0 })
      const endDate = endOfWeek(weekDate, { weekStartsOn: 0 })
      
      const [entries, goal] = await Promise.all([
        waterEntryService.getEntriesByDateRange(startDate, endDate),
        dailyGoalService.getCurrentGoal()
      ])
      
      setCurrentGoal(goal)
      
      // Group entries by date
      const dailyTotals = {}
      entries.forEach(entry => {
        const date = format(new Date(entry.timestamp), 'yyyy-MM-dd')
        dailyTotals[date] = (dailyTotals[date] || 0) + entry.amount
      })
      
      // Create array for each day of the week
      const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate })
      const weekData = daysOfWeek.map(date => {
        const dateKey = format(date, 'yyyy-MM-dd')
        const total = dailyTotals[dateKey] || 0
        const progress = Math.min((total / goal.targetAmount) * 100, 100)
        
        return {
          date,
          dateKey,
          total: Math.round(total),
          progress,
          goalMet: total >= goal.targetAmount
        }
      })
      
      setWeeklyData(weekData)
    } catch (err) {
      setError(err.message || 'Failed to load history data')
      toast.error('Failed to load history data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeeklyData(currentWeek)
  }, [currentWeek])

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1))
  }

  const getWeekRange = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 })
    const end = endOfWeek(currentWeek, { weekStartsOn: 0 })
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  }

  const getWeeklyAverage = () => {
    const total = weeklyData.reduce((sum, day) => sum + day.total, 0)
    return Math.round(total / 7)
  }

  const getSuccessRate = () => {
    const successDays = weeklyData.filter(day => day.goalMet).length
    return Math.round((successDays / 7) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load history
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadWeeklyData(currentWeek)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-6 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Hydration History
          </h1>
          <p className="text-gray-600">
            Track your progress over time
          </p>
        </motion.div>

        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                icon="ChevronLeft"
                onClick={() => navigateWeek('prev')}
              />
              
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {getWeekRange()}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                icon="ChevronRight"
                onClick={() => navigateWeek('next')}
              />
            </div>
          </Card>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {getWeeklyAverage()}{currentGoal.unit}
                </div>
                <div className="text-sm text-gray-600">
                  Daily Average
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {getSuccessRate()}%
                </div>
                <div className="text-sm text-gray-600">
                  Success Rate
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Daily Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">
              Daily Progress
            </h3>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={day.dateKey}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square"
                >
                  <div className={`
                    w-full h-full rounded-xl border-2 flex flex-col items-center justify-center
                    transition-all duration-200 hover:scale-105
                    ${day.goalMet 
                      ? 'bg-accent/10 border-accent text-accent' 
                      : day.total > 0 
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }
                  `}>
                    <div className="text-xs font-medium mb-1">
                      {format(day.date, 'd')}
                    </div>
                    
                    {day.goalMet && (
                      <ApperIcon name="CheckCircle" size={12} />
                    )}
                    
                    {!day.goalMet && day.total > 0 && (
                      <div className="text-xs">
                        {Math.round(day.progress)}%
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Daily Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h3 className="font-semibold text-gray-900">
            Daily Breakdown
          </h3>
          
          {weeklyData.map((day, index) => (
            <motion.div
              key={day.dateKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-3 h-3 rounded-full
                      ${day.goalMet ? 'bg-accent' : day.total > 0 ? 'bg-primary' : 'bg-gray-300'}
                    `} />
                    
                    <div>
                      <div className="font-medium text-gray-900">
                        {format(day.date, 'EEEE, MMM d')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.total}{currentGoal.unit} of {currentGoal.targetAmount}{currentGoal.unit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {day.goalMet && (
                      <Badge variant="success" icon="CheckCircle" size="sm">
                        Goal Met
                      </Badge>
                    )}
                    
                    <div className="text-sm font-medium text-gray-500">
                      {Math.round(day.progress)}%
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${day.progress}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className={`h-full rounded-full ${
                      day.goalMet ? 'bg-accent' : 'bg-primary'
                    }`}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default History