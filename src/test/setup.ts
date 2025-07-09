import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock do fetch para testes
Object.defineProperty(globalThis, "fetch", {
  value: vi.fn(),
  writable: true,
});

// Limpar mocks após cada teste
afterEach(() => {
  vi.clearAllMocks();
});
