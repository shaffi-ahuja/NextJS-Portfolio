/**
 * Test Setup File
 * Place at: src/__tests__/setup/jest.setup.ts
 */

import "@testing-library/jest-dom";

// Mock environment variables
process.env.UPSTASH_REDIS_REST_URL = "https://test.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
process.env.SMTP_SERVER_HOST = "smtp.gmail.com";
process.env.SMTP_SERVER_USERNAME = "test@gmail.com";
process.env.SMTP_SERVER_PASSWORD = "test-password";
process.env.SITE_MAIL_RECIEVER = "owner@example.com";

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Mock fetch globally
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(public callback: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// Suppress console errors in tests (re-enable in tests that expect them)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Warning: useLayoutEffect"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
