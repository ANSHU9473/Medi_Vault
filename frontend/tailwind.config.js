/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Single calm blue as primary — professional, clinical
                primary: {
                    50: '#eef3fc',
                    100: '#d6e4f9',
                    200: '#adc8f3',
                    300: '#80a8ec',
                    400: '#5c8de4',
                    500: '#4c8bf5',
                    600: '#3b6fd4',
                    700: '#2d55a8',
                    800: '#243f7e',
                    900: '#1b2f5e',
                    950: '#111c38',
                },
                // Medical accent — muted blue only, no teal/cyan
                medical: {
                    teal: '#4c8bf5',          // was vivid teal, now calm blue
                    'teal-light': '#a8c4f5',  // soft blue highlight
                    'teal-dark': '#3b6fd4',
                    blue: '#4c8bf5',
                    'blue-light': '#a8c4f5',
                    green: '#2d6a4f',          // muted green
                    red: '#c0392b',            // kept for emergencies
                    'red-light': '#e8a09a',
                },
                // Dark surface palette — deeper, less purple
                surface: {
                    50: '#f0f2f5',
                    100: '#dde2e8',
                    200: '#c0c8d2',
                    300: '#8b949e',
                    400: '#6e7681',
                    700: '#21262d',
                    800: '#161b22',
                    900: '#0d1117',
                    950: '#010409',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'spin-slow': 'spin 8s linear infinite',
                'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glass': '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
                'glass-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.3)',
                'medical': '0 2px 12px -2px rgba(76, 139, 245, 0.15)',
                'emergency': '0 2px 12px -2px rgba(192, 57, 43, 0.25)',
            },
        },
    },
    plugins: [],
};
