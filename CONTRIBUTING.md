# Contributing to AI Twin

Thank you for considering contributing to AI Twin! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Testing](#testing)

## Code of Conduct

This project follows a standard code of conduct. Please be respectful and professional in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager
- Git

### Installation
```bash
# Clone your fork
git clone https://github.com/yourusername/ai-twin.git
cd ai-twin

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## Making Changes

### Branch Naming
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(voice): add new tone detection algorithm
fix(ui): resolve microphone permission issue
docs(readme): update installation instructions
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Submitting Changes

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Create a pull request** with:
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - List breaking changes if any

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added (if applicable)

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## Code Style

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use descriptive variable names
- Add JSDoc comments for complex functions

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript interfaces
- Follow naming conventions (PascalCase for components)

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Use semantic class names
- Maintain consistent spacing

### File Structure
```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── types/          # TypeScript type definitions
```

## Testing

### Manual Testing
- Test in multiple browsers (Chrome, Firefox, Safari)
- Test responsive design on different screen sizes
- Test with and without microphone permissions
- Test both voice and text input modes

### Automated Testing
```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build test
npm run build
```

## Areas for Contribution

### High Priority
- Voice recognition improvements
- Mobile responsiveness
- Performance optimization
- Error handling enhancements

### Medium Priority
- Additional language support
- Theme customization
- Export functionality
- Analytics dashboard

### Documentation
- API documentation
- Component documentation
- Tutorial videos
- Example use cases

## Questions and Support

- Open an issue for bug reports
- Use discussions for questions
- Join our Discord community (if available)
- Check existing issues before creating new ones

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to AI Twin!