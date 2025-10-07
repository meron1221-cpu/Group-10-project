// Import the type definition for Tailwind CSS configuration
import type { Config } from "tailwindcss";

// Define the Tailwind configuration object
const config: Config = {

  // Enables dark mode using a specific CSS class (instead of media query)
  // This means dark mode activates when you add 'class="dark"' to an element
  darkMode: ["class"],

  // Define all file paths Tailwind should scan for class names
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",       // All files in 'pages' folder
    "./components/**/*.{js,ts,jsx,tsx,mdx}",  // All files in 'components' folder
    "./app/**/*.{js,ts,jsx,tsx,mdx}",         // All files in 'app' folder (Next.js app dir)
    "*.{js,ts,jsx,tsx,mdx}",                  // Root-level files
  ],

  // Configure the design theme
  theme: {
    extend: { // Extend Tailwind’s default theme (instead of replacing it)

      // Custom color definitions using CSS variables (HSL color model)
      colors: {
        background: "hsl(var(--background))",   // General background color
        foreground: "hsl(var(--foreground))",   // General text/foreground color

        // Color sets for specific UI elements (card, popover, etc.)
        card: {
          DEFAULT: "hsl(var(--card))",          // Card background
          foreground: "hsl(var(--card-foreground))", // Card text color
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",       // Popover background
          foreground: "hsl(var(--popover-foreground))", // Popover text
        },

        // Primary theme color set
        primary: {
          DEFAULT: "hsl(var(--primary))",       // Main primary color
          foreground: "hsl(var(--primary-foreground))", // Text on primary background
        },

        // Secondary theme color set
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        // Muted colors (less prominent)
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        // Accent colors (used for highlighting)
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        // Destructive or error-related colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        // Border, input, and ring colors for general UI components
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Chart color palette (used for data visualizations)
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // Sidebar color set (for dashboard or navigation)
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",              // Sidebar background
          foreground: "hsl(var(--sidebar-foreground))",           // Sidebar text
          primary: "hsl(var(--sidebar-primary))",                 // Sidebar main color
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))", // Text on primary
          accent: "hsl(var(--sidebar-accent))",                   // Accent in sidebar
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",   // Text on accent
          border: "hsl(var(--sidebar-border))",                   // Sidebar border
          ring: "hsl(var(--sidebar-ring))",                       // Sidebar focus ring
        },
      },

      // Custom border radius sizes using CSS variables
      borderRadius: {
        lg: "var(--radius)",                // Large border radius
        md: "calc(var(--radius) - 2px)",    // Medium border radius
        sm: "calc(var(--radius) - 4px)",    // Small border radius
      },

      // Define custom keyframe animations
      keyframes: {
        // Accordion open animation (expanding height)
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        // Accordion close animation (collapsing height)
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      // Assign the custom keyframes to animation utilities
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out", // Runs the down animation
        "accordion-up": "accordion-up 0.2s ease-out",     // Runs the up animation
      },
    },
  },

  // Add Tailwind plugins for extended functionality
  plugins: [
    require("tailwindcss-animate"), // Plugin for advanced animation utilities
  ],
};

// Export the config as default so Tailwind can use it
export default config;
