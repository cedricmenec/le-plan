# Specification: Prisma Migration Setup

## 1. Overview
This track aims to integrate Prisma and Prisma Migrate into the project to manage the database schema and migrations. The goal is to move from manual schema management to a version-controlled, automated migration system while preserving the existing Supabase database structure.

## 2. Functional Requirements
- **Installation:** Install `prisma` as a development dependency and `@prisma/client` as a production dependency.
- **Initialization:** Initialize Prisma in the project, creating the `prisma/` directory.
- **Configuration:** 
    - Configure `prisma/schema.prisma` to use the PostgreSQL provider and the `DATABASE_URL` environment variable.
    - Set up a direct connection to the Supabase database.
- **Introspection & Baselining:**
    - Introspect the existing Supabase database to automatically generate the initial `schema.prisma`.
    - Create a baseline migration (`0_init`) that captures the current state.
    - Mark the baseline migration as applied to the existing database to prevent re-creation of existing tables.
- **Client Implementation:**
    - Create a singleton Prisma Client instance in `lib/prisma.ts` to manage connections efficiently in Next.js development and production environments.
    - Generate the Prisma Client types based on the introspected schema.

## 3. Non-Functional Requirements
- **Type Safety:** Ensure Prisma Client is correctly typed and integrated with the existing TypeScript setup.
- **Performance:** Use a singleton pattern for Prisma Client to avoid connection exhaustion.
- **Maintainability:** Ensure migrations are clean and represent a reliable history of schema changes.

## 4. Acceptance Criteria
- [ ] Prisma and @prisma/client are installed.
- [ ] `prisma/schema.prisma` exists and accurately reflects the current database schema.
- [ ] `prisma/migrations/` contains the `0_init` baseline migration.
- [ ] `lib/prisma.ts` exists and exports a singleton Prisma Client instance.
- [ ] `npx prisma migrate status` reports that the database is up to date.
- [ ] A simple test or script can successfully query the database using the new Prisma Client.

## 5. Out of Scope
- Refactoring existing database access logic (Supabase Client) to use Prisma.
- Setting up connection pooling (Supavisor).
- Database seeding.
