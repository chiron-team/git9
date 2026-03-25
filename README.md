# G-project-2

A modern HTML/CSS project built with best practices, featuring a responsive design, modern CSS architecture, and development tooling.

## Features

- 🎨 Modern CSS architecture with CSS custom properties
- 📱 Fully responsive design (mobile-first approach)
- ⚡ Fast and lightweight
- 🔧 Development tooling with PostCSS, Stylelint, and Prettier
- 📝 Semantic HTML5 markup
- ♿ Accessibility-focused design
- 🎯 BEM-inspired CSS methodology
- 🚀 Production-ready build process

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern CSS with custom properties, Grid, and Flexbox
- **JavaScript (ES6+)** - Vanilla JavaScript for interactions
- **PostCSS** - CSS processing with autoprefixer and cssnano
- **Stylelint** - CSS linting
- **HTMLHint** - HTML validation
- **Prettier** - Code formatting

## Project Structure

```
├── src/
│   ├── css/
│   │   ├── main.css          # Main CSS entry point
│   │   ├── reset.css         # CSS reset
│   │   ├── variables.css     # CSS custom properties
│   │   ├── base.css          # Base styles
│   │   ├── components.css    # Component styles
│   │   ├── layout.css        # Layout styles
│   │   └── utilities.css     # Utility classes
│   └── js/
│       └── main.js           # Main JavaScript file
├── dist/                     # Build output (generated)
├── assets/                   # Static assets
├── index.html                # Main HTML file
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── .stylelintrc.js          # Stylelint configuration
├── .htmlhintrc              # HTMLHint configuration
├── .prettierrc              # Prettier configuration
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd g-project-2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the CSS:
   ```bash
   npm run build:css
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The project will open in your default browser at `http://localhost:3000`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with live reload |
| `npm run build` | Build for production |
| `npm run build:css` | Build CSS for production |
| `npm run watch:css` | Watch CSS files for changes |
| `npm run lint:css` | Lint CSS files |
| `npm run lint:html` | Lint HTML files |
| `npm run format` | Format all files with Prettier |
| `npm run clean` | Clean build directory |

## CSS Architecture

The project uses a modular CSS architecture:

- **reset.css** - Modern CSS reset for consistent styling across browsers
- **variables.css** - CSS custom properties for colors, typography, spacing, etc.
- **base.css** - Base styles for HTML elements
- **components.css** - Reusable component styles
- **layout.css** - Layout and section-specific styles
- **utilities.css** - Utility classes for common styling patterns

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Development Guidelines

### CSS

- Use CSS custom properties for consistent theming
- Follow mobile-first responsive design
- Use semantic class names (BEM-inspired)
- Maintain separation of concerns (layout, components, utilities)

### HTML

- Use semantic HTML5 elements
- Ensure proper heading hierarchy
- Include appropriate ARIA attributes
- Optimize for accessibility

### JavaScript

- Use modern ES6+ features
- Follow functional programming principles where appropriate
- Keep code modular and well-documented

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Modern CSS Reset by [Piccalilli](https://piccalil.li/blog/a-modern-css-reset/)
- Color palette inspired by Tailwind CSS
- Typography scale based on modular scale principles