#!/bin/bash

echo "🧹 Cleaning generated files..."

# Remove generated diagrams directory and all its contents
if [ -d "generated_diagrams" ]; then
    echo "🖼️  Removing generated_diagrams/ directory..."
    rm -rf generated_diagrams/
    echo "✅ Generated diagrams removed"
else
    echo "ℹ️  No generated_diagrams/ directory found"
fi

# Remove output directory and all its contents
if [ -d "output" ]; then
    echo "📁 Removing output/ directory..."
    rm -rf output/
    echo "✅ Output files removed"
else
    echo "ℹ️  No output/ directory found"
fi

echo ""
echo "🎉 Clean complete! All generated files removed."
