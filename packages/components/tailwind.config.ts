import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn76g7re6eaetkbr28pxzdp73x7sk4zg/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
