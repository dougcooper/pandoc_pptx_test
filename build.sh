#!/bin/bash

echo "🎨 Building Pandoc PowerPoint Demo..."

# Create output directory
mkdir -p output

# Check if mermaid-cli is installed
if ! command -v mmdc &> /dev/null; then
    echo "❌ mermaid-cli not found. Installing..."
    echo "Run: npm install -g @mermaid-js/mermaid-cli"
    exit 1
fi

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc not found. Please install pandoc"
    exit 1
fi

# Build PowerPoint presentation
echo "📊 Generating PowerPoint presentation..."
pandoc presentation-demo.md \
    --filter ./mermaid-filter.py \
    --reference-doc template.pptx \
    -o output/presentation-demo.pptx

# Build HTML presentation for comparison
echo "🌐 Generating HTML presentation..."
pandoc presentation-demo.md \
    --filter ./mermaid-filter.py \
    -t revealjs \
    --standalone \
    --variable revealjs-url=https://unpkg.com/reveal.js@4.3.1/ \
    -o output/presentation-demo.html

echo "✅ Build complete!"
echo ""
echo "📁 Generated files:"
echo "   📊 output/presentation-demo.pptx (PowerPoint)"
echo "   🌐 output/presentation-demo.html (HTML/Reveal.js)"
echo ""
echo "💡 Customize template.pptx for your corporate branding!"

# Show generated diagrams count
if [ -d "generated_diagrams" ]; then
    diagram_count=$(ls generated_diagrams/ | wc -l)
    echo "🖼️  Generated $diagram_count mermaid diagrams"
fi
