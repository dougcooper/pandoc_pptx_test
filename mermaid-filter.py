#!/usr/bin/env uv run python
"""
Pandoc filter to convert mermaid code blocks to images.

This filter processes mermaid code blocks and converts them to images
that can be embedded in the output document.

Usage:
    pandoc input.md --filter ./mermaid-filter.py -o output.pptx
"""

import os
import sys
import subprocess
import tempfile
import hashlib
from pathlib import Path
import panflute as pf


def mermaid_to_image(code, format="png", width=800, height=600, theme="default"):
    """
    Convert mermaid code to an image file.
    
    Args:
        code (str): Mermaid diagram code
        format (str): Output format (png, svg, pdf)
        width (int): Image width
        height (int): Image height
        theme (str): Mermaid theme (default, dark, forest, neutral)
    
    Returns:
        str: Path to the generated image file
    """
    # Create a hash of the code to use as filename (for caching)
    code_hash = hashlib.md5(f"{code}{theme}{width}{height}".encode()).hexdigest()
    
    # Create output directory if it doesn't exist
    output_dir = Path("generated_diagrams")
    output_dir.mkdir(exist_ok=True)
    
    # Define output file path
    output_file = output_dir / f"mermaid_{code_hash}.{format}"
    
    # If file already exists, return its path (caching)
    if output_file.exists():
        return str(output_file)
    
    # Create temporary mermaid file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.mmd', delete=False) as temp_file:
        temp_file.write(code)
        temp_mmd = temp_file.name
    
    try:
        # Run mermaid-cli to generate the image
        cmd = [
            'mmdc',
            '-i', temp_mmd,
            '-o', str(output_file),
            '-w', str(width),
            '-H', str(height),
            '-t', theme,
            '--scale', '2',  # High DPI for better text rendering
            '--quiet'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            # If mmdc fails, log the error and return None
            print(f"Error generating mermaid diagram: {result.stderr}", file=sys.stderr)
            return None
            
        return str(output_file)
        
    except FileNotFoundError:
        print("Error: mermaid-cli (mmdc) not found. Please install it with:", file=sys.stderr)
        print("npm install -g @mermaid-js/mermaid-cli", file=sys.stderr)
        return None
        
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_mmd)
        except OSError:
            pass


def action(elem, doc):
    """
    Pandoc filter action function.
    
    This function is called for each element in the document.
    If it finds a mermaid code block, it converts it to an image.
    """
    if isinstance(elem, pf.CodeBlock) and 'mermaid' in elem.classes:
        # Extract mermaid code
        code = elem.text
        
        # Get output format from document metadata or default to png
        output_format = getattr(doc, 'format', 'html')
        
        # Choose image format based on output format
        if output_format in ['latex', 'pdf']:
            img_format = 'pdf'
        elif output_format in ['html', 'html5', 'revealjs']:
            img_format = 'svg'
        else:
            img_format = 'png'
        
        # Get theme from document metadata or code block attributes
        theme = "default"
        if hasattr(doc, 'metadata') and 'mermaid-theme' in doc.metadata:
            theme_meta = doc.metadata['mermaid-theme']
            if hasattr(theme_meta, 'content'):  # Handle MetaInlines objects
                # Extract text from MetaInlines
                theme_parts = []
                for item in theme_meta.content:
                    if hasattr(item, 'text'):
                        theme_parts.append(item.text)
                theme = ''.join(theme_parts) if theme_parts else "default"
            elif hasattr(theme_meta, 'text'):  # Handle MetaString objects
                theme = theme_meta.text
            else:
                theme = str(theme_meta)
        
        # Check for theme in code block attributes
        if hasattr(elem, 'attributes') and 'theme' in elem.attributes:
            theme = elem.attributes['theme']
        
        # Get custom dimensions if specified
        width = 800
        height = 600
        if hasattr(elem, 'attributes'):
            if 'width' in elem.attributes:
                width = int(elem.attributes['width'])
            if 'height' in elem.attributes:
                height = int(elem.attributes['height'])
        
        # Convert mermaid to image
        img_path = mermaid_to_image(code, img_format, width, height, theme)
        
        if img_path:
            # Create image element with custom attributes
            attributes = {"width": "90%"}
            if hasattr(elem, 'attributes'):
                # Copy any custom attributes from the code block
                for key, value in elem.attributes.items():
                    if key not in ['theme', 'width', 'height']:
                        attributes[key] = value
            
            image = pf.Image(
                pf.Str("Mermaid Diagram"),  # Alt text
                url=img_path,
                title="",
                attributes=attributes
            )
            
            # Return the image wrapped in a paragraph
            return pf.Para(image)
        else:
            # If conversion failed, return the original code block with a warning
            warning = pf.Para(pf.Emph(pf.Str("Warning: Could not convert mermaid diagram")))
            return [warning, elem]
    
    # For non-mermaid elements, return None (no change)
    return None


def main(doc=None):
    """
    Main function for the pandoc filter.
    """
    return pf.run_filter(action, doc=doc)


if __name__ == "__main__":
    main()
