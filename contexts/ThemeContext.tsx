"use client"

import React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'

type Theme = 'light' | 'dark' | 'system'

// Re-export the ThemeProvider from next-themes
export function ThemeProvider({ 
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Custom useTheme hook that provides a simpler API
export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme()
  
  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }
  
  return { 
    theme: (theme as Theme) || 'system',
    setTheme, 
    toggleTheme,
    systemTheme 
  }
} 