module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coverageReporters: ["html-spa", "lcovonly", "text-summary"],
  collectCoverageFrom: ["source/**/*.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
};
