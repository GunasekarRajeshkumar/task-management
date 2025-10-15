# Task Management System

A comprehensive task management application built with Angular 13, NgRx, and TypeScript. This application provides a complete solution for managing projects and tasks with a modern, responsive interface.

## Features

### Core Functionality
- **Task Management**: Create, update, delete, and track tasks
- **Project Management**: Organize tasks into projects
- **Dashboard**: Overview of projects and task statistics
- **Filtering & Sorting**: Advanced filtering by status, priority, and due date
- **Real-time Updates**: Live status updates and progress tracking

### Task Features
- Title, description, due date, priority, and status
- Status tracking (Not Started, In Progress, Completed)
- Priority levels (Low, Medium, High, Urgent)
- Project association
- Overdue task highlighting

### Project Features
- Project creation and management
- Task association
- Progress tracking
- Project statistics

### Technical Features
- **State Management**: NgRx for predictable state management
- **Security**: XSS prevention and input validation
- **Performance**: Optimized rendering and lazy loading
- **Responsive Design**: Mobile-first responsive layout
- **Type Safety**: Full TypeScript implementation

## Technology Stack

- **Frontend**: Angular 13, TypeScript, SCSS
- **State Management**: NgRx (Store, Effects, DevTools)
- **Styling**: Custom SCSS with responsive design
- **Architecture**: Modular component-based architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Angular CLI 13

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/           # Reusable components
│   │   ├── dashboard/       # Dashboard component
│   │   ├── task-list/       # Task list component
│   │   ├── task-form/       # Task form component
│   │   ├── project-list/    # Project list component
│   │   └── project-form/    # Project form component
│   ├── models/              # TypeScript interfaces
│   │   ├── task.model.ts    # Task interfaces
│   │   └── project.model.ts  # Project interfaces
│   ├── services/            # Business logic services
│   │   ├── task.service.ts  # Task operations
│   │   └── project.service.ts # Project operations
│   ├── store/               # NgRx state management
│   │   ├── actions/         # Action definitions
│   │   ├── reducers/        # State reducers
│   │   ├── effects/         # Side effects
│   │   └── selectors/       # State selectors
│   ├── app.component.*      # Root component
│   ├── app.module.ts        # Root module
│   └── app-routing.module.ts # Routing configuration
└── styles.scss             # Global styles
```

## Architecture

### State Management (NgRx)
- **Actions**: Define all possible actions for tasks and projects
- **Reducers**: Handle state changes based on actions
- **Effects**: Manage side effects and async operations
- **Selectors**: Provide efficient state selection

### Component Architecture
- **Smart Components**: Connected to store (Dashboard, TaskList, ProjectList)
- **Dumb Components**: Pure presentation components (TaskForm, ProjectForm)
- **Reusable Components**: Modular and testable

### Security Features
- **Input Sanitization**: XSS prevention through input sanitization
- **Validation**: Client-side validation with error handling
- **Type Safety**: TypeScript for compile-time error checking

## Usage

### Dashboard
- View overall statistics
- See project summaries with progress
- Quick overview of task distribution

### Task Management
- Create new tasks with title, description, due date, priority
- Filter tasks by status, priority, or project
- Sort tasks by various criteria
- Update task status inline
- Delete tasks with confirmation

### Project Management
- Create and manage projects
- Associate tasks with projects
- View project statistics
- Track project progress

## Performance Optimizations

- **OnPush Change Detection**: Optimized change detection strategy
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Efficient selector usage
- **Virtual Scrolling**: For large task lists (future enhancement)

## Security Considerations

- **XSS Prevention**: Input sanitization and validation
- **CSRF Protection**: Built-in Angular security features
- **Input Validation**: Client and server-side validation
- **Type Safety**: TypeScript prevents many runtime errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Angular style guide compliance

### Testing
```bash
# Unit tests
ng test

# E2E tests
ng e2e
```

## Deployment

The application can be deployed to any static hosting service:

- **Netlify**: Connect to GitHub repository
- **Vercel**: Deploy with zero configuration
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repositories

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Note**: This application is built as a demonstration of modern Angular development practices with NgRx state management, responsive design, and security considerations.