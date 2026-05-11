/**
 * API Route Tests: POST /api/portfolio
 * Place at: src/__tests__/api/portfolio.test.ts
 *
 * NOTE: These tests are skipped by default as they require Next.js specific
 * test environment configuration. To properly test Next.js API routes, use:
 * - next/experimental/testing library
 * - or separate Node.js test configuration
 */

import { POST } from "@/app/api/portfolio/route";
import { NextRequest } from "next/server";
import { minimalValidPortfolio } from "../fixtures/portfolio.fixture";
import { createRedisMock } from "../mocks/redis.mock";

// Mock storage module
jest.mock("@/lib/storage", () => ({
  savePortfolio: jest.fn(),
  isSlugTaken: jest.fn(),
  checkRateLimit: jest.fn(),
}));

// Skip these tests - require Next.js specific test environment
describe.skip("POST /api/portfolio", () => {
  let mockRedis: ReturnType<typeof createRedisMock>;

  beforeEach(() => {
    mockRedis = createRedisMock();
    jest.clearAllMocks();
  });

  const createRequest = (body: any, ip = "192.168.1.1"): any => {
    const request = new NextRequest("http://localhost/api/portfolio", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "x-forwarded-for": ip,
      },
    });
    return request;
  };

  test("should create portfolio with valid data", async () => {
    const {
      savePortfolio,
      isSlugTaken,
      checkRateLimit,
    } = require("@/lib/storage");
    isSlugTaken.mockResolvedValue(false);
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });
    savePortfolio.mockResolvedValue(undefined);

    const request = createRequest(minimalValidPortfolio);
    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.slug).toBe("testuser123");
    expect(data.url).toBe("/user/testuser123");
    expect(savePortfolio).toHaveBeenCalled();
  });

  test("should return 400 for invalid JSON", async () => {
    const request = new NextRequest("http://localhost/api/portfolio", {
      method: "POST",
      body: "invalid json{",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Invalid JSON");
  });

  test("should return 422 for validation errors", async () => {
    const { checkRateLimit } = require("@/lib/storage");
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });

    const invalid = { ...minimalValidPortfolio, slug: "invalid_slug!" };
    const request = createRequest(invalid);
    const response = await POST(request);

    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Validation failed");
    expect(data.issues).toBeDefined();
  });

  test("should return 409 for duplicate slug", async () => {
    const { isSlugTaken, checkRateLimit } = require("@/lib/storage");
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });
    isSlugTaken.mockResolvedValue(true);

    const request = createRequest(minimalValidPortfolio);
    const response = await POST(request);

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toContain("already taken");
  });

  test("should return 429 for rate limit exceeded", async () => {
    const { checkRateLimit } = require("@/lib/storage");
    checkRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });

    const request = createRequest(minimalValidPortfolio);
    const response = await POST(request);

    expect(response.status).toBe(429);
    const data = await response.json();
    expect(data.error).toContain("Too many");
  });

  test("should extract IP correctly", async () => {
    const { checkRateLimit } = require("@/lib/storage");
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });

    const testIPs = [
      "192.168.1.1",
      "10.0.0.1, 192.168.1.1", // Should extract first
      "::1", // IPv6
    ];

    for (const ip of testIPs) {
      jest.clearAllMocks();
      checkRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });

      const request = createRequest(minimalValidPortfolio, ip);
      await POST(request);

      expect(checkRateLimit).toHaveBeenCalled();
    }
  });

  test("should return remaining count", async () => {
    const {
      isSlugTaken,
      checkRateLimit,
      savePortfolio,
    } = require("@/lib/storage");
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 1 });
    isSlugTaken.mockResolvedValue(false);
    savePortfolio.mockResolvedValue(undefined);

    const request = createRequest(minimalValidPortfolio);
    const response = await POST(request);

    const data = await response.json();
    expect(data.remaining).toBe(1);
  });

  test("should return 503 when Redis not configured", async () => {
    const { savePortfolio } = require("@/lib/storage");
    savePortfolio.mockRejectedValue(new Error("REDIS_NOT_CONFIGURED"));

    const request = createRequest(minimalValidPortfolio);
    const response = await POST(request);

    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.error).toContain("Storage not configured");
  });

  test("should handle server errors gracefully", async () => {
    const {
      checkRateLimit,
      isSlugTaken,
      savePortfolio,
    } = require("@/lib/storage");
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });
    isSlugTaken.mockResolvedValue(false);
    savePortfolio.mockRejectedValue(new Error("Unexpected error"));

    const request = createRequest(minimalValidPortfolio);
    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test("should validate all required fields", async () => {
    const { checkRateLimit } = require("@/lib/storage");
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });

    const incomplete = { slug: "test" }; // Missing most fields
    const request = createRequest(incomplete);
    const response = await POST(request);

    expect(response.status).toBe(422);
  });

  test("should handle missing header gracefully", async () => {
    const { checkRateLimit } = require("@/lib/storage");
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 2 });

    const request = new NextRequest("http://localhost/api/portfolio", {
      method: "POST",
      body: JSON.stringify(minimalValidPortfolio),
    });

    const response = await POST(request);
    // Should use 'unknown' as fallback IP
    expect(checkRateLimit).toHaveBeenCalled();
  });
});
