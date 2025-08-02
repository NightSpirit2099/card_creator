import { Result } from '../utils/result.js';
import { CardCreatorError, LayoutError, ValidationError } from '../utils/customErrors.js';

export class LayoutOptimizer {
            constructor(blocks, layout, width) {
                this.blocks = blocks;
                this.layout = layout;
                this.width = width || 336;
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
                        width: this.width,
                        blocks: this.blocks
                    });
                    
                } catch (error) {
                    return Result.failure(new LayoutError(
                        'Erro na otimização de zoom: ' + error.message
                    ));
                }
            }
            
            async _checkZoomFits(zoom) {
                return new Promise((resolve, reject) => {
                    try {
                        const testContainer = document.createElement('div');
                        testContainer.style.cssText = `position: absolute; visibility: hidden; width: ${this.width}px;`;
                        document.body.appendChild(testContainer);
                        
                        const lowestHierarchy = Math.min(...this.blocks.map(b => b.hierarchy));
                        let totalHeight = 0;
                        const baseGap = this.layout.baseFontSize * this.layout.lineHeight * 0.5;
                        const totalGapHeight = (this.blocks.length - 1) * (baseGap * zoom);
                        
                        for (const block of this.blocks) {
                            const el = document.createElement('div');
                            const fontSize = this.layout.baseFontSize * 
                                Math.pow(this.layout.ratio, block.hierarchy - lowestHierarchy) * zoom;
                            el.style.cssText = `font-size: ${fontSize}px; line-height: ${this.layout.lineHeight};`;
                            
                            if (block.content?.data?.text) {
                                el.textContent = block.content.data.text;
                            } else if (block.content) {
                                el.textContent = block.content;
                            } else {
                                el.textContent = 'Sample text';
                            }
                            
                            testContainer.appendChild(el);
                            totalHeight += el.offsetHeight;
                        }
                        
                        const fits = totalHeight + totalGapHeight <= this.width;
                        document.body.removeChild(testContainer);
                        resolve(fits);
                        
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        }
        //
