/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#4da6ff',
                    DEFAULT: '#0066cc',
                    dark: '#004080',
                },
                secondary: {
                    light: '#ffd699',
                    DEFAULT: '#ffaa00',
                    dark: '#cc8800',
                },
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}