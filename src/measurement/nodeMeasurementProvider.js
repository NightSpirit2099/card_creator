import { IMeasurementProvider } from './iMeasurementProvider.js';

/**
 * Node.js-based measurement provider using mathematical approximations
 * This is a lightweight alternative that doesn't require native dependencies
 *
 * For production use with accurate measurements, consider using node-canvas:
 * - Uncomment the canvas import
 * - Install: npm install canvas
 * - Use canvas-based measurements for accuracy
 */
export class NodeMeasurementProvider extends IMeasurementProvider {
  constructor() {
    super();
    // Average character width as percentage of font size
    // Typical for proportional fonts like Arial, Helvetica
    this.avgCharWidth = 0.5;
  }

  /**
   * Measures the height of text with given styling using mathematical approximation
   */
  async measureTextHeight(text, style) {
    const fontSize = style.fontSize || 16;
    const lineHeight = style.lineHeight || 1.2;
    const width = style.width || 336;

    // Approximate line wrapping
    const lines = this._approximateWrapText(text, width, fontSize);

    // Calculate total height
    const lineHeightPx = fontSize * lineHeight;
    const totalHeight = lines.length * lineHeightPx;

    return totalHeight;
  }

  /**
   * Approximates text wrapping based on character count
   * @private
   */
  _approximateWrapText(text, maxWidth, fontSize) {
    const avgCharWidthPx = fontSize * this.avgCharWidth;
    const charsPerLine = Math.floor(maxWidth / avgCharWidthPx);

    if (charsPerLine <= 0) {
      return [text];
    }

    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    let currentLength = 0;

    for (const word of words) {
      const wordLength = word.length;
      const testLength = currentLength + (currentLength > 0 ? 1 : 0) + wordLength;

      if (testLength > charsPerLine && currentLine) {
        lines.push(currentLine);
        currentLine = word;
        currentLength = wordLength;
      } else {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
        currentLength = testLength;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [''];
  }

  /**
   * Measures the dimensions of an image
   * Note: In Node.js, we would need to load the image first
   * For simplicity, this returns estimated dimensions
   */
  async measureImageDimensions(src, style) {
    // In a real implementation, you would load the image using the 'canvas' package
    // For now, returning a placeholder
    const maxWidth = style.maxWidth || 336;

    // You would typically use something like:
    // const { loadImage } = await import('canvas');
    // const image = await loadImage(src);
    // const naturalWidth = image.width;
    // const naturalHeight = image.height;

    // Placeholder: assume a 16:9 aspect ratio
    const estimatedWidth = maxWidth;
    const estimatedHeight = (maxWidth / 16) * 9;

    return {
      width: estimatedWidth,
      height: estimatedHeight
    };
  }

  /**
   * Measures the total height of a container with multiple blocks
   * This is a simplified version for CLI usage
   */
  async measureContainerHeight(blocks, style, renderBlock) {
    let totalHeight = 0;

    for (const block of blocks) {
      if (block.content?.type === 'text' && block.content?.data?.text) {
        const height = await this.measureTextHeight(block.content.data.text, {
          fontSize: 16,
          lineHeight: 1.2,
          width: style.width || 336
        });
        totalHeight += height;
      } else if (block.content?.type === 'image') {
        const dims = await this.measureImageDimensions(
          block.content?.data?.src || '',
          { maxWidth: style.width || 336 }
        );
        totalHeight += dims.height;
      }
    }

    return totalHeight * (style.zoom || 1);
  }

  /**
   * Cleanup method (no-op for canvas)
   */
  cleanup() {
    // Nothing to clean up for canvas
  }
}
