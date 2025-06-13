import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'

const Layout = () => {
  const location = useLocation()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 flex-shrink-0 z-40">
        <div className="flex justify-around items-center">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-surface'
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <ApperIcon
                      name={route.icon}
                      size={24}
                      className={`transition-colors duration-200 ${
                        isActive ? 'text-primary' : 'text-gray-500'
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </motion.div>
                  <span className="text-xs mt-1 font-medium">{route.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Layout