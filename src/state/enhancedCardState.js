import { SimpleObservable } from '../utils/simpleObservable.js';
import { Debouncer } from '../utils/debouncer.js';
import { TextBlockPlugin } from '../plugins/textBlockPlugin.js';
import { ImageBlockPlugin } from '../plugins/imageBlockPlugin.js';
import { BlockPluginRegistry } from '../plugins/pluginRegistry.js';
import { AdaptiveLayoutComposer } from '../layout/adaptiveLayoutComposer.js';
import { Result } from '../utils/result.js';
import { CardCreatorError, LayoutError, ValidationError } from '../utils/customErrors.js';

export class EnhancedCardState {
            constructor() {
                this.blocks$ = new SimpleObservable([
                    { 
                        id: '1', 
                        type: 'text',
                        order: 1, 
                        content: { type: 'text', data: { text: "Explorando o Futuro da IA" } }
                    },
                    { 
                        id: '2', 
                        type: 'text',
                        order: 2, 
                        content: { type: 'text', data: { text: "Como a IA Generativa Molda Horizontes" } }
                    },
                    { 
                        id: '3', 
                        type: 'text',
                        order: 3, 
                        content: { type: 'text', data: { text: "Última atualização: 31 de julho de 2025" } }
                    }
                ]);
                
                this.config$ = new SimpleObservable({
                    globalContrast: 3,
                    typographicRatio: 1.250,
                    cardWidth: 400,
                    cardHeight: 400
                });
                
                this.layout$ = new SimpleObservable(null);
                this.errors$ = new SimpleObservable([]);
                
                this._nextId = 4;
                this._debouncer = new Debouncer(250);
                this.pluginRegistry = new BlockPluginRegistry();
                
                this._registerPlugins();
                
                this.blocks$.subscribe(() => this._scheduleLayoutUpdate());
                this.config$.subscribe(() => this._scheduleLayoutUpdate());
            }
            
            _registerPlugins() {
                this.pluginRegistry.register(new TextBlockPlugin());
                this.pluginRegistry.register(new ImageBlockPlugin());
            }
            
            // ===== MÉTODOS PÚBLICOS APRIMORADOS =====
            
            addBlock(type = null, data = null) {
                try {
                    const blockType = type || this.pluginRegistry.getSelectedType();
                    const plugin = this.pluginRegistry.get(blockType);
                    
                    if (!plugin) {
                        throw new ValidationError(`Plugin ${blockType} não encontrado`);
                    }
                    
                    // CORREÇÃO: Fornecer valor padrão apropriado se data for null
                    let blockData = data;
                    if (blockData === null || blockData === undefined) {
                        if (blockType === 'text') {
                            blockData = 'Novo Bloco de Texto';
                        } else if (blockType === 'image') {
                            blockData = { src: '', alt: 'Imagem', fit: 'cover' };
                        }
                    }
                    
                    const blockResult = plugin.createBlock(blockData);
                    if (blockResult.isFailure) {
                        throw blockResult.error;
                    }
                    
                    const blocks = [...this.blocks$.value];
                    const newOrder = blocks.length > 0 ? Math.max(...blocks.map(b => b.order)) + 1 : 1;
                    
                    const newBlock = {
                        id: String(this._nextId++),
                        type: blockType,
                        order: newOrder,
                        ...blockResult.value
                    };
                    
                    blocks.push(newBlock);
                    this.blocks$.value = blocks;
                    
                    this._clearErrors();
                    return Result.success(newBlock);
                    
                } catch (error) {
                    this._addError(error);
                    return Result.failure(error);
                }
            }
            
