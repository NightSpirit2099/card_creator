import { IMeasurementProvider } from './iMeasurementProvider.js';

/**
 * DOM-based measurement provider for browser environments
 * Uses actual DOM elements to measure text and image dimensions
 */
export class DOMMeasurementProvider extends IMeasurementProvider {
  constructor() {
    super();
    this._measurementContainer = null;
  }

  /**
   * Gets or creates the hidden measurement container
   * @private
   */
  _getMeasurementContainer() {
    if (!this._measurementContainer) {
      this._measurementContainer = document.createElement('div');
      this._measurementContainer.style.position = 'absolute';
      this._measurementContainer.style.left = '-9999px';
      this._measurementContainer.style.top = '-9999px';
      this._measurementContainer.style.visibility = 'hidden';
      document.body.appendChild(this._measurementContainer);
    }
    return this._measurementContainer;
  }

  /**
   * Measures the height of text with given styling
   */
  async measureTextHeight(text, style) {
    const container = this._getMeasurementContainer();
    const measureDiv = document.createElement('div');

    // Apply styles
    measureDiv.style.fontFamily = style.fontFamily || 'system-ui, -apple-system, sans-serif';
    measureDiv.style.fontSize = `${style.fontSize}px`;
    measureDiv.style.lineHeight = style.lineHeight.toString();
    measureDiv.style.width = `${style.width}px`;
    measureDiv.style.whiteSpace = style.whiteSpace || 'normal';
    measureDiv.style.wordBreak = style.wordBreak || 'break-word';

    if (style.fontWeight) {
      measureDiv.style.fontWeight = style.fontWeight;
    }

    measureDiv.textContent = text;
    container.appendChild(measureDiv);

    const height = measureDiv.offsetHeight;
    container.removeChild(measureDiv);

    return height;
  }

  /**
   * Measures the dimensions of an image
   */
  async measureImageDimensions(src, style) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = style.maxWidth;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        if (naturalWidth <= maxWidth) {
          resolve({ width: naturalWidth, height: naturalHeight });
        } else {
          const scaledHeight = (maxWidth / naturalWidth) * naturalHeight;
          resolve({ width: maxWidth, height: scaledHeight });
        }
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  /**
   * Measures the total height of a container with multiple blocks
   */
  async measureContainerHeight(blocks, style, renderBlock) {
    const container = this._getMeasurementContainer();
    const measureDiv = document.createElement('div');

    measureDiv.style.width = `${style.width}px`;
    measureDiv.style.zoom = style.zoom.toString();

    // Render all blocks into the container
    for (const block of blocks) {
      const blockElement = await renderBlock(block);
      if (blockElement) {
        measureDiv.appendChild(blockElement);
      }
    }

    container.appendChild(measureDiv);
    const height = measureDiv.offsetHeight;
    container.removeChild(measureDiv);

    return height;
  }

  /**
   * Cleanup method to remove measurement container
   */
  cleanup() {
    if (this._measurementContainer && this._measurementContainer.parentNode) {
      this._measurementContainer.parentNode.removeChild(this._measurementContainer);
      this._measurementContainer = null;
    }
  }
}
