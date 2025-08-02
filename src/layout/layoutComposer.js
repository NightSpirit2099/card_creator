import { Result } from '../utils/result.js';
import { CardCreatorError, LayoutError, ValidationError } from '../utils/customErrors.js';

export class LayoutComposer {
            constructor(blocks, ratio, width) {
                this.blocks = [...blocks].sort((a, b) => b.hierarchy - a.hierarchy);
                this.ratio = ratio;
                this.width = width || 336;
            }
            
            async findBestCandidate() {
                try {
                    const candidates = this._generateCandidates();
                    let bestResult = { badness: Infinity, candidate: null };
                    
                    for (const candidate of candidates) {
                        const evaluation = await this._evaluateCandidate(candidate);
                        if (evaluation.badness < bestResult.badness) {
                            bestResult = { badness: evaluation.badness, candidate };
                        }
                    }
                    
                    if (bestResult.candidate === null) {
                        return Result.failure(new LayoutError('Nenhum candidato válido encontrado'));
                    }
                    
                    return Result.success({
                        ...bestResult.candidate,
                        badness: bestResult.badness,
                        ratio: this.ratio
                    });
                    
                } catch (error) {
                    return Result.failure(new LayoutError(
                        'Erro na composição de layout: ' + error.message
                    ));
                }
            }
            
            _generateCandidates() {
                let baseFontSizes;
                if (this.ratio >= 1.6) baseFontSizes = [5, 6, 7, 8, 10];
                else if (this.ratio >= 1.5) baseFontSizes = [6, 7, 8, 10, 12];
                else baseFontSizes = [8, 10, 12, 14, 16, 20];
                
                const lineHeights = [1.1, 1.2, 1.3];
                const candidates = [];
                
                for (const baseFontSize of baseFontSizes) {
                    for (const lineHeight of lineHeights) {
                        candidates.push({ baseFontSize, lineHeight });
                    }
                }
                
                return candidates;
            }
            
            async _evaluateCandidate(candidate) {
                return new Promise((resolve, reject) => {
                    try {
                        const testContainer = document.createElement('div');
                        testContainer.style.cssText = `position: absolute; visibility: hidden; width: ${this.width}px;`;
                        document.body.appendChild(testContainer);
                        
                        const lowestHierarchy = Math.min(...this.blocks.map(b => b.hierarchy));
                        const targetSizes = this.blocks.map(block => 
                            candidate.baseFontSize * Math.pow(this.ratio, block.hierarchy - lowestHierarchy)
                        );
                        
                        let totalHeight = 0;
                        const actualSizes = [];
                        const lineCounts = [];
                        const baseGap = candidate.baseFontSize * candidate.lineHeight * 0.5;
                        const totalGapHeight = (this.blocks.length - 1) * baseGap;
                        
                        for (let i = 0; i < this.blocks.length; i++) {
                            const el = document.createElement('div');
                            el.style.cssText = `font-size: ${targetSizes[i]}px; line-height: ${candidate.lineHeight};`;
                            
                            // Handle different block types
                            if (this.blocks[i].content?.data?.text) {
                                el.textContent = this.blocks[i].content.data.text;
                            } else if (this.blocks[i].content) {
                                el.textContent = this.blocks[i].content;
                            } else {
                                el.textContent = 'Sample text';
                            }
                            
                            testContainer.appendChild(el);
                            
                            actualSizes[i] = parseFloat(window.getComputedStyle(el).fontSize);
                            totalHeight += el.offsetHeight;
                            lineCounts[i] = Math.round(el.offsetHeight / (actualSizes[i] * candidate.lineHeight));
                        }
                        
                        const totalBlueprintHeight = totalHeight + totalGapHeight;
                        const badness = this._calculateBadness({
                            actualSizes,
                            targetSizes,
                            lineCounts,
                            totalBlueprintHeight
                        });
                        
                        document.body.removeChild(testContainer);
                        resolve({ badness });
                        
                    } catch (error) {
                        reject(new LayoutError('Erro na avaliação do candidato: ' + error.message));
                    }
                });
            }
            
            _calculateBadness({ actualSizes, targetSizes, lineCounts, totalBlueprintHeight }) {
                let totalBadness = 0;
                
                if (actualSizes.length > 0) {
                    totalBadness += (100 - actualSizes[0]) * 300;
                }
                
                let distortionPenalty = 0;
                for (let i = 0; i < actualSizes.length; i++) {
                    const distortion = Math.abs(actualSizes[i] - targetSizes[i]) / targetSizes[i] * 100;
                    distortionPenalty += Math.pow(distortion, 2);
                }
                totalBadness += distortionPenalty;
                
                let lineCountPenalty = 0;
                for (let i = 0; i < lineCounts.length; i++) {
                    if (lineCounts[i] > 1) {
                        lineCountPenalty += (lineCounts[i] - 1) * Math.pow(this.blocks[i].hierarchy, 2) * 50;
                    }
                }
                totalBadness += lineCountPenalty;
                
                const requiredZoom = this.width / totalBlueprintHeight;
                if (requiredZoom < 0.9) {
                    totalBadness += Math.pow(1 - requiredZoom, 2) * 50000;
                }
                
                return totalBadness;
            }
        }
        //
