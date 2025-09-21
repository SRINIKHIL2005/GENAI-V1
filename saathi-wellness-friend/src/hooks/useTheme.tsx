import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Add transition class for smooth theme switching
    root.style.transition = 'background-color 0.8s ease, color 0.8s ease, border-color 0.8s ease'
    
    // Add a visual transition effect
    const transitionElement = document.createElement('div')
    transitionElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: ${theme === 'dark' ? 'linear-gradient(45deg, #1a1a2e, #16213e)' : 'linear-gradient(45deg, #667eea, #764ba2)'};
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.8s ease;
    `
    
    document.body.appendChild(transitionElement)
    
    // Trigger the transition
    setTimeout(() => {
      transitionElement.style.opacity = '0.3'
    }, 10)
    
    setTimeout(() => {
      root.classList.remove("light", "dark")

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light"

        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
      
      // Fade out the transition overlay
      transitionElement.style.opacity = '0'
      
      setTimeout(() => {
        document.body.removeChild(transitionElement)
      }, 800)
    }, 200)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
