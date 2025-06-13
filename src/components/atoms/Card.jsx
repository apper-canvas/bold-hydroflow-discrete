import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  glass = false,
  wave = false,
  ...props 
}) => {
  const baseClasses = 'rounded-xl overflow-hidden'
  const surfaceClasses = glass 
    ? 'glass' 
    : 'bg-white shadow-sm border border-gray-100'
  const waveClasses = wave ? 'wave-pattern' : ''
  
  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { y: -2, shadow: '0 8px 25px rgba(0,0,0,0.12)' },
    transition: { duration: 0.2 }
  } : {}

  return (
    <Component
      className={`${baseClasses} ${surfaceClasses} ${waveClasses} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card