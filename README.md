# Turborepo

This is a Turborepo with multiple meta-frameworks all working in harmony and sharing packages.

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `api`: an [Express](https://expressjs.com/) server
- `runner`:
- `web`: a [Next.js](https://nextjs.org/) app
- `@kraft/eslint-config`: ESLint configurations used throughout the monorepo
- `@kraft/jest-presets`: Jest configurations
- `@kraft/logger`: isomorphic logger (a small wrapper around console.log)
- `@kraft/ui`: a dummy React UI library (which contains `<CounterButton>` and `<Link>` components)
- `@kraft/typescript-config`: tsconfig.json's used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
