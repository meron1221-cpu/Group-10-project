'use client'

// ThemeProvider component wraps the app with the Next.js themes context.
// This enables dynamic light/dark mode support and custom theming across the application.
// It simply forwards all props to the `NextThemesProvider` from the `next-themes` package.
import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
// end