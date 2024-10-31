/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
    colors: {
      primary: '#d32f2f',      // Used for main sidebar and primary actions
      secondary: '#f5f5f5',    // Background color for the app or components
      accent: '#424242',       // Used for subtle text or minor accents
      textPrimary: '#212121',  // Default text color for main headings
      maroon: '#800000',       // Highlighted active links or selected items
      orange: '#D97706',       // Optional color for buttons or warnings
      red: '#DC2626',          // Used for error messages or critical actions
      blue: '#3B82F6',         // Primary action buttons or links
      yellow: '#F59E0B',       // Used for warning text or badges
      green: '#22c55e',        // Success messages or confirmation actions
      blueLight: '#EFF6FF',    // Light blue for background highlights (added for better contrast)
      greenLight: '#DCFCE7',   // Light green for success background highlights
    },
  },
  plugins: [],
}
