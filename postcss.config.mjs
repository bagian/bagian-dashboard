import path from "path";

// Plugin kita harus jalan sebelum dan sesudah Tailwind agar tidak ada color()/oklch yang lolos ke parser
const pluginPath = path.resolve(process.cwd(), "postcss-oklch-to-hex.cjs");

const config = {
  plugins: [
    pluginPath,
    "@tailwindcss/postcss",
    pluginPath,
  ],
};

export default config;
