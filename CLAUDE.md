# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Menuer is a Next.js 15 application built with TypeScript, using the App Router architecture. It integrates Supabase for backend services and shadcn/ui components for the UI layer.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
  - **IMPORTANT**: DO NOT run `npm run dev` - the development server is already running
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server

### shadcn/ui Components
- `npx shadcn@latest add <component>` - Add shadcn/ui components
- An MCP server is configured for shadcn in `.mcp.json`

## Architecture

### Directory Structure
- `app/` - Next.js App Router pages and layouts
  - `app/page.tsx` - Home page
  - `app/layout.tsx` - Root layout with Geist fonts
  - `app/instruments/page.tsx` - Instruments listing page (Server Component)
- `components/ui/` - shadcn/ui components (button, table, etc.)
- `utils/supabase/` - Supabase client configuration
- `lib/` - Utility functions (cn for className merging)

### Key Technologies
- **Next.js 15** with App Router and Server Components
- **Turbopack** - Used for both dev and build
- **Supabase** - Backend (configured with SSR via `@supabase/ssr`)
- **shadcn/ui** - UI component library (New York style, with CSS variables)
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons

### shadcn/ui Configuration
The project uses shadcn/ui with these settings (see `components.json`):
- Style: "new-york"
- RSC: Enabled
- Base color: neutral
- Path aliases: `@/components`, `@/utils`, `@/lib`, `@/hooks`

### Supabase Integration
Server-side Supabase client is created via `utils/supabase/server.ts`:
- Uses `createServerClient` from `@supabase/ssr`
- Requires environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Example usage in `app/instruments/page.tsx` shows fetching from "instruments" table in Server Component

### Path Aliases
- `@/components` → `components/`
- `@/utils` → `utils/`
- `@/lib` → `lib/`
- `@/ui` → `components/ui/`
- `@/hooks` → `hooks/`

## Important Notes

- Server Components are used by default (React Server Components enabled)
- Supabase queries should use the server client from `@/utils/supabase/server` in Server Components
- The `cn()` utility from `@/lib/utils` is used for merging Tailwind classes with variants