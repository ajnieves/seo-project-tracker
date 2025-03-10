# SEO Projects Tracker

A comprehensive web application for managing SEO projects and tasks. This application allows you to create and manage SEO projects, track tasks with priorities and dependencies, and monitor progress through a dashboard.

## Features

- **Project Management**: Create, view, and manage SEO projects
- **Task Management**: Add tasks to projects with priorities, statuses, and dependencies
- **Dashboard**: View project statistics and upcoming tasks
- **Search & Filter**: Find projects and tasks quickly
- **Data Persistence**: All data is stored in the browser's localStorage

## Technologies Used

- **Next.js**: React framework for building the application
- **TypeScript**: For type safety and better developer experience
- **Material UI**: Component library for the user interface
- **LocalStorage API**: For data persistence

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/seo-project-tracker.git
   cd seo-project-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Creating a Project

1. Navigate to the Projects page
2. Click "New Project"
3. Fill in the project details (name, description)
4. Click "Create"

### Adding Tasks to a Project

1. Open a project by clicking on it from the Projects page
2. Click "Add Task"
3. Fill in the task details:
   - Title
   - Description
   - Priority (Low, Medium, High)
   - Status (In Queue, In Progress, Blocked, Completed)
   - Start and Due dates
   - Dependencies (other tasks that must be completed first)
4. Click "Add"

### Completing Tasks

1. Open a project
2. Check the checkbox next to a task to mark it as completed
3. The task will be visually marked as completed and the project progress will be updated

### Viewing Dashboard

The Dashboard provides an overview of your SEO projects and tasks:
- Task statistics (total, completed, in progress, high priority)
- Overall completion percentage
- Upcoming tasks due in the next 7 days

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to various platforms.

## Project Structure

```
seo-project-tracker/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   ├── services/        # Service layer for data handling
│   └── styles/          # Global styles
├── .github/             # GitHub Actions workflows
├── next.config.js       # Next.js configuration
└── package.json         # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material UI for the component library
- Next.js team for the amazing framework
