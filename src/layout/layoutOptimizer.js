import { Result } from '../utils/result.js';
import { CardCreatorError, LayoutError, ValidationError } from '../utils/customErrors.js';

export class LayoutOptimizer {
            constructor(blocks, layout, measurementProvider) {
                this.blocks = blocks;
                this.layout = layout;
                this.measurementProvider = measurementProvider;
            }
            
            async optimizeZoom() {
                try {
                    let minZoom = 0.1;
                    let maxZoom = 5;
                    let bestZoom = 1;
                    
                    for (let i = 0; i < 8; i++) {
                        const guessZoom = (minZoom + maxZoom) / 2;
                        const fits = await this._checkZoomFits(guessZoom);
                        
                        if (fits) {
                            bestZoom = guessZoom;
                            minZoom = guessZoom;
                        } else {
                            maxZoom = guessZoom;
                        }
                    }
                    
                    return Result.success({
                        ...this.layout,
                        zoom: bestZoom,
                        blocks: this.blocks
                    });
                    
                } catch (error) {
                    return Result.failure(new LayoutError(
                        'Erro na otimização de zoom: ' + error.message
                    ));
                }
            }
            
            async _checkZoomFits(zoom) {
                try {
                    const lowestHierarchy = Math.min(...this.blocks.map(b => b.hierarchy));
                    let totalHeight = 0;
                    const baseGap = this.layout.baseFontSize * this.layout.lineHeight * 0.5;
                    const totalGapHeight = (this.blocks.length - 1) * (baseGap * zoom);

                    for (const block of this.blocks) {
                        const fontSize = this.layout.baseFontSize *
                            Math.pow(this.layout.ratio, block.hierarchy - lowestHierarchy) * zoom;

                        // Get text content from block
                        let text;
                        if (block.content?.data?.text) {
                            text = block.content.data.text;
                        } else if (block.content) {
                            text = block.content;
                        } else {
                            text = 'Sample text';
                        }

                        // Measure using the provider
                        const height = await this.measurementProvider.measureTextHeight(text, {
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: fontSize,
                            lineHeight: this.layout.lineHeight,
                            width: 336,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word'
                        });

                        totalHeight += height;
                    }

                    const fits = totalHeight + totalGapHeight <= 336;
                    return fits;

                } catch (error) {
                    throw error;
                }
            }
        }
        //
