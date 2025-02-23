export default {
  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --write --organize-imports-enabled=false --no-errors-on-unmatched",
  ],
};
