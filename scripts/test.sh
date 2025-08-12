#!/bin/bash

echo "🧪 Testing complete workflow..."

# Test that all required tools are available
echo "✅ Checking dependencies..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js"
    exit 1
fi

if ! command -v pandoc &> /dev/null; then
    echo "❌ pandoc not found. Please install pandoc"
    exit 1
fi

if ! command -v mmdc &> /dev/null && [ ! -f "node_modules/.bin/mmdc" ]; then
    echo "❌ mermaid-cli not found. Install locally with: npm install @mermaid-js/mermaid-cli"
    exit 1
fi

echo "✅ All dependencies found!"

# Test the build
echo "🔨 Testing build process..."
./scripts/build.sh

# Verify outputs
if [ -f "output/presentation-demo.pptx" ]; then
    echo "✅ Build test successful!"
    echo "📊 PowerPoint: output/presentation-demo.pptx"
    echo "🖼️  Generated $(ls generated_diagrams/ | wc -l) mermaid diagrams"
else
    echo "❌ Build test failed - PowerPoint output not generated"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Ready for GitHub commit."
