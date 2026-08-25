## 1. Reference Data Initialization

- [x] 1.1 Add an application reference-data initialization helper that delegates to the existing default milestone type seed.
- [x] 1.2 Call reference-data initialization during app startup before rendering the React application.

## 2. Verification Coverage

- [x] 2.1 Add focused Vitest coverage proving an empty local database receives default milestone types.
- [x] 2.2 Add focused Vitest coverage proving repeated initialization is idempotent and does not duplicate milestone types.
- [x] 2.3 Run the focused database tests and resolve regressions.

## 3. Final Validation

- [x] 3.1 Run the full test suite and production build.
- [x] 3.2 Run OpenSpec validation for `seed-default-milestone-types`.
