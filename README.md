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
   # Install Python dependencies
   uv sync
   
   # Install mermaid-cli globally
   npm install -g @mermaid-js/mermaid-cli
   
   # Install pandoc (see https://pandoc.org/installing.html)
   ```

2. **Build the presentation:**
   ```bash
   ./build.sh
   ```

3. **View results:**
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
   pandoc presentation.md --filter ./mermaid-filter.py -o presentation.pptx
   ```

3. **Or use the build script**:
   ```bash
   ./build-with-filter.sh
   ```

## Usage Examples

### PowerPoint Presentation
```bash
pandoc sample-presentation.md --filter ./mermaid-filter.py -o presentation.pptx
```

### HTML Presentation (Reveal.js)
```bash
pandoc sample-presentation.md --filter ./mermaid-filter.py -t revealjs -o presentation.html --standalone
```

### PDF Presentation (Beamer)
```bash
pandoc sample-presentation.md --filter ./mermaid-filter.py -t beamer -o presentation.pdf
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
├── mermaid-filter.py           # Pandoc filter for mermaid conversion
├── build-with-filter.sh        # Automated build script
├── sample-presentation.md      # Sample presentation with mermaid
├── test-mermaid.md            # Test file with various diagrams
├── generated_diagrams/         # Auto-generated diagram images
└── .venv/                     # Python virtual environment
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
Edit `mermaid-filter.py` to change default dimensions:
```python
img_path = mermaid_to_image(code, img_format, width=1200, height=800)
```

### Output Directory
Change the output directory for generated images:
```python
output_dir = Path("my_diagrams")
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
   npm install -g @mermaid-js/mermaid-cli
   ```

2. **"panflute not found"**
   ```bash
   pip install panflute
   ```

3. **Permission denied**
   ```bash
   chmod +x mermaid-filter.py
   chmod +x build-with-filter.sh
   ```

4. **Python interpreter issues**
   - Check the shebang line in `mermaid-filter.py`
   - Make sure it points to the correct Python interpreter

### Debug Mode
To see what the filter is doing, add debug prints to `mermaid-filter.py`.

## Comparison with Manual Method

| Method | Pros | Cons |
|--------|------|------|
| **Filter** | ✅ Automatic<br>✅ Integrated<br>✅ Cached<br>✅ Format-aware | ❌ Requires setup<br>❌ Python dependency |
| **Manual** | ✅ Simple<br>✅ No dependencies | ❌ Manual steps<br>❌ No caching<br>❌ Error-prone |

## License

This project is provided as-is for educational and practical use.
