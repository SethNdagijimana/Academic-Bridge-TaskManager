# Task Management Application

A modern, full-featured task management application built with React, TypeScript, and TanStack Query. This application provides a comprehensive solution for managing tasks with Kanban boards, table views, calendar integration, and team management.

## Live Demo

[View Live Application](https://academic-bridge-task-manager.vercel.app/)

## Features

### Core Features

- **Kanban Board**: Drag-and-drop task management with three columns (To Do, In Progress, Done)
- **Table View**: Sortable and filterable table with TanStack Table
- **Calendar View**: Visual task scheduling and deadline tracking
- **Team Management**: View team members and their workload
- **Task Details**: Comprehensive task details with comments, attachments, and progress tracking

### Advanced Features

- **Real-time Search**: Global search across all tasks
- **Advanced Filtering**: Filter by priority, status, and custom criteria
- **Drag & Drop**: Intuitive task movement between columns
- **Progress Tracking**: Visual progress indicators for each task
- **Date Management**: Start and due date selection with calendar picker
- **Multi-language Support**: English and French translations (i18n)
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive across all devices

## Tech Stack

### Required Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query (React Query)** - Server state management
- **TanStack Table** - Headless table library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Additional Libraries

- **Redux Toolkit** - Global state management
- **dnd-kit** - Drag and drop functionality
- **Framer Motion** - Animations
- **shadcn/ui** - UI components
- **react-hook-form** - Form management
- **date-fns** - Date utilities
- **react-i18next** - Internationalization
- **Lucide React** - Icons

### Testing

- **Jest** - Unit testing framework
- **React Testing Library** - Component testing

## Installation

### Prerequisites

- Node.js 24+
- yarn

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/SethNdagijimana/Academic-Bridge-TaskManager.git
cd academic-bridge-taskManager
```

2. **Install dependencies**

```bash
yarn install
```

3. **Start the development server**

```bash
yarn  dev
```

The application will be available at `http://localhost:5173`

4. **Start the JSON Server (Mock API)**

```bash
 yarn api
```

The API will be available at `http://localhost:4000`

## Testing

### Run Unit Tests

```bash
yarn test
```

### Run Tests in Watch Mode

```bash
 yarn test:watch
```

### Generate Coverage Report

```bash
yarn test:coverage
```

### Test Files Location

- Unit tests: `src/features/tasks/*.test.ts`
- Component tests: `src/components/*.test.tsx`

## Project Structure

```
hr-tasks-hub/
├── public/
├── src/
│   ├── app/                    # Redux store configuration
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── components/             # Reusable components
│   │   ├── layout/
│   │   │   └── AppLayout.tsx
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── KanbanColumn.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskModal.tsx
│   │   ├── TaskDetailsModal.tsx
│   │   └── Sidebar.tsx
│   ├── features/               # Feature-based modules
│   │   ├── tasks/
│   │   │   ├── api.ts         # API calls
│   │   │   ├── hooks.ts       # React Query hooks
│   │   │   ├── tasksSlice.ts  # Redux slice
│   │   │   ├── types.ts       # TypeScript types
│   │   │   └── tasksSlice.test.ts      # Unit tests
│   │   └── ui/
│   │       └── uiSlice.ts
│   ├── lib/                    # Utilities
│   │   └── utils.ts
│   ├── pages/                  # Page components
│   │   ├── KanbanPage.tsx
│   │   ├── TablePage.tsx
│   │   ├── CalendarPage.tsx
│   │   └── TeamPage.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── lib/
│   │   └── i18n.ts  # i18n configuration
│   │   └── theme-context.ts # Theme configurations
│   └── index.css               # Global styles
├── db.json                     # JSON Server database
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:4000
```

### JSON Server Configuration

The mock API uses `db.json` for data persistence. The server runs on port 4000 by default.

## Available Scripts

```bash
# Development
yarn dev          # Start development server
yarn api       # Start JSON Server (mock API)



# Build
yarn build        # Build for production


# Testing
yarn test             # Run tests
yarn test:watch   # Run tests in watch mode
yarn test:coverage # Generate coverage report


##  Deployment


### Important Notes for Deployment

- Update `VITE_API_URL` to point to your production API
- Ensure CORS is properly configured on your backend
- Set up proper environment variables on your hosting platform


### Internationalization

- English (default)
- French


Toggle language from the header dropdown.

##  Responsive Design

The application is fully responsive:

- **Mobile**: Single column layout, collapsible sidebar
- **Tablet**: Adapted grid layouts
- **Desktop**: Full multi-column experience

##  Testing Strategy

### Unit Tests

- Redux slice logic
- Utility functions
- Data transformations

### Component Tests

- User interactions
- Form submissions
- Conditional rendering
- Props handling


##  Known Issues & Limitations

- JSON Server is for development only; replace with real API for production
- File uploads are UI-only (no actual upload functionality)
- Comments and attachments are display-only (no CRUD operations)
- No authentication/authorization system



## 👥 Author

**Ndagijimana Seth**

- GitHub: [@SethNdagijimana](https://github.com/SethNdagijimana)
- Email: your.email@example.com

##  Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [TanStack](https://tanstack.com/) for Query and Table libraries
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [React](https://react.dev/) team for the amazing framework

##  Support

For support, email sethreas@gmail.com or open an issue in the GitHub repository.

---


```
