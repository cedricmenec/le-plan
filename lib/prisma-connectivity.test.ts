import { describe, it, expect } from 'vitest';
import { prisma } from './prisma';

describe('Prisma Connectivity', () => {
  it('should be able to query the database', async () => {
    // We try to query projects since we know this table exists in public schema
    const projects = await prisma.projects.findMany({
      take: 1
    });
    
    expect(Array.isArray(projects)).toBe(true);
  });
});
