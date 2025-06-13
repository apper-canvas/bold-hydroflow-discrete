import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { dailyGoalService, userStatsService } from '@/services'

const Settings = () => {
  const [currentGoal, setCurrentGoal] = useState({ targetAmount: 64, unit: 'oz' })
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tempGoal, setTempGoal] = useState(64)
  const [tempUnit, setTempUnit] = useState('oz')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [goal, stats] = await Promise.all([
        dailyGoalService.getCurrentGoal(),
        userStatsService.getStats()
      ])
      
      setCurrentGoal(goal)
      setUserStats(stats)
      setTempGoal(goal.targetAmount)
      setTempUnit(goal.unit)
    } catch (err) {
      setError(err.message || 'Failed to load settings')
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveGoal = async () => {
    if (tempGoal <= 0) {
      toast.error('Please enter a valid goal amount')
      return
    }

    setSaving(true)
    
    try {
      const updatedGoal = await dailyGoalService.updateCurrentGoal(tempGoal, tempUnit)
      setCurrentGoal(updatedGoal)
      toast.success('Daily goal updated successfully!')
    } catch (error) {
      toast.error('Failed to update goal')
    } finally {
      setSaving(false)
    }
  }

  const handleResetStats = async () => {
    if (!confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
      return
    }

    try {
      const resetStats = await userStatsService.resetStats()
      setUserStats(resetStats)
      toast.success('Statistics reset successfully')
    } catch (error) {
      toast.error('Failed to reset statistics')
    }
  }

  const presetGoals = [
    { amount: 48, unit: 'oz', label: 'Light (6 cups)' },
    { amount: 64, unit: 'oz', label: 'Standard (8 cups)' },
    { amount: 80, unit: 'oz', label: 'Active (10 cups)' },
    { amount: 96, unit: 'oz', label: 'Athletic (12 cups)' },
    { amount: 128, unit: 'oz', label: 'Intense (16 cups)' }
  ]

  const tips = [
    {
      icon: 'Lightbulb',
      title: 'Start your day with water',
      description: 'Drink a glass of water first thing in the morning to kickstart your hydration.'
    },
    {
      icon: 'Clock',
      title: 'Set regular reminders',
      description: 'Use phone alarms or notifications to remind yourself to drink water throughout the day.'
    },
    {
      icon: 'Droplets',
      title: 'Add flavor naturally',
      description: 'Try adding lemon, cucumber, or mint to make water more enjoyable.'
    },
    {
      icon: 'Activity',
      title: 'Drink before you feel thirsty',
      description: 'Thirst is a late indicator of dehydration. Stay ahead by drinking regularly.'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-4 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load settings
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData}>
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
            Settings
          </h1>
          <p className="text-gray-600">
            Customize your hydration experience
          </p>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <ApperIcon name="BarChart3" size={20} className="mr-2 text-primary" />
                Your Statistics
              </h3>
              <Button
                variant="ghost"
                size="sm"
                icon="RotateCcw"
                onClick={handleResetStats}
                className="text-gray-500 hover:text-error"
              >
                Reset
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-surface rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">
                  {userStats.currentStreak || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Current Streak
                </div>
              </div>
              
              <div className="text-center p-4 bg-surface rounded-xl">
                <div className="text-2xl font-bold text-accent mb-1">
                  {userStats.longestStreak || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Longest Streak
                </div>
              </div>
              
              <div className="text-center p-4 bg-surface rounded-xl">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {userStats.totalIntake || 0}oz
                </div>
                <div className="text-sm text-gray-600">
                  Total Intake
                </div>
              </div>
              
              <div className="text-center p-4 bg-surface rounded-xl">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {userStats.averageDaily || 0}oz
                </div>
                <div className="text-sm text-gray-600">
                  Daily Average
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Goal Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Target" size={20} className="mr-2 text-primary" />
              Daily Goal
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="primary" className="text-xs">
                  Current: {currentGoal.targetAmount}{currentGoal.unit}
                </Badge>
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(Number(e.target.value))}
                    label="Goal Amount"
                    min="1"
                    max="200"
                  />
                </div>
                
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={tempUnit}
                    onChange={(e) => setTempUnit(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="oz">oz</option>
                    <option value="ml">ml</option>
                    <option value="cups">cups</option>
                  </select>
                </div>
              </div>
              
              <Button
                variant="primary"
                onClick={handleSaveGoal}
                loading={saving}
                disabled={tempGoal === currentGoal.targetAmount && tempUnit === currentGoal.unit}
                className="w-full"
              >
                Update Goal
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Preset Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Zap" size={20} className="mr-2 text-primary" />
              Quick Goals
            </h3>
            
            <div className="space-y-3">
              {presetGoals.map((preset) => (
                <motion.button
                  key={`${preset.amount}-${preset.unit}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTempGoal(preset.amount)
                    setTempUnit(preset.unit)
                  }}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${tempGoal === preset.amount && tempUnit === preset.unit
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {preset.amount}{preset.unit}
                      </div>
                      <div className="text-sm text-gray-600">
                        {preset.label}
                      </div>
                    </div>
                    
                    {tempGoal === preset.amount && tempUnit === preset.unit && (
                      <ApperIcon name="Check" size={20} className="text-primary" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Hydration Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="BookOpen" size={20} className="mr-2 text-primary" />
              Hydration Tips
            </h3>
            
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-surface"
                >
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <ApperIcon name={tip.icon} size={16} className="text-primary" />
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900 mb-1">
                      {tip.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tip.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 text-center">
            <div className="text-4xl mb-3">💧</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              HydroFlow
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Your personal hydration companion
            </p>
            <div className="text-xs text-gray-500">
              Version 1.0.0
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings