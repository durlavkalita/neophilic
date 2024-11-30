/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
  },
};
