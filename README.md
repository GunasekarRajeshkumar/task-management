# 🚀 Procreater Task Management App

A modern, comprehensive task management application built with Angular 13, featuring beautiful Procreater branding, custom scrollbars, and advanced project management capabilities.

## 🌟 Live Demo

🔗 **GitHub Repository**: [https://github.com/GunasekarRajeshkumar/task-management](https://github.com/GunasekarRajeshkumar/task-management)

🌐 **Deploy on Netlify**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/GunasekarRajeshkumar/task-management)

## ✨ Features

### 🎨 UI/UX Features
- **Procreater Branding**: Beautiful gradient text design on login/register pages
- **Custom Scrollbars**: Modern, animated scrollbar design throughout the app
- **Dark Theme**: Sleek dark theme with gradient backgrounds
- **Responsive Design**: Mobile-first responsive layout
- **Animations**: Smooth transitions and hover effects

### 📋 Core Functionality
- **Task Management**: Create, update, delete, and track tasks
- **Project Management**: Organize tasks into projects
- **Dashboard**: Overview of projects and task statistics
- **Kanban Board**: Visual task management with drag-and-drop
- **Filtering & Sorting**: Advanced filtering by status, priority, and due date
- **Real-time Updates**: Live status updates and progress tracking

### 🔐 Authentication
- **User Registration**: Secure account creation
- **User Login**: Authentication with demo credentials
- **Auth Guards**: Protected routes and components
- **Demo Account**: Ready-to-use demo credentials

### 📊 Task Features
- Title, description, due date, priority, and status
- Status tracking (Not Started, In Progress, Completed)
- Priority levels (Low, Medium, High, Urgent)
- Project association
- Overdue task highlighting
- Virtual scrolling for large lists

## 🛠 Technology Stack

- **Frontend**: Angular 13, TypeScript, SCSS
- **State Management**: NgRx (Store, Effects, DevTools)
- **Styling**: Custom SCSS with responsive design
- **Architecture**: Modular component-based architecture
- **Icons**: FontAwesome
- **Build Tools**: Angular CLI, Webpack

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Angular CLI 13

### Installation Steps

1. **Clone the repository**:
```bash
git clone https://github.com/GunasekarRajeshkumar/task-management.git
cd task-management-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
ng serve
```

4. **Open your browser** and navigate to `http://localhost:4200`

### Demo Credentials
- **Email**: `demo@taskflow.com`
- **Password**: `demo123`

## 🏗 Build & Deployment

### Build for Production
```bash
ng build --prod
```
The build artifacts will be stored in the `dist/task-management-app/` directory.

### Deploy to Netlify

#### Method 1: Connect GitHub Repository
1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select `GunasekarRajeshkumar/task-management`
5. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/task-management-app`
6. Click "Deploy site"

#### Method 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist/task-management-app
```

#### Method 3: Drag & Drop
1. Build the project: `npm run build`
2. Go to [Netlify](https://app.netlify.com)
3. Drag and drop the `dist/task-management-app` folder

### Deploy to Other Platforms

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### GitHub Pages
```bash
# Install angular-cli-ghpages
npm install -g angular-cli-ghpages

# Deploy
ng build --prod --base-href "https://GunasekarRajeshkumar.github.io/task-management/"
ngh --dir=dist/task-management-app
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/              # UI Components
│   │   ├── dashboard/          # Dashboard with statistics
│   │   ├── login/              # Login page with Procreater branding
│   │   ├── register/           # Registration page with Procreater branding
│   │   ├── task-list/          # Task list with virtual scrolling
│   │   ├── task-form/          # Task creation/editing form
│   │   ├── kanban-board/       # Drag-and-drop Kanban board
│   │   ├── project-list/       # Project management
│   │   └── navigation/         # App navigation
│   ├── modules/                # Lazy-loaded feature modules
│   │   ├── task-management/    # Task management module
│   │   └── project-management/ # Project management module
│   ├── services/               # Business logic services
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── task.service.ts     # Task operations
│   │   └── project.service.ts  # Project operations
│   ├── store/                  # NgRx state management
│   │   ├── actions/            # Action definitions
│   │   ├── reducers/           # State reducers
│   │   ├── effects/            # Side effects
│   │   └── selectors/          # State selectors
│   ├── guards/                 # Route guards
│   └── models/                 # TypeScript interfaces
├── environments/               # Environment configurations
└── styles.scss                # Global styles
```

## 🎯 Key Features Explained

### Procreater Branding
- Beautiful gradient text design on authentication pages
- Animated feature highlights
- Professional branding elements
- Responsive design across all devices

### Custom Scrollbars
- Modern, gradient-styled scrollbars
- Smooth animations and hover effects
- Cross-browser compatibility (Webkit & Firefox)
- Consistent design throughout the application

### State Management (NgRx)
- **Actions**: Define all possible actions for tasks and projects
- **Reducers**: Handle state changes based on actions
- **Effects**: Manage side effects and async operations
- **Selectors**: Provide efficient state selection

### Security Features
- **Input Sanitization**: XSS prevention through input sanitization
- **Validation**: Client-side validation with error handling
- **Type Safety**: TypeScript for compile-time error checking
- **Auth Guards**: Protected routes and components

## 🧪 Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Test coverage
ng test --code-coverage
```

## 🔧 Development

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Angular style guide compliance

### Available Scripts
```bash
# Development
npm start                    # Start dev server
npm run build               # Production build
npm run test                # Run unit tests
npm run e2e                 # Run e2e tests
npm run lint                # Run linting
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Features

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized performance on mobile devices
- Progressive Web App ready

## 🚀 Performance Optimizations

- **OnPush Change Detection**: Optimized change detection strategy
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Efficient selector usage
- **Virtual Scrolling**: For large task lists
- **Tree Shaking**: Unused code elimination
- **Bundle Optimization**: Optimized build sizes

## 🔒 Security Considerations

- **XSS Prevention**: Input sanitization and validation
- **CSRF Protection**: Built-in Angular security features
- **Input Validation**: Client and server-side validation
- **Type Safety**: TypeScript prevents many runtime errors
- **Secure Headers**: Security headers configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Angular style guide
- Write unit tests for new features
- Update documentation as needed
- Ensure responsive design
- Test across different browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Open an issue in the repository
- Check existing issues for solutions
- Review the documentation

## 🙏 Acknowledgments

- Angular team for the amazing framework
- NgRx team for state management
- FontAwesome for beautiful icons
- Netlify for easy deployment

---

**Made with ❤️ by [Gunasekar Rajeshkumar](https://github.com/GunasekarRajeshkumar)**

⭐ **Star this repository if you find it helpful!**