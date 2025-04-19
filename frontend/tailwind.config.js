export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Add paths to your content files
  ],
  theme: {
    extend: {
      colors: {
        // Custom Colors
        "cyber-black": "#000000",
        "cyber-dark": "#0a0c14",
        "cyber-blue-bright": "#18cef2",
        "cyber-blue": "#1089bd",
        "cyber-blue-dark": "#0b4a7d",
        "cyber-blue-glow": "#38bdf8",
        "cyber-accent": "#0ff4",

        // Background and foreground colors
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Card and popover colors
        card: "#111827",
        "card-foreground": "#f2f2f2",
        popover: "#111827",
        "popover-foreground": "#f2f2f2",

        // Primary, secondary, accent colors
        primary: "var(--cyber-blue-bright)",
        "primary-foreground": "var(--cyber-dark)",
        secondary: "var(--cyber-blue)",
        "secondary-foreground": "#ffffff",
        accent: "var(--cyber-blue-glow)",
        "accent-foreground": "var(--cyber-dark)",

        // Muted elements
        muted: "#1e293b",
        "muted-foreground": "#94a3b8",

        // System colors
        destructive: "#ef4444",
        border: "rgba(24, 206, 242, 0.2)",
        input: "rgba(24, 206, 242, 0.2)",
        ring: "var(--cyber-blue)",

        // Chart colors - cyberpunk theme
        "chart-1": "var(--cyber-blue-bright)",
        "chart-2": "#3b82f6",
        "chart-3": "var(--cyber-blue)",
        "chart-4": "#06b6d4",
        "chart-5": "#0284c7",

        // Sidebar colors
        sidebar: "var(--cyber-dark)",
        "sidebar-foreground": "#f2f2f2",
        "sidebar-primary": "var(--cyber-blue-bright)",
        "sidebar-primary-foreground": "var(--cyber-dark)",
        "sidebar-accent": "var(--cyber-blue)",
        "sidebar-accent-foreground": "#ffffff",
        "sidebar-border": "rgba(24, 206, 242, 0.2)",
        "sidebar-ring": "var(--cyber-blue)",

        // Custom Cyberpunk UI Variables
        "cyber-grid-color": "rgba(24, 206, 242, 0.05)",
        "cyber-glow-primary": "rgba(24, 206, 242, 0.2)",
        "cyber-glow-strong": "rgba(24, 206, 242, 0.5)",
        "cyber-line-color": "rgba(24, 206, 242, 0.3)",
        "cyber-terminal-bg": "rgba(0, 0, 0, 0.7)",
        "cyber-text-bright": "#ffffff",
        "cyber-text-muted": "rgba(242, 242, 242, 0.7)",
        "cyber-text-dim": "rgba(242, 242, 242, 0.5)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
      animation: {
        scanline: "scanline 8s linear infinite",
        "slow-spin": "slow-spin 12s linear infinite",
        "sound-wave": "sound-wave 1.2s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
