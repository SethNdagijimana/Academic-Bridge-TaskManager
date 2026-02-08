export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  roots: ["<rootDir>/src"],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/e2e/",
    "/playwright-report/",
    "/test-results/"
  ],

  moduleNameMapper: {
    "^react-i18next$": "<rootDir>/__mocks__/react-i18next.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true
        }
      }
    ]
  },
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts"
  ],
  globals: {
    "import.meta": {
      env: {
        VITE_API_URL: "http://localhost:4000"
      }
    }
  }
}
