import { describe, it, expect, vi } from 'vitest';

describe('Prisma Client Singleton', () => {
  it('should export a prisma instance', async () => {
    // We import dynamically to test the singleton behavior
    const { prisma } = await import('./prisma');
    expect(prisma).toBeDefined();
  });

  it('should reuse the same instance (singleton pattern)', async () => {
    const { prisma: prisma1 } = await import('./prisma');
    
    // Clear cache to simulate multiple imports if needed, 
    // but standard ESM import should return the same object.
    const { prisma: prisma2 } = await import('./prisma');
    
    expect(prisma1).toBe(prisma2);
  });
});
