<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project AI Instructions

This project is a frontend technical challenge focused on building reusable and maintainable custom range components using Next.js App Router, TypeScript, and TailwindCSS.

The goal is to produce clean, readable, well-tested, responsive and accessible frontend code with strong component architecture and polished UX.

---

# Project Stack

- Next.js App Router
- TypeScript strict mode
- TailwindCSS
- Vitest
- React Testing Library
- pnpm

---

# General Principles

- Prefer simplicity over overengineering
- Prefer readability over abstractions
- Keep the architecture clean and maintainable
- Build reusable and composable components
- Keep responsibilities clearly separated
- Avoid unnecessary dependencies
- Implement incrementally in small steps
- Test features as they are implemented

---

# Architecture Rules

## Components
- Components should remain presentation-focused
- Components should primarily handle rendering and UI composition
- Avoid large monolithic components
- Prefer splitting reusable UI into smaller components

## Hooks
- Interaction logic belongs in hooks
- Dragging logic should be isolated into reusable hooks
- Constraint logic should be isolated into hooks or utilities
- Keyboard interaction logic should be reusable and testable

## Utilities
- Shared calculations belong in utilities
- Utilities should remain pure and deterministic
- Avoid side effects in utility functions

## Services
- Mocked API logic belongs in services
- Services should remain lightweight
- Keep mocked API responses typed

## Types
- Shared types belong in dedicated type files
- Avoid duplicated type definitions

---

# Folder Structure

Expected structure:

```txt
/app
  /exercise1
  /exercise2

/components
  /range

/hooks

/services

/utils

/types

/tests

```

---

# Coding Conventions
- Use TypeScript strict typing
- Prefer functional React components
- Use named exports
- Keep files focused and reasonably small
- Avoid deeply nested logic
- Avoid large files with mixed responsibilities
- Prefer explicit naming
- Prefer descriptive variable and function names
- Avoid magic numbers
- Extract reusable calculations
- Avoid duplicated logic
- Prefer composition over prop complexity
- Prefer early returns when appropriate
- Keep hooks focused on a single responsibility

# Styling Rules

- Use TailwindCSS only
- No inline styles
- Maintain consistent spacing
- Add subtle hover and focus transitions
- Ensure draggable affordance is visually clear
- Maintain a clean and minimal UI
- Avoid excessive animations

---

# State Management

- Keep state local whenever possible
- Avoid global state for component interactions
- Derive values instead of duplicating state
- Prefer controlled component patterns

---

# Accessibility Rules

- Support keyboard interaction
- Maintain visible focus states
- Use semantic HTML when appropriate
- Add ARIA attributes where necessary
- Ensure draggable elements are accessible
- Ensure controls are understandable for screen readers

---

# Testing Rules

- Test incrementally during implementation
- Do not postpone testing until the end
- Test hooks independently when possible
- Test drag interactions
- Test min/max constraints
- Test edge cases
- Test keyboard accessibility
- Prefer integration tests for interaction behavior
- Keep tests readable and maintainable

---

# Performance Rules

- Prefer simple implementations first
- Do not add unnecessary memoization
- Optimize only when there is a clear reason

---

# UX Expectations

The slider experience should feel polished and intuitive.

## Important interaction details

- Hover states should clearly indicate draggable behavior
- Dragging should feel smooth and responsive
- Cursor states should change appropriately
- Min and max handles must never cross
- Editable labels should remain constrained to valid values

---

# Development Workflow

Follow this implementation order whenever possible:

1. Static layout
2. Range track
3. Thumb rendering
4. Dragging interactions
5. Constraint logic
6. Editable labels
7. Keyboard support
8. Tests
9. Final polish

Implement and test incrementally.

---

# AI Guidance

## Before implementing features

- understand the existing architecture
- avoid unnecessary abstractions
- preserve consistency across the project

## When generating code

- prioritize maintainability
- prioritize readability
- keep solutions simple and explicit
- avoid generating oversized files
- avoid speculative architecture