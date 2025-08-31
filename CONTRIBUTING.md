# Contributing to Ark Network Academy

Thank you for considering contributing to Ark Network Academy! We appreciate your time and effort in helping us build a better platform for spiritual growth and community building.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Reporting Issues](#-reporting-issues)
- [License](#-license)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [your-email@example.com].

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/ark-network-academy.git
   cd ark-network-academy
   ```
3. **Set up the development environment** (see [README.md](README.md) for detailed instructions)
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

1. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development servers**
   ```bash
   # Start backend server
   npm run dev:server
   
   # In a new terminal, start frontend
   cd client
   npm start
   ```

4. **Run tests**
   ```bash
   # Run all tests
   npm test
   
   # Run specific test file
   npm test path/to/test/file.test.js
   ```

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Here are some examples:

- `feat(auth): add login with Google OAuth`
- `fix(ui): resolve card spacing issues on mobile`
- `docs(readme): update installation instructions`
- `refactor(api): simplify user authentication middleware`
- `test(auth): add tests for password reset flow`
- `chore(deps): update react to v18.2.0`

## 🔄 Pull Request Process

1. Ensure your code follows the project's style guide
2. Add tests for any new functionality
3. Update documentation as needed
4. Ensure all tests pass
5. Submit a pull request with a clear description of your changes

## 🐛 Reporting Issues

When reporting issues, please include:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected vs. actual behavior
4. Screenshots (if applicable)
5. Browser/OS version (for frontend issues)
6. Any relevant console errors

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for your contribution! 🙏
