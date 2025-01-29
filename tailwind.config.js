export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Look for JS files in the src folder
    "./public/index.html", // Look for index.html in the public folder
    "./node_modules/@headlessui/react/**/*.{js,ts,jsx,tsx}", // Look for JS files in the @headlessui/react package
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
