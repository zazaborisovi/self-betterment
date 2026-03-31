// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        'brand-bg': 'var(--bg-main)',
        'brand-card': 'var(--bg-card)',
        'brand-text': 'var(--text-primary)',
        'brand-text-dim': 'var(--text-secondary)',
        'brand-border': 'var(--border-color)',
        'brand-input': 'var(--input-bg)',
        'brand-accent': 'var(--accent)',
        'brand-accent-hover': 'var(--accent-hover)',

        'neon-cyan': 'var(--neon-cyan)',
        'neon-pink': 'var(--neon-pink)',
        'neon-purple': 'var(--neon-purple)',
        'neon-green': 'var(--neon-green)',
      },
      boxShadow: {
        'neon-cyan': 'var(--glow-cyan)',
        'neon-pink': 'var(--glow-pink)',
        'neon-purple': 'var(--glow-purple)',
        'neon-green': 'var(--glow-green)',
      },
      dropShadow: {
        'neon-cyan': '0 0 10px var(--neon-cyan)',
        'neon-pink': '0 0 10px var(--neon-pink)',
        'neon-purple': '0 0 10px var(--neon-purple)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(to right, var(--neon-cyan), var(--neon-purple))',
        'gradient-cyber': 'linear-gradient(to right, var(--neon-pink), var(--neon-purple))',
      }
    },
  },
  plugins: [],
}