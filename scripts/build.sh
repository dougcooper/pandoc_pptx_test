#!/bin/bash

echo "🎨 Building Pandoc PowerPoint Demo..."

# Create output directory
mkdir -p output

# Check if mermaid-cli is installed locally
if [ ! -f "node_modules/.bin/mmdc" ]; then
    echo "❌ mermaid-cli not found locally. Installing..."
    echo "Run: bun install @mermaid-js/mermaid-cli"
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
    --filter ./mermaid-filter.js \
    --reference-doc template.pptx \
    -t pptx \
    -o output/presentation-demo.pptx

echo "✅ Build complete!"
echo ""
echo "📁 Generated files:"
echo "   📊 output/presentation-demo.pptx (PowerPoint)"
echo ""
echo "💡 Customize template.pptx for your corporate branding!"

# Show generated diagrams count
if [ -d "generated_diagrams" ]; then
    diagram_count=$(ls generated_diagrams/ | wc -l)
    echo "🖼️  Generated $diagram_count mermaid diagrams"
fi
