# Danawa Car Sales Surge Radar

## Overview

A Korean car sales tracking dashboard that monitors and displays "surge" models - vehicles showing significant month-over-month sales increases. The application scrapes and analyzes data from Danawa Auto (Korean car comparison site) to identify trending vehicles in both domestic and import markets.

The system calculates a surge score based on:
- Month-over-month absolute change (momAbs)
- Month-over-month percentage change (momPct)  
- Rank change from previous month

Models are filtered by minimum sales threshold (default 300 units) to reduce noise from low-volume vehicles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful endpoints under `/api/*`
- **Data Storage**: In-memory storage with interface abstraction (IStorage) for easy database migration
- **Schema Validation**: Zod for runtime type validation on API requests

### Key API Endpoints
- `GET /api/radar` - Fetch surge model data for a specific month and nation
- `GET /api/radar/months` - Get list of available data months

### Data Model
The core `CarModel` schema includes:
- Sales metrics: current sales, previous sales, month-over-month changes
- Ranking data: current rank, rank change
- Computed surge score
- Metadata: brand, model name, nation (domestic/export), Danawa URL

### Directory Structure
```
client/           # React frontend
  src/
    components/   # UI components (model cards, filters, selectors)
    pages/        # Route pages (dashboard, 404)
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data storage abstraction
  vite.ts         # Vite dev server integration
shared/           # Shared types and schemas
  schema.ts       # Zod schemas for API contracts
```

## External Dependencies

### Database
- **Drizzle ORM** configured for PostgreSQL
- Currently using in-memory storage with sample data
- Database URL expected via `DATABASE_URL` environment variable
- Schema defined in `shared/schema.ts`
- Migrations output to `./migrations` directory

### UI Framework
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless UI primitives for complex interactions
- **Tailwind CSS**: Utility-first styling with custom theme configuration

### Data Source
- **Danawa Auto**: Korean car sales data source
- URL patterns for domestic and import vehicle data
- Data includes KAMA/KAIDA official sales figures