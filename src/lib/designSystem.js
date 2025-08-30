/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primaryLight: '#3B82F6',    // Conan's bow tie blue
                primaryDark: '#1E40AF',
                secondaryLight: '#EF4444',  // Detective red
                secondaryDark: '#991B1B',
                bgLight: '#F9FAFB',
                bgDark: '#111827',
                surfaceLight: '#FFFFFF',
                surfaceDark: '#1F2937',
            },
            fontFamily: {
                heading: ['Inter', 'system-ui'],
                body: ['Inter', 'system-ui'],
                japanese: ['Noto Sans JP'],
            },
        },
    },
    plugins: [],
}
