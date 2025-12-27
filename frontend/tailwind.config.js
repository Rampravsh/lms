/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    50: '#e6ebf5',
                    100: '#ccd7eb',
                    200: '#99b0d6',
                    300: '#6688c2',
                    400: '#3361ad',
                    500: '#003999', // Base
                    600: '#002e7a',
                    700: '#00225c',
                    800: '#112240', // Deep Navy for backgrounds
                    900: '#0a192f', // Darkest Navy
                },
                mint: {
                    50: '#e0fffa',
                    100: '#b3fff0',
                    200: '#80ffe6',
                    300: '#4dffdb',
                    400: '#26ffd6',
                    500: '#64ffda', // Base Mint
                    600: '#33ccad',
                    700: '#009980',
                    800: '#006655',
                    900: '#00332b',
                },
                neon: {
                    purple: '#b026ff',
                    blue: '#26f7fd',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
