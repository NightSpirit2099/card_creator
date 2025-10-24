import { AdaptiveLayoutComposer } from '../layout/adaptiveLayoutComposer.js';
import { Result } from '../utils/result.js';
import { LayoutError } from '../utils/customErrors.js';

/**
 * CardLayoutEngine - Facade for the layout engine
 * This is the main entry point for layout calculations, independent of UI
 *
 * Usage:
 *   const engine = new CardLayoutEngine(measurementProvider);
 *   const result = await engine.calculateLayout(blocks, config);
 */
export class CardLayoutEngine {
  constructor(measurementProvider) {
    if (!measurementProvider) {
      throw new Error('CardLayoutEngine requires a measurementProvider');
    }
    this.measurementProvider = measurementProvider;
    this.composer = new AdaptiveLayoutComposer(measurementProvider);
  }

  /**
   * Calculates the optimal layout for given blocks and configuration
   * @param {Array<Object>} blocks - Array of block objects
   * @param {Object} config - Layout configuration
   * @param {number} config.globalContrast - Contrast level (1-5)
   * @param {number} config.typographicRatio - Typography scale ratio
   * @returns {Promise<Result>} Result object containing layout or error
   */
  async calculateLayout(blocks, config) {
    try {
      // Validate inputs
      if (!Array.isArray(blocks)) {
        return Result.failure(new LayoutError('Blocks must be an array'));
      }

      if (!config || typeof config !== 'object') {
        return Result.failure(new LayoutError('Config must be an object'));
      }

      if (typeof config.globalContrast !== 'number' ||
          config.globalContrast < 1 || config.globalContrast > 5) {
        return Result.failure(
          new LayoutError('globalContrast must be a number between 1 and 5')
        );
      }

      if (typeof config.typographicRatio !== 'number' ||
          config.typographicRatio < 1.1 || config.typographicRatio > 2.0) {
        return Result.failure(
          new LayoutError('typographicRatio must be a number between 1.1 and 2.0')
        );
      }

      // Delegate to the adaptive composer
      return await this.composer.createLayout(blocks, config);

    } catch (error) {
      return Result.failure(new LayoutError(
        'Error calculating layout: ' + error.message,
        { blocks, config }
      ));
    }
  }

  /**
   * Gets information about the measurement provider being used
   * @returns {Object} Provider information
   */
  getProviderInfo() {
    return {
      type: this.measurementProvider.constructor.name,
      isReady: !!this.measurementProvider
    };
  }
}
