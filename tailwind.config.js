export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cab: {
          bg: '#080b14',
          surface: '#0d1117',
          elevated: '#161b27',
          border: '#1e2535',
          'border-active': '#2d3a52',
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          cyan: '#06b6d4',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          text: '#f0f6fc',
          muted: '#8b949e',
          subtle: '#484f58',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'blue-sm': '0 0 15px rgba(59,130,246,0.12)',
        'blue-md': '0 0 30px rgba(59,130,246,0.18)',
        'blue-lg': '0 0 60px rgba(59,130,246,0.2)',
        'success-sm': '0 0 15px rgba(16,185,129,0.15)',
        card: '0 1px 3px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
