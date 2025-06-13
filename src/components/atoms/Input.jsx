import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder,
  error,
  icon,
  suffix,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (e) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange?.(e)
  }

  const hasValue = localValue && localValue.toString().length > 0

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type={type}
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={!label ? placeholder : ''}
          className={`
            w-full px-4 py-3 text-gray-900 bg-white border rounded-xl transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error/50 focus:border-error' : 'border-gray-200'}
            ${icon ? 'pl-11' : ''}
            ${suffix ? 'pr-12' : ''}
            ${label ? 'pt-6 pb-2' : ''}
          `}
          {...props}
        />
        
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={20} className="text-gray-400" />
          </div>
        )}
        
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
            {suffix}
          </div>
        )}
        
        {label && (
          <motion.label
            initial={false}
            animate={{
              y: isFocused || hasValue ? -8 : 8,
              scale: isFocused || hasValue ? 0.85 : 1,
              color: isFocused 
                ? error ? '#EF4444' : '#0EA5E9'
                : error ? '#EF4444' : '#6B7280'
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none origin-left font-medium"
          >
            {label}
          </motion.label>
        )}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  )
}

export default Input