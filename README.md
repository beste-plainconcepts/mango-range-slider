# Mango Range Slider

Custom dual-handle range slider built with Next.js App Router, TypeScript, Tailwind CSS, and Vitest.

The project implements two range-selection exercises without using `input[type="range"]`:

- Continuous range mode with editable labels
- Fixed values mode with snapping and equal visual spacing

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Vitest + Testing Library
- pnpm

## Features

- Custom slider track and thumbs
- Two handles with non-crossing constraints
- Pointer interactions: `pointerdown`, `pointermove`, `pointerup`
- Track click support
- Keyboard support: arrow keys, `Home`, `End`
- Accessible thumbs with `role="slider"` and ARIA values
- Continuous mode with integer normalization
- Fixed mode with deduped, sorted, snapped values
- Editable labels in exercise 1
- Read-only formatted currency labels in exercise 2
- Mocked API endpoints for both exercises

## Routes

- `/` - landing page with links to both implementations
- `/exercise1` - continuous range mode
- `/exercise2` - fixed values mode
- `/api/range` - mocked response for exercise 1
- `/api/fixed-range` - mocked response for exercise 2

## API Shapes

### `GET /api/range`

```json
{ "min": 1, "max": 100 }
```

### `GET /api/fixed-range`

```json
{ "rangeValues": [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The app runs on `http://localhost:8080`.

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:watch
```

## Project Structure

```txt
app/
	api/
		fixed-range/route.ts
		range/route.ts
	exercise1/page.tsx
	exercise2/page.tsx
	globals.css
	layout.tsx
	page.tsx
components/
	range/
		Range.tsx
		Range.test.tsx
		FixedRange.test.tsx
		components/
				RangeHeader.test.tsx
			RangeHeader.tsx
			RangeLabel.tsx
			RangeLabel.test.tsx
				RangeThumb.test.tsx
			RangeThumb.tsx
				RangeTrack.test.tsx
			RangeTrack.tsx
		services/
			range.ts
hooks/
	useRange.ts
tests/
	setup.ts
types/
	range.ts
utils/
	range.ts
	range.test.ts
```

## Architecture

The app follows a small layered structure:

1. Server page fetches mocked data from a lightweight service.
2. Page renders a shared header and passes normalized props into a client slider component.
3. Client slider delegates interaction logic to a reusable hook.
4. Presentation is split into track, thumb, and label subcomponents.
5. Shared math and fixed-value helpers live in pure utilities.

### Data Flow

```txt
app/exercise1/page.tsx or app/exercise2/page.tsx
	-> components/range/services/range.ts
	-> RangeHeader + Range
	-> useRange
	-> RangeTrack + RangeThumb + RangeLabel
	-> utils/range.ts
```

## Component Responsibilities

### `Range`

Shared slider implementation for both modes.

Responsibilities:

- Supports continuous mode with `min` and `max` props
- Supports fixed mode with `variant="fixed"` and `values`
- Maintains editable limits only for continuous mode
- Synchronizes limit changes with the selected range via `setRangeValues`
- Renders the correct labels, ticks, and formatting based on the active variant
- Renders two `RangeThumb` instances inside `RangeTrack`

### `RangeHeader`

Shared page-level header component.

Responsibilities:

- Renders subtitle, title, and description
- Keeps presentation text outside the slider logic
- Allows exercise pages to control content without duplicating header markup

### `RangeTrack`

Presentation component for the slider rail.

Responsibilities:

- Exposes the track ref used for pointer calculations
- Handles click and pointer start on the track
- Draws the full rail and selected segment
- Hosts thumbs and optional decorations as children

### `RangeThumb`

Accessible thumb button.

Responsibilities:

- Exposes `role="slider"`
- Sets `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Handles keyboard input and pointer start
- Switches cursor state between `grab` and `grabbing`
- Displays hover and focus-visible states

### `RangeLabel`

Value display and optional editor.

Responsibilities:

- Read-only display mode for fixed values
- Editable input mode for continuous values
- Value parsing, clamping, and rounding on commit
- Optional formatting via `formatterAction`

## Hook Architecture

### `useRange`

`useRange` is the core interaction hook shared by both `Range` variants.

It handles:

