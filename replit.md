# Study Visa Management System (Osmosis Portal)

## Overview

Osmosis Portal is a comprehensive study visa management system built with React, Express.js, and PostgreSQL. The application serves multiple user types (students, agents, universities, and admins) with role-based dashboards and functionality. It provides end-to-end management of university applications, document handling, task tracking, and commission management for education consultants.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with role-based access control
- **File Handling**: Document upload and management system

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless PostgreSQL
- **Schema Management**: Drizzle migrations and schema definitions
- **Session Storage**: PostgreSQL-backed session store

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with passport.js
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Multi-role user system with profile associations
- **Security**: Secure cookie-based sessions with HTTPS enforcement

### Role-Based Dashboard System
- **Student Dashboard**: Application tracking, university search, document management
- **Agent Dashboard**: Lead management, commission tracking, performance analytics
- **University Dashboard**: Application review, program management, student communications
- **Admin Dashboard**: System overview, user management, reporting tools

### Document Management
- **Upload System**: Drag-and-drop file upload with type validation
- **Document Types**: Passport, transcripts, language tests, statements, financial documents
- **Status Tracking**: Document approval workflow with status indicators
- **File Storage**: Integrated file handling with metadata storage

### Application Workflow
- **Multi-Step Process**: Draft → Submitted → Under Review → Decision
- **Status Tracking**: Real-time application status updates
- **Communication**: Built-in messaging between stakeholders
- **Task Management**: Automated task creation and tracking

## Data Flow

### User Authentication Flow
1. User initiates login via Replit Auth
2. OpenID Connect authentication with JWT tokens
3. Session creation in PostgreSQL store
4. Role-based profile association
5. Dashboard routing based on user role

### Application Submission Flow
1. Student creates application draft
2. Document upload and validation
3. Application submission to university
4. Agent/University review process
5. Status updates and notifications
6. Final decision and enrollment

### Document Processing Flow
1. Document upload with type classification
2. File validation and storage
3. Review queue assignment
4. Approval/rejection workflow
5. Status notifications to stakeholders

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection management
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect implementation

### UI Dependencies
- **@radix-ui/react-***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **react-hook-form**: Form handling
- **zod**: Schema validation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Environment Configuration
- **Development**: Vite dev server with hot module replacement
- **Production**: Static build with Express.js API server
- **Database**: Neon PostgreSQL with connection pooling
- **Sessions**: PostgreSQL-backed session storage

### Build Process
1. Frontend build: `vite build` → static assets
2. Backend build: `esbuild` → bundled server
3. Database migrations: `drizzle-kit push`
4. Environment variables: Database URL, session secrets

### Replit Deployment
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Port Configuration**: 5000 (internal) → 80 (external)
- **Auto-scaling**: Configured for dynamic scaling
- **Monitoring**: Built-in request logging and error handling

## Changelog

```
Changelog:
- June 19, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```