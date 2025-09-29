# Project T - Admin Panel

This is the admin panel for Project T, a web application built with React, Vite, and TypeScript.

## Prerequisites

Make sure you have Node.js version 23.0.0 or higher installed on your machine.

```bash
node -v
```

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/7M-coder/project-t.git
    cd project-T-admin-panel
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run the following commands:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm test`: Runs the test suite using Vitest.
- `npm run test:coverage`: Generates a test coverage report.
- `npm run lint`: Lints the code using ESLint.
- `npm run lint:fix`: Lints the code and automatically fixes issues.
- `npm run format`: Formats the code using Prettier.
- `npm run docs`: Generates project documentation using TypeDoc.
- `npm run preview`: Serves the production build locally for preview.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: React Context/Hooks
- **API Client**: [Axios](https://axios-http.com/)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/)
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)

## Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting. There are pre-commit hooks set up with Husky and lint-staged to ensure that code is linted and formatted before being committed.

## Commit Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages are linted using `commitlint`.