- current min/max selection state
- pointer-to-value conversion
- drag lifecycle management
- track-click thumb selection
- fixed-value snapping
- continuous integer normalization
- keyboard stepping for both modes
- min/max non-crossing constraints
- percent calculation for visual positioning

### Hook Inputs

```ts
type UseRangeOptions = {
	minLimit: number;
	maxLimit: number;
	initialMin: number;
	initialMax: number;
	fixedValues?: number[];
};
```

### Hook Outputs

The hook returns:

- `trackRef`
- `minValue`, `maxValue`
- `minPercent`, `maxPercent`
- dragging flags for each thumb
- setter helpers for values
- pointer and keyboard handlers

## Utilities

Shared range math lives in `utils/range.ts`.

Current utilities:

- `clamp`
- `valueToPercent`
- `percentToValue`
- `getClosestFixedValue`
- `getNextFixedValue`
- `sortedUniqueValues`

These functions stay pure and deterministic, which keeps the hook smaller and makes unit testing straightforward.

## Types

Shared types live in `types/range.ts`.

- `RangeValues` - API shape for continuous mode
- `FixedRangeValues` - API shape for fixed mode
- `RangeSelection` - generic selected interval shape

## Interaction Model

### Continuous Mode

- Values are clamped inside the current bounds
- Values are rounded to integers
- Thumbs cannot cross each other
- Footer labels are editable and update the active min/max constraints

### Fixed Mode

- Values are snapped to the closest valid fixed value
- Fixed values are sorted and deduplicated before use
- Equal visual spacing is achieved with `valueToPercent`
- The same footer labels are read-only and formatted as EUR currency

## Accessibility

Each thumb is an interactive button with slider semantics:

- `role="slider"`
- `aria-orientation="horizontal"`
- `aria-valuemin`
- `aria-valuemax`
- `aria-valuenow`

Supported keyboard interactions:

- `ArrowLeft`
- `ArrowRight`
- `Home`
- `End`

## Testing Strategy

The test suite covers utility and integration behavior.

### Utility Tests

`utils/range.test.ts`

Covers:

- clamping
- percent/value conversions
- closest fixed value lookup
- discrete stepping
- fixed-value sorting and deduplication

### Component Tests

`components/range/Range.test.tsx`

Covers:

- initial rendering
- accessibility attributes
- keyboard interactions
- pointer dragging
- track click behavior
- non-crossing constraints
- label editing and normalization

`components/range/FixedRange.test.tsx`

Covers:

- fixed variant rendering through `Range`
- currency rendering
- non-editable labels
- discrete keyboard stepping
- snapping on drag
- empty and single-value edge cases
- sort/dedup behavior

`components/range/components/RangeLabel.test.tsx`

Covers:

- formatter output
- blur commit
- clamp and round behavior
- invalid input recovery
- escape to cancel editing

`components/range/components/RangeHeader.test.tsx`

Covers:

- subtitle rendering
- title rendering as heading
- description rendering

`components/range/components/RangeThumb.test.tsx`

Covers:

- slider accessibility attributes
- positioning and dragging cursor styles
- pointer and keyboard event forwarding

`components/range/components/RangeTrack.test.tsx`

Covers:

- track and selected segment rendering
- child rendering within track
- track ref wiring
- pointer event forwarding

## Design Notes

The UI uses an editorial visual language:

- soft neutral surface background
- thin track with high-contrast selected range
- serif display typography for headings
- subtle motion on hover/focus
- minimal, product-style labels and dividers

## Development Notes

- The pages fetch data on the server and pass it into client components.
- Mocked API routes and local services intentionally mirror the same data shape.
- The slider implementation avoids native range inputs to keep interaction logic fully custom and testable.
- The project uses a plain app structure with `app`, `components`, `hooks`, `utils`, `types`, and `tests` folders only.
- Services live inside the Range module under `components/range/services/`.
- Tests are co-located next to the files they test.
- No barrel files (`index.ts`) are used anywhere.

## Possible Next Refactors

- extract dynamic limit synchronization from `Range.tsx`
- split `useRange` into smaller internal hooks while preserving its public API
- simplify `RangeLabel` by separating display and edit behavior more explicitly
