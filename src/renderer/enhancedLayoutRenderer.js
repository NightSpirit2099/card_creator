import { TextBlockPlugin } from '../plugins/textBlockPlugin.js';
import { ImageBlockPlugin } from '../plugins/imageBlockPlugin.js';
import { BlockPluginRegistry } from '../plugins/pluginRegistry.js';
import { Result } from '../utils/result.js';
import { CardCreatorError, LayoutError, ValidationError } from '../utils/customErrors.js';

export class EnhancedLayoutRenderer {
            constructor() {
                this.pluginRegistry = new BlockPluginRegistry();
                this._registerPlugins();
            }
            
            _registerPlugins() {
                this.pluginRegistry.register(new TextBlockPlugin());
                this.pluginRegistry.register(new ImageBlockPlugin());
            }
            
            render(layout, targetElementId) {
                try {
                    const container = document.getElementById(targetElementId);
                    if (!container) {
                        throw new LayoutError(`Elemento ${targetElementId} não encontrado`);
                    }
                    
                    if (!layout || !layout.blocks) {
                        container.innerHTML = '<div class="card-element" style="color:#ef4444;">Layout inválido</div>';
                        return Result.failure(new LayoutError('Layout inválido fornecido'));
                    }
                    
                    container.innerHTML = '';
                    const baseGap = layout.baseFontSize * layout.lineHeight * 0.5;
                    container.style.gap = `${baseGap * layout.zoom}px`;
                    
                    const lowestHierarchy = Math.min(...layout.blocks.map(b => b.hierarchy));
                    
                    layout.blocks.forEach(block => {
                        const plugin = this.pluginRegistry.get(block.type);
                        
                        if (plugin) {
                            const finalSize = layout.baseFontSize * 
                                Math.pow(layout.ratio, block.hierarchy - lowestHierarchy) * layout.zoom;
                            
                            const context = {
                                fontSize: finalSize,
                                lineHeight: layout.lineHeight,
                                zoom: layout.zoom,
                                width: layout.width || 336
                            };
                            
                            const element = plugin.render(block, context);
                            container.appendChild(element);
                        } else {
                            // Fallback para blocos sem plugin
                            const el = document.createElement('div');
                            el.className = 'card-element';
                            el.textContent = `⚠️ Plugin ${block.type} não encontrado`;
                            el.style.color = '#ef4444';
                            container.appendChild(el);
                        }
                    });
                    
                    return Result.success('Renderização concluída');
                    
                } catch (error) {
                    return Result.failure(new LayoutError(
                        'Erro na renderização: ' + error.message,
                        { layout, targetElementId }
                    ));
                }
            }
        }
        //
