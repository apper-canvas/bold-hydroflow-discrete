import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  ripple = true,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg focus:ring-primary/50 active:scale-95',
    secondary: 'bg-surface text-primary border border-primary/20 hover:bg-primary/5 focus:ring-primary/50',
    accent: 'bg-gradient-to-r from-accent to-emerald-600 text-white hover:shadow-lg focus:ring-accent/50 active:scale-95',
    ghost: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-300',
    glass: 'glass text-primary hover:bg-white/40 focus:ring-primary/30'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  const handleClick = (e) => {
    if (disabled || loading) return
    
    if (ripple && (variant === 'primary' || variant === 'accent')) {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2
      
      const rippleElement = document.createElement('div')
      rippleElement.className = 'absolute rounded-full bg-white/30 pointer-events-none animate-ripple'
      rippleElement.style.width = rippleElement.style.height = size + 'px'
      rippleElement.style.left = x + 'px'
      rippleElement.style.top = y + 'px'
      
      button.appendChild(rippleElement)
      
      setTimeout(() => {
        rippleElement.remove()
      }, 600)
    }
    
    onClick?.(e)
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mr-2"
        >
          <ApperIcon name="Loader2" size={16} />
        </motion.div>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </motion.button>
  )
}

export default Button