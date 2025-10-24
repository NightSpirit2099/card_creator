/**
 * Interface for measurement providers that abstract DOM operations
 * This allows the layout engine to work in different environments (browser, Node.js, etc)
 */
export class IMeasurementProvider {
  /**
   * Measures the height of text with given styling
   * @param {string} text - The text content to measure
   * @param {Object} style - Styling properties
   * @param {string} style.fontFamily - Font family
   * @param {number} style.fontSize - Font size in pixels
   * @param {number} style.lineHeight - Line height (multiplier)
   * @param {number} style.width - Container width in pixels
   * @param {string} [style.fontWeight] - Font weight
   * @param {string} [style.whiteSpace] - White space handling
   * @param {string} [style.wordBreak] - Word break behavior
   * @returns {Promise<number>} The measured height in pixels
   */
  async measureTextHeight(text, style) {
    throw new Error('measureTextHeight must be implemented by subclass');
  }

  /**
   * Measures the dimensions of an image
   * @param {string} src - Image source URL
   * @param {Object} style - Styling properties
   * @param {number} style.maxWidth - Maximum width in pixels
   * @returns {Promise<{width: number, height: number}>} The measured dimensions
   */
  async measureImageDimensions(src, style) {
    throw new Error('measureImageDimensions must be implemented by subclass');
  }

  /**
   * Measures the total height of a container with multiple blocks
   * @param {Array<Object>} blocks - Array of block data
   * @param {Object} style - Container styling
   * @param {number} style.width - Container width in pixels
   * @param {number} style.zoom - Zoom level
   * @param {Function} renderBlock - Function to render each block
   * @returns {Promise<number>} The total height in pixels
   */
  async measureContainerHeight(blocks, style, renderBlock) {
    throw new Error('measureContainerHeight must be implemented by subclass');
  }
}
