# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Lint code
npm run lint

# Deploy (build + start)
npm run deploy

# Deploy to Vercel
npm run deploy:vercel
```

## Architecture Overview

This is a **Next.js 15.2.4** application using the App Router with React 19 and TypeScript. The project is a marketing landing page with sophisticated animations and client-side interactions.

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui (50+ components) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Theme**: next-themes for dark/light mode

### Project Structure

```
app/                    # Next.js App Router
  ├── layout.tsx        # Root layout with font imports (Inter, Newsreader)
  ├── page.tsx          # Main landing page (1567 lines - monolithic component)
  └── globals.css       # Global styles + Tailwind directives

components/
  ├── ui/               # shadcn/ui library (50+ components)
  ├── momentum-logo.tsx # Custom animated logo with 3 states
  └── theme-provider.tsx

lib/
  └── utils.ts          # cn() helper (clsx + tailwind-merge)

hooks/
  ├── use-mobile.tsx    # Mobile detection hook
  └── use-toast.ts      # Toast notifications

contexts/               # React Context providers (currently empty)
```

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json` and `components.json`:

- `@/components` → `/components`
- `@/lib` → `/lib`
- `@/hooks` → `/hooks`
- `@/ui` → `/components/ui`
- `@/utils` → `/lib/utils`

Always use these aliases when importing.

## Key Architectural Patterns

### Component Organization

1. **UI Library Components** (`/components/ui`): Pre-built shadcn/ui components. Do not modify these directly - they're designed to be copied and customized.

2. **Custom Components** (`/components`): Project-specific components like `momentum-logo.tsx` with complex SVG animations.

3. **Page Components** (`/app/page.tsx`): Currently a monolithic client component. Consider breaking into smaller components when adding features.

### State Management

The application uses **local React state** (`useState`) without external state management libraries. State is primarily managed in `app/page.tsx` for:
- Animation sequences (intro stages, transitions)
- UI interactions (modals, hover states)
- Form data (name, email, language)
- Scroll/cursor tracking

### Animation System

Heavy use of animations through multiple approaches:

1. **Tailwind CSS**: Utility classes for transitions
2. **CSS-in-JSX**: Inline styles with custom keyframes
3. **Scoped Styles**: `<style jsx>` blocks for component-specific animations
4. **SVG Animations**: SMIL animations in `MomentumLogo`

Key animation patterns in `page.tsx`:
- Multi-stage intro sequence (0-3)
- Cursor tracking effects
- Scroll-based visibility
- Staggered entry animations

### Feature Flags

Environment variables control feature visibility:

```typescript
// .env.local
NEXT_PUBLIC_SHOW_WEEKLY_BUILDS=true
```

Check environment variables before adding features that should be toggleable.

## Styling Conventions

### Tailwind Configuration

- **Color System**: CSS variables defined in `globals.css` (background, foreground, primary, etc.)
- **Custom Colors**: `orange-600: #FF5733` for brand color
- **Dark Mode**: Class-based (`dark:` prefix)
- **Fonts**: Inter (body), Newsreader (headings) loaded via `next/font/google`

### CSS Variables Usage

Colors use HSL with CSS variables:

```css
background: hsl(var(--background))
```

Never hardcode colors - use Tailwind utilities or CSS variables.

## Important Configuration

### next.config.mjs

⚠️ **Warning**: The build configuration currently ignores TypeScript and ESLint errors:

```javascript
eslint: { ignoreDuringBuilds: true }
typescript: { ignoreBuildErrors: true }
images: { unoptimized: true }
```

When fixing builds, check for actual type errors and linting issues that may be hidden.

### shadcn/ui Configuration

Components are configured in `components.json`:
- **Style**: default
- **Base Color**: neutral
- **CSS Variables**: enabled
- **Icon Library**: lucide

When adding shadcn/ui components, use:

```bash
npx shadcn@latest add [component-name]
```

## Common Patterns

### Client Components

Most components are client-side due to animations and interactions. Mark with `"use client"` directive.

### Hydration Safety

The codebase uses mounted state to prevent hydration mismatches:

```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

Use this pattern when adding client-only features (theme, localStorage, window APIs).

### Form Pattern

Forms use controlled components with inline state:

```typescript
const [formData, setFormData] = useState({ name: "", email: "" })
// Update with setFormData({ ...formData, field: value })
```

For complex forms, use React Hook Form (already installed).

### Component Variants

Use `class-variance-authority` (CVA) for component variants (see UI components for examples).

## Current State

### Active Features

- Landing page with animated intro sequence
- "Weekly Builds" section showcasing products (Released, Lero, MindDump)
- Interactive product rankings with hover effects
- Email signup form
- Dark/light theme support
- Responsive mobile design

### Data Source

Currently **all data is hardcoded** in `app/page.tsx`. No API integration exists. Product information is static JSX.

## Notes

- The main page (`app/page.tsx`) is extremely large (1567 lines). Consider component extraction for major features.
- No test files currently exist in the repository.
- TypeScript strict mode is enabled but build errors are ignored in production builds.
- The project uses React 19 (latest) with Next.js 15 App Router patterns.