            updateBlock(id, updates) {
                try {
                    const blocks = [...this.blocks$.value];
                    const blockIndex = blocks.findIndex(b => b.id === id);
                    
                    if (blockIndex === -1) {
                        throw new ValidationError('Bloco não encontrado', { id });
                    }
                    
                    const block = blocks[blockIndex];
                    const plugin = this.pluginRegistry.get(block.type);
                    
                    if (!plugin) {
                        throw new ValidationError(`Plugin ${block.type} não encontrado`);
                    }
                    
                    // CORREÇÃO: Melhor handling de updates de conteúdo
                    let newContent = block.content;
                    if (updates.content !== undefined) {
                        // Para blocos de texto, o updates.content pode ser uma string simples
                        let contentData = updates.content;
                        if (block.type === 'text' && typeof updates.content === 'string') {
                            contentData = updates.content;
                        }
                        
                        const updateResult = plugin.createBlock(contentData);
                        if (updateResult.isFailure) {
                            throw updateResult.error;
                        }
                        newContent = updateResult.value.content;
                    }
                    
                    blocks[blockIndex] = {
                        ...block,
                        ...updates,
                        content: newContent
                    };
                    
                    this.blocks$.value = blocks;
                    return Result.success(blocks[blockIndex]);
                    
                } catch (error) {
                    this._addError(error);
                    return Result.failure(error);
                }
            }
            
            removeBlock(id) {
                try {
                    const blocks = this.blocks$.value.filter(b => b.id !== id);
                    
                    if (blocks.length === this.blocks$.value.length) {
                        throw new ValidationError('Bloco não encontrado para remoção', { id });
                    }
                    
                    blocks.forEach((block, index) => block.order = index + 1);
                    
                    this.blocks$.value = blocks;
                    this._clearErrors();
                    return Result.success(blocks);
                    
                } catch (error) {
                    this._addError(error);
                    return Result.failure(error);
                }
            }
            
            reorderBlocks(fromIndex, toIndex) {
                try {
                    const blocks = [...this.blocks$.value];
                    
                    if (fromIndex < 0 || fromIndex >= blocks.length || 
                        toIndex < 0 || toIndex >= blocks.length) {
                        throw new ValidationError('Índices de reordenação inválidos');
                    }
                    
                    const [movedBlock] = blocks.splice(fromIndex, 1);
                    blocks.splice(toIndex, 0, movedBlock);
                    
                    blocks.forEach((block, index) => block.order = index + 1);
                    
                    this.blocks$.value = blocks;
                    return Result.success(blocks);
                    
                } catch (error) {
                    this._addError(error);
                    return Result.failure(error);
                }
            }
            
            updateConfig(updates) {
                try {
                    const newConfig = { ...this.config$.value, ...updates };
                    
                    if (newConfig.globalContrast < 1 || newConfig.globalContrast > 5) {
                        throw new ValidationError('Contraste global deve estar entre 1 e 5');
                    }
                    
                    if (newConfig.typographicRatio < 1.1 || newConfig.typographicRatio > 2.0) {
                        throw new ValidationError('Ratio tipográfico deve estar entre 1.1 e 2.0');
                    }

                    if (newConfig.cardWidth < 100 || newConfig.cardHeight < 100) {
                        throw new ValidationError('Dimensões do card devem ser maiores que 100px');
                    }
                    
                    this.config$.value = newConfig;
                    this._clearErrors();
                    return Result.success(newConfig);
                    
                } catch (error) {
                    this._addError(error);
                    return Result.failure(error);
                }
            }
            
            // ===== MÉTODOS PRIVADOS =====
            
            _scheduleLayoutUpdate() {
                this._debouncer.execute(() => {
                    this._updateLayout();
                });
            }
            
            async _updateLayout() {
                try {
                    const blocks = this.blocks$.value;
                    const config = this.config$.value;
                    
                    if (blocks.length === 0) {
                        this.layout$.value = Result.success(null);
                        return;
                    }
                    
                    const layoutEngine = new AdaptiveLayoutComposer();
                    const result = await layoutEngine.createLayout(blocks, config);
                    
                    this.layout$.value = result;
                    
                    if (result.isFailure) {
                        this._addError(result.error);
                    } else {
                        this._clearErrors();
                    }
                    
                } catch (error) {
                    const layoutError = new LayoutError(
                        'Erro inesperado no motor adaptativo: ' + error.message,
                        { blocks: this.blocks$.value, config: this.config$.value }
                    );
                    
                    this.layout$.value = Result.failure(layoutError);
                    this._addError(layoutError);
                }
            }
            
            _addError(error) {
                const errors = [...this.errors$.value];
                errors.push(error);
                this.errors$.value = errors;
            }
            
            _clearErrors() {
                this.errors$.value = [];
            }
        }
        //
