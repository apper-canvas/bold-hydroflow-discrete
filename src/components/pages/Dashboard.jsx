import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DashboardHeader from '@/components/organisms/DashboardHeader'
import ProgressSection from '@/components/organisms/ProgressSection'
import QuickActions from '@/components/organisms/QuickActions'
import TodaysLog from '@/components/organisms/TodaysLog'
import CustomAddModal from '@/components/organisms/CustomAddModal'
import GoalSetter from '@/components/molecules/GoalSetter'
import { waterEntryService, dailyGoalService, userStatsService } from '@/services'

const Dashboard = () => {
  const [todaysEntries, setTodaysEntries] = useState([])
  const [currentGoal, setCurrentGoal] = useState({ targetAmount: 64, unit: 'oz' })
  const [userStats, setUserStats] = useState({ currentStreak: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [showGoalSetter, setShowGoalSetter] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [entries, goal, stats] = await Promise.all([
        waterEntryService.getTodaysEntries(),
        dailyGoalService.getCurrentGoal(),
        userStatsService.getStats()
      ])
      
      setTodaysEntries(entries)
      setCurrentGoal(goal)
      setUserStats(stats)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleQuickAdd = async (amount, unit = 'oz') => {
    try {
      const newEntry = await waterEntryService.create({
        amount,
        unit,
        drinkType: 'water'
      })
      
      setTodaysEntries(prev => [...prev, newEntry])
      
      // Update stats
      const updatedStats = await userStatsService.updateStats()
      setUserStats(updatedStats)
    } catch (error) {
      throw error
    }
  }

  const handleCustomAdd = async (amount, unit, drinkType) => {
    try {
      const newEntry = await waterEntryService.create({
        amount,
        unit,
        drinkType
      })
      
      setTodaysEntries(prev => [...prev, newEntry])
      
      // Update stats
      const updatedStats = await userStatsService.updateStats()
      setUserStats(updatedStats)
    } catch (error) {
      throw error
    }
  }

  const handleDeleteEntry = async (entryId) => {
    try {
      await waterEntryService.delete(entryId)
      setTodaysEntries(prev => prev.filter(entry => entry.id !== entryId))
      
      // Update stats
      const updatedStats = await userStatsService.updateStats()
      setUserStats(updatedStats)
    } catch (error) {
      throw error
    }
  }

  const handleSaveGoal = async (targetAmount, unit) => {
    try {
      const updatedGoal = await dailyGoalService.updateCurrentGoal(targetAmount, unit)
      setCurrentGoal(updatedGoal)
      setShowGoalSetter(false)
    } catch (error) {
      throw error
    }
  }

  const getTotalToday = () => {
    return todaysEntries.reduce((total, entry) => {
      // Convert to ounces for consistent calculation
      let amount = entry.amount
      if (entry.unit === 'ml') {
        amount = amount * 0.033814 // ml to oz
      } else if (entry.unit === 'cups') {
        amount = amount * 8 // cups to oz
      }
      return total + amount
    }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-4 space-y-6">
        {/* Header skeleton */}
        <div className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
        
        {/* Progress skeleton */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex justify-center">
            <div className="w-44 h-44 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Quick actions skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💧</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const totalToday = getTotalToday()

  return (
    <div className="min-h-full bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-6 pb-20">
        <DashboardHeader 
          currentStreak={userStats.currentStreak}
          userName="there"
        />
        
        <ProgressSection
          current={Math.round(totalToday)}
          goal={currentGoal.targetAmount}
          unit={currentGoal.unit}
        />
        
        {showGoalSetter ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GoalSetter
              currentGoal={currentGoal.targetAmount}
              unit={currentGoal.unit}
              onSave={handleSaveGoal}
              onCancel={() => setShowGoalSetter(false)}
            />
          </motion.div>
        ) : (
          <QuickActions
            onQuickAdd={handleQuickAdd}
            onCustomAdd={() => setShowCustomModal(true)}
            onSetGoal={() => setShowGoalSetter(true)}
          />
        )}
        
        <TodaysLog
          entries={todaysEntries}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>
      
      <CustomAddModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onAdd={handleCustomAdd}
      />
    </div>
  )
}

export default Dashboard