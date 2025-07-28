# Figma to JSON Export Plugin

A Figma plugin that exports your designs to structured JSON format with comprehensive node data including styles, layouts, and properties.

## 🚀 Features

- **Complete Node Export**: Exports all Figma node types with their properties
- **Code Generation**: Built-in Figma codegen capabilities 
- **Structured JSON**: Clean, hierarchical JSON output with node relationships
- **Style Preservation**: Maintains fills, strokes, effects, typography, and layout properties
- **Developer-Friendly**: TypeScript-based with modern tooling

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh/) runtime
- Figma desktop app or Figma in browser
- TypeScript knowledge for development

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd figma-to-json
```

2. Install dependencies:
```bash
bun install
```

3. Build the plugin:
```bash
bun run build
```

### Installing in Figma

1. Open Figma
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the `manifest.json` file from this project
4. The plugin will appear in your Plugins menu

## 🎯 Usage

### Using the Plugin

1. Open a Figma file with your design
2. Select the node(s) you want to export
3. Go to **Plugins** → **figma-to-json**
4. Click **Export to JSON** button
5. The JSON will be copied to your clipboard automatically

### Code Generation

This plugin also supports Figma's native code generation feature:

1. Select any node in your design
2. Open the **Code** panel (right sidebar)
3. Choose the plugin from the code generation options
4. View the generated JSON output

## 🏗️ Development

### Build Scripts

```bash
# Build the plugin
bun run build

# Watch mode for development
bun run watch

# Lint code
bun run lint

# Fix linting issues
bun run lint:fix
```

### Project Structure

```
figma-export-to-json/
├── src/
│   ├── code.ts              # Main plugin logic
│   ├── altConversion.ts     # Advanced node conversion
│   ├── convertNodesOnRectangle.ts  # Rectangle conversion utilities
│   ├── helpers.ts           # Utility functions
│   ├── altMixins2.ts        # Mixin utilities
│   └── figma.d.ts           # Figma API type definitions
├── ui.html                  # Plugin UI
├── manifest.json           # Figma plugin manifest
├── package.json            # Project configuration
├── tsconfig.json           # TypeScript configuration
└── build/                  # Compiled output
```

### JSON Output Format

The exported JSON includes:

- **Basic Properties**: `id`, `name`, `type`, `width`, `height`
- **Layout**: `layoutMode`, `layoutAlign`, `constraints`, `positioning`
- **Styling**: `fills`, `strokes`, `effects`, `opacity`, `blendMode`
- **Typography**: `fontSize`, `fontName`, `textAlign`, `characters` (for text nodes)
- **Border Radius**: Individual corner radius values
- **Hierarchy**: Nested `children` array for parent nodes

Example output:
```json
{
  "id": "123:456",
  "name": "Button",
  "type": "FRAME",
  "width": 120,
  "height": 40,
  "fills": [...],
  "borderRadius": {
    "topLeft": 8,
    "topRight": 8,
    "bottomRight": 8,
    "bottomLeft": 8
  },
  "children": [...]
}
```

### Technology Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Build Tool**: esbuild
- **Linting**: ESLint with Figma plugin rules
- **Dependencies**: libx.js, Figma Plugin API

## 🛠️ Configuration

### ESLint Configuration

The project uses ESLint with:
- TypeScript support
- Figma plugin-specific rules
- Unused variable checking with underscore prefix ignoring

### Build Configuration

- **Target**: ES6
- **Bundler**: esbuild
- **Entry**: `src/code.ts`
- **Output**: `build/code.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests and linting: `bun run lint`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use the existing code style and ESLint configuration
- Test your changes with actual Figma designs
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs
4. Provide Figma file examples when relevant

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic node export functionality
- Code generation support
- TypeScript implementation with Bun runtime
