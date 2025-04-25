# Workspace Manager

A comprehensive workspace management tool built with Payload CMS and PostgreSQL backend. This application helps you track your projects, tasks, and work sessions across different workspaces.

## Features

- **User Management**: Create and manage user accounts with different roles (Admin, User)
- **Workspaces**: Organize your work into separate workspaces with team members
- **Projects**: Create and manage projects within workspaces
- **Tasks**: Break down projects into actionable tasks with dependencies
- **Session Tracking**: Never lose track of your work between sessions with automatic state saving
- **Activity Monitoring**: Track user activity and work sessions

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd workspace-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   ```
   # Check .env file for database connection and other settings
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

### Default Credentials

After running the seed script, you can log in with the following credentials:

- Admin User:
  - Email: admin@example.com
  - Password: password123

- Regular User:
  - Email: user@example.com
  - Password: password123

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run seed` - Seed the database with sample data
- `npm run generate:types` - Generate TypeScript types from Payload collections
- `npm run generate:graphql` - Generate GraphQL schema from Payload collections

## Session Tracking

The application includes a powerful session tracking system that allows users to:

1. Automatically track active work sessions
2. Save and restore work context between sessions
3. Resume paused work sessions
4. Track time spent on tasks and projects

When a user becomes inactive for 15 minutes, their session is automatically marked as paused. They can resume the session later with all their work context intact.

## Database Structure

The application uses PostgreSQL with the following collections:

- Users
- Workspaces
- Projects
- Tasks
- Media
- Sessions (for work tracking)

## API Endpoints

Besides the standard Payload CMS API endpoints, the application provides custom endpoints for session management:

- `/api/resume-session/:id` - Resume a paused work session
- `/api/session-tracking/save-state` - Save the current work state
