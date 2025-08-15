#!/usr/bin/env bun
/**
 * Pandoc filter to convert mermaid code blocks to images.
 * 
 * This filter processes mermaid code blocks and converts them to images
 * that can be embedded in the output document.
 * 
 * Usage:
 *     pandoc input.md --filter ./mermaid-filter.js -o output.pptx
 */

const pandocFilter = require('pandoc-filter');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const os = require('os');

/**
 * Convert mermaid code to an image file.
 * 
 * @param {string} code - Mermaid diagram code
 * @param {string} format - Output format (png, svg, pdf)
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} theme - Mermaid theme (default, dark, forest, neutral)
 * @returns {string|null} Path to the generated image file or null if failed
 */
function mermaidToImage(code, format = 'png', width = 800, height = 600, theme = 'default') {
    // Create a hash of the code AND format to use as filename (for caching)
    const codeHash = crypto.createHash('md5').update(`${code}${format}${theme}${width}${height}`).digest('hex');
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'generated_diagrams');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Define output file path
    const outputFile = path.join(outputDir, `mermaid_${codeHash}.${format}`);
    
    // If file already exists, return its path (caching)
    if (fs.existsSync(outputFile)) {
        return outputFile;
    }
    
    // Create temporary mermaid file
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `mermaid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mmd`);
    
    try {
        // Write mermaid code to temporary file
        fs.writeFileSync(tempFile, code, 'utf8');
        
        // Use local mmdc from node_modules
        const localMmdc = path.join(process.cwd(), 'node_modules', '.bin', 'mmdc');
        
        // Run mermaid-cli to generate the image
        const cmd = [
            'bun', 'run',
            localMmdc,
            '-i', tempFile,
            '-o', outputFile,
            '-w', width.toString(),
            '-H', height.toString(),
            '-t', theme,
            '--scale', '2',  // High DPI for better text rendering
            '--quiet'
        ];
        
        try {
            execSync(cmd.join(' '), { stdio: 'pipe' });
            return outputFile;
        } catch (error) {
            console.error(`Error generating mermaid diagram: ${error.message}`, error.stderr?.toString());
            return null;
        }
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Error: mermaid-cli (mmdc) not found. Please install it locally with:');
            console.error('npm install @mermaid-js/mermaid-cli');
        } else {
            console.error(`Error: ${error.message}`);
        }
        return null;
    } finally {
        // Clean up temporary file
        try {
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        } catch (cleanupError) {
            // Ignore cleanup errors
        }
    }
}

/**
 * Pandoc filter action function.
 * 
 * This function is called for each element in the document.
 * If it finds a mermaid code block, it converts it to an image.
 */
function action(elem, format, meta) {
    // Check if this is a CodeBlock element with mermaid class
    if (elem.t === 'CodeBlock') {
        const [[identifier, classes, keyvals], code] = elem.c;
        
        // Check if this is a mermaid code block
        if (classes.includes('mermaid')) {
            // Use PNG for PowerPoint compatibility, SVG for HTML/web
            let imgFormat;
            if (['pptx', 'docx'].includes(format)) {
                imgFormat = 'png';  // PowerPoint works better with PNG
            } else {
                imgFormat = 'svg';  // SVG for web formats
            }
            
            // Get theme from document metadata or code block attributes
            let theme = 'default';
            if (meta && meta['mermaid-theme']) {
                const themeMeta = meta['mermaid-theme'];
                if (themeMeta.t === 'MetaInlines' && themeMeta.c) {
                    // Extract text from MetaInlines
                    theme = themeMeta.c.map(item => item.c || '').join('');
                } else if (themeMeta.t === 'MetaString') {
                    theme = themeMeta.c;
                } else {
                    theme = String(themeMeta);
                }
            }
            
            // Check for theme in code block attributes
            const attributes = {};
            keyvals.forEach(([key, val]) => {
                attributes[key] = val;
            });
            
            if (attributes.theme) {
                theme = attributes.theme;
            }
            
            // Get custom dimensions if specified
            let width = 800;
            let height = 600;
            if (attributes.width) {
                width = parseInt(attributes.width, 10) || width;
            }
            if (attributes.height) {
                height = parseInt(attributes.height, 10) || height;
            }
            
            // Convert mermaid to image
            const imgPath = mermaidToImage(code, imgFormat, width, height, theme);
            
            if (imgPath) {
                // Convert absolute path to relative path for better compatibility
                const relativePath = path.relative(process.cwd(), imgPath);
                
                // Create image attributes
                const imageAttributes = [['width', '90%']];
                
                // Copy any custom attributes from the code block (excluding special ones)
                keyvals.forEach(([key, val]) => {
                    if (!['theme', 'width', 'height'].includes(key)) {
                        imageAttributes.push([key, val]);
                    }
                });
                
                // Create image element
                const image = pandocFilter.Image(
                    ['', [], imageAttributes],  // Attr
                    [pandocFilter.Str('Mermaid Diagram')],  // Alt text
                    [relativePath, '']  // [url, title] - use relative path
                );
                
                // Return the image wrapped in a paragraph
                return pandocFilter.Para([image]);
            } else {
                // If conversion failed, return the original code block with a warning
                const warning = pandocFilter.Para([
                    pandocFilter.Emph([pandocFilter.Str('Warning: Could not convert mermaid diagram')])
                ]);
                return [warning, pandocFilter.CodeBlock([identifier, classes, keyvals], code)];
            }
        }
    }
    
    // For non-mermaid elements, return undefined (no change)
    return undefined;
}

// Main execution
if (require.main === module) {
    pandocFilter.toJSONFilter(action);
}

module.exports = { action, mermaidToImage };
