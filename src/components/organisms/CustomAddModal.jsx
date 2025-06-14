import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import drinkTypeService from '@/services/api/drinkTypeService'
import { toast } from 'react-toastify'
const CustomAddModal = ({ 
  isOpen, 
  onClose, 
  onAdd,
  className = '' 
}) => {
const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('oz')
  const [drinkType, setDrinkType] = useState('water')
  const [drinkTypes, setDrinkTypes] = useState([])
  const [selectedMultiplier, setSelectedMultiplier] = useState(1.0)
  const [isLoading, setIsLoading] = useState(false)

  const units = ['oz', 'ml', 'cups']

  useEffect(() => {
    const loadDrinkTypes = async () => {
      try {
        const types = await drinkTypeService.getActiveTypes()
        setDrinkTypes(types)
      } catch (error) {
        console.error('Failed to load drink types:', error)
      }
    }
    loadDrinkTypes()
  }, [])

  useEffect(() => {
    const updateMultiplier = async () => {
      try {
        const multiplier = await drinkTypeService.getHydrationMultiplier(drinkType)
        setSelectedMultiplier(multiplier)
      } catch (error) {
        setSelectedMultiplier(1.0)
      }
    }
    updateMultiplier()
  }, [drinkType])

  const getHydrationPreview = () => {
    if (!amount || amount <= 0) return null
    const hydrationPoints = Math.round((Number(amount) * selectedMultiplier) * 100) / 100
    return hydrationPoints !== Number(amount) ? hydrationPoints : null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    
    try {
      await onAdd(Number(amount), unit, drinkType)
      toast.success(`Added ${amount}${unit} of ${drinkType}!`, {
        icon: drinkTypes.find(d => d.value === drinkType)?.icon
      })
      setAmount('')
      setDrinkType('water')
      onClose()
    } catch (error) {
      toast.error('Failed to add entry')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleBackdropClick}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
<div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Add Custom Amount
                  </h3>
                  <p className="text-gray-600">
                    Track your hydration with custom amounts
                  </p>
                </div>
                {getHydrationPreview() && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Hydration Value</div>
                    <div className="text-lg font-semibold text-primary">
                      {getHydrationPreview()} pts
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      label="Amount"
                      placeholder="Enter amount"
                      min="0.1"
                      step="0.1"
                      required
                    />
                  </div>
                  
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      {units.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

<div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Drink Type
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {drinkTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDrinkType(type.value)}
                        className={`
                          p-3 rounded-xl border-2 transition-all duration-200 text-left
                          ${drinkType === type.value 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{type.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">
                              {Math.round(type.hydrationMultiplier * 100)}% effectiveness
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    loading={isLoading}
                  >
                    Add Entry
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CustomAddModal