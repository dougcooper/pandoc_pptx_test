#!/bin/bash

echo "🧪 Testing complete workflow..."

# Test that all required tools are available
echo "✅ Checking dependencies..."

if ! command -v uv &> /dev/null; then
    echo "❌ uv not found. Please install uv: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

if ! command -v pandoc &> /dev/null; then
    echo "❌ pandoc not found. Please install pandoc"
    exit 1
fi

if ! command -v mmdc &> /dev/null; then
    echo "❌ mermaid-cli not found. Install with: npm install -g @mermaid-js/mermaid-cli"
    exit 1
fi

echo "✅ All dependencies found!"

# Test the build
echo "🔨 Testing build process..."
./build.sh

# Verify outputs
if [ -f "output/presentation-demo.pptx" ] && [ -f "output/presentation-demo.html" ]; then
    echo "✅ Build test successful!"
    echo "📊 PowerPoint: output/presentation-demo.pptx"
    echo "🌐 HTML: output/presentation-demo.html"
    echo "🖼️  Generated $(ls generated_diagrams/ | wc -l) mermaid diagrams"
else
    echo "❌ Build test failed - outputs not generated"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Ready for GitHub commit."
