# Pandoc PowerPoint Demo

A complete workflow for creating professional PowerPoint presentations from Markdown with automatic mermaid diagram generation.

## Features

- ✅ **Markdown to PowerPoint**: Convert markdown files to professional PPTX presentations
- ✅ **Mermaid Diagrams**: Automatic conversion of mermaid code blocks to images
- ✅ **Custom Sizing**: Control diagram dimensions with width/height attributes
- ✅ **Corporate Templates**: Use PowerPoint templates for consistent branding
- ✅ **Column Layouts**: Multi-column presentation layouts
- ✅ **Text Optimization**: Best practices for readable slide content

## Quick Start

### Prerequisites

1. **Install dependencies:**
   ```bash
   # Install all Node.js dependencies (including mermaid-cli locally)
   npm install
   
   # Install pandoc (see https://pandoc.org/installing.html)
   ```

2. **Build the presentation:**
   ```bash
   ./build.sh
   # or use npm script
   npm run build
   ```

3. **Clean generated files:**
   ```bash
   ./clean.sh
   # or use npm script
   npm run clean
   ```

4. **View results:**
   - PowerPoint: `output/presentation-demo.pptx`
   - HTML: `output/presentation-demo.html`

1. **Write your presentation** in Markdown with mermaid code blocks:
   ```markdown
   # My Slide
   
   ```mermaid
   graph TD
       A[Start] --> B[End]
   ```
   ```

2. **Generate presentation** using the filter:
   ```bash
   pandoc presentation.md --filter ./mermaid-filter.js -o presentation.pptx
   ```

3. **Or use the build script**:
   ```bash
   ./build.sh
   # or use npm scripts
   npm run build   # Build presentation
   npm test        # Run tests
   npm run clean   # Clean generated files
   ```

## Usage Examples

### PowerPoint Presentation
```bash
pandoc sample-presentation.md --filter ./mermaid-filter.js -o presentation.pptx
```

### HTML Presentation (Reveal.js)
```bash
pandoc sample-presentation.md --filter ./mermaid-filter.js -t revealjs -o presentation.html --standalone
```

### PDF Presentation (Beamer)
```bash
pandoc sample-presentation.md --filter ./mermaid-filter.js -t beamer -o presentation.pdf
```

## Mermaid Diagram Types Supported

The filter supports all mermaid diagram types:

- **Flowcharts**: `graph TD`, `graph LR`
- **Sequence Diagrams**: `sequenceDiagram`
- **Gantt Charts**: `gantt`
- **Class Diagrams**: `classDiagram`
- **State Diagrams**: `stateDiagram`
- **User Journey**: `journey`
- **Git Graphs**: `gitgraph`
- **And more!**

## File Structure

```
pandoc_pptx_test/
├── mermaid-filter.js           # Pandoc filter for mermaid conversion
├── build.sh                    # Automated build script
├── clean.sh                    # Clean generated files script
├── presentation-demo.md        # Sample presentation with mermaid
├── test.sh                     # Test script
├── generated_diagrams/         # Auto-generated diagram images
└── node_modules/               # Node.js dependencies
```

## How the Filter Works

1. **Detects mermaid code blocks** in the markdown
2. **Generates unique hash** for each diagram (for caching)
3. **Converts to appropriate format**:
   - SVG for HTML output
   - PNG for PowerPoint
   - PDF for LaTeX
4. **Replaces code block** with image reference
5. **Caches results** to avoid regeneration

## Advanced Configuration

### Custom Image Dimensions
Edit `mermaid-filter.js` to change default dimensions:
```javascript
const imgPath = mermaidToImage(code, imgFormat, 1200, 800, theme);
```

### Output Directory
Change the output directory for generated images:
```javascript
const outputDir = path.join(process.cwd(), 'my_diagrams');
```

### Error Handling
The filter gracefully handles errors:
- If `mmdc` is not installed, it shows a helpful error message
- If diagram generation fails, it returns the original code block with a warning
- Temporary files are automatically cleaned up

## Troubleshooting

### Common Issues

1. **"mmdc not found"**
   ```bash
   npm install @mermaid-js/mermaid-cli
   ```

2. **"pandoc-filter not found"**
   ```bash
   npm install pandoc-filter
   ```

3. **Permission denied**
   ```bash
   chmod +x mermaid-filter.js
   chmod +x build.sh
   ```

4. **Node.js interpreter issues**
   - Check the shebang line in `mermaid-filter.js`
   - Make sure Node.js is properly installed

### Debug Mode
To see what the filter is doing, add debug prints to `mermaid-filter.js`.

## Comparison with Manual Method

| Method | Pros | Cons |
|--------|------|------|
| **Filter** | ✅ Automatic<br>✅ Integrated<br>✅ Cached<br>✅ Format-aware | ❌ Requires setup<br>❌ Node.js dependency |
| **Manual** | ✅ Simple<br>✅ No dependencies | ❌ Manual steps<br>❌ No caching<br>❌ Error-prone |

## License

This project is provided as-is for educational and practical use.
