import { Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  plugins: [],
  corePlugins: {
    preflight: false,
  },
} satisfies Config;
