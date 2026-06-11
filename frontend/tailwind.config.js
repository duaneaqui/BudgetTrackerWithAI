/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#657084",
        line: "#dde3ec",
        shell: "#f4f7fb",
        brand: "#0f8b8d",
        coral: "#f25c54",
        mango: "#f7b32b"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(23, 32, 51, 0.08)"
      }
    },
  },
  plugins: [],
};
