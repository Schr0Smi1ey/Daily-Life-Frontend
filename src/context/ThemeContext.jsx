import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children, initialPrefs }) {
  const [theme,        setTheme]        = useState(initialPrefs?.theme        || 'system')
  const [primaryColor, setPrimaryColor] = useState(initialPrefs?.primaryColor || '#f97316')

  // Apply theme class to <html>
  useEffect(() => {
    const root   = document.documentElement
    const isDark =
      theme === 'dark' ? true :
      theme === 'light' ? false :
      window.matchMedia('(prefers-color-scheme: dark)').matches

    if (isDark) root.classList.add('dark')
    else        root.classList.remove('dark')
  }, [theme])

  // Apply primary color CSS variable to :root
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', primaryColor)

    // Also derive RGB values for opacity variants
    const hex = primaryColor.replace('#', '')
    const r   = parseInt(hex.substring(0, 2), 16)
    const g   = parseInt(hex.substring(2, 4), 16)
    const b   = parseInt(hex.substring(4, 6), 16)
    document.documentElement.style.setProperty('--color-primary-rgb', `${r}, ${g}, ${b}`)
  }, [primaryColor])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return
    const mq      = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (e.matches) document.documentElement.classList.add('dark')
      else           document.documentElement.classList.remove('dark')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      primaryColor, setPrimaryColor
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)