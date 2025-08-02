import { EnhancedCardState } from '../state/enhancedCardState.js';
import { EnhancedLayoutRenderer } from '../renderer/enhancedLayoutRenderer.js';
import { Debouncer } from '../utils/debouncer.js';
import { SCALE_OPTIONS } from '../utils/constants.js';

export class EnhancedUIController {
            constructor() {
                this.state = new EnhancedCardState();
                this.renderer = new EnhancedLayoutRenderer();
                this.sortableInstance = null;
                this.debugDebouncer = new Debouncer(100);
                this.inputDebouncer = new Debouncer(300);
                
                this._initializeEventListeners();
                this._initializeStateSubscriptions();
                this._renderInitialUI();
            }
            
            _initializeEventListeners() {
                this._renderPluginSelector();
                
                const addBtn = document.getElementById('addBlockBtn');
                if (addBtn) {
                    addBtn.addEventListener('click', () => this._handleAddBlock());
                }
                
                const scaleSlider = document.getElementById('scale-slider');
                const contrastSlider = document.getElementById('contrast-slider');
                
                if (scaleSlider) {
                    scaleSlider.addEventListener('input', (e) => this._handleScaleChange(e));
                }
                
                if (contrastSlider) {
                    contrastSlider.addEventListener('input', (e) => this._handleContrastChange(e));
                }
                
                const controlsPanel = document.getElementById('controls-panel');
                if (controlsPanel) {
                    controlsPanel.addEventListener('input', (e) => this._handleBlockInput(e));
                    controlsPanel.addEventListener('click', (e) => this._handleBlockClick(e));
                }
            }
            
            _initializeStateSubscriptions() {
                this.state.blocks$.subscribe((blocks) => {
                    this._renderBlockControls(blocks);
                    this._updateDebugInfo();
                });
                
                this.state.config$.subscribe((config) => {
                    this._updateConfigUI(config);
                    this._updateDebugInfo();
                });
                
                this.state.layout$.subscribe((layoutResult) => {
                    if (layoutResult && layoutResult.isSuccess) {
                        this.renderer.render(layoutResult.value, 'cardContent');
                        this._updateStatus('success');
                    } else if (layoutResult && layoutResult.isFailure) {
                        this._updateStatus('error');
                    }
                    this._updateDebugInfo();
                });
                
                this.state.errors$.subscribe((errors) => {
                    this._renderErrors(errors);
                    if (errors.length > 0) {
                        this._updateStatus('error');
                    }
                    this._updateDebugInfo();
                });
            }
            
            _renderInitialUI() {
                this._renderBlockControls(this.state.blocks$.value);
                this._updateConfigUI(this.state.config$.value);
            }
            
            _renderPluginSelector() {
                const container = document.getElementById('pluginSelector');
                if (!container) return;
                
                const plugins = this.state.pluginRegistry.getAll();
                
                container.innerHTML = '';
                plugins.forEach(plugin => {
                    const option = document.createElement('div');
                    option.className = 'plugin-option';
                    if (plugin.type === this.state.pluginRegistry.getSelectedType()) {
                        option.classList.add('selected');
                    }
                    option.dataset.type = plugin.type;
                    
                    option.innerHTML = `
                        <div class="plugin-icon">${plugin.icon}</div>
                        <div class="plugin-name">${plugin.name}</div>
                    `;
                    
                    option.addEventListener('click', () => {
                        container.querySelectorAll('.plugin-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        
                        option.classList.add('selected');
                        this.state.pluginRegistry.setSelectedType(plugin.type);
                    });
                    
                    container.appendChild(option);
                });
            }
            
            _handleAddBlock() {
                const selectedType = this.state.pluginRegistry.getSelectedType();
                
                // CORREÇÃO: Simplifcar a lógica de criação de blocos
                const result = this.state.addBlock(selectedType, null);
                if (result.isFailure) {
                    console.error('Erro ao adicionar bloco:', result.error);
                }
            }
            
            _handleScaleChange(event) {
                const scaleIndex = parseInt(event.target.value) - 1;
                const scaleOption = SCALE_OPTIONS[scaleIndex];
                
                if (scaleOption) {
                    const result = this.state.updateConfig({ typographicRatio: scaleOption.value });
                    if (result.isFailure) {
                        console.error('Erro ao atualizar escala:', result.error);
                    }
                }
            }
            
            _handleContrastChange(event) {
                const contrast = parseInt(event.target.value);
                this.state.updateConfig({ globalContrast: contrast });
            }
            
            _handleBlockInput(event) {
                if (event.target.classList.contains('block-content-input')) {
                    const blockEl = event.target.closest('.block-control');
                    if (blockEl) {
                        const id = blockEl.dataset.id;
                        // CORREÇÃO: Passar o valor diretamente como string para blocos de texto
                        this.inputDebouncer.execute(() => {
                            this.state.updateBlock(id, { content: event.target.value });
                        });
                    }
                } else if (event.target.classList.contains('block-image-input')) {
                    const blockEl = event.target.closest('.block-control');
                    if (blockEl) {
                        const id = blockEl.dataset.id;
                        const container = event.target.parentElement;
                        const inputs = container.querySelectorAll('.block-image-input');
                        
                        const data = {
                            src: inputs[0]?.value || '',
                            alt: inputs[1]?.value || 'Imagem'
                        };
                        
                        this.state.updateBlock(id, { content: data });
                    }
                }
            }
            
            _handleBlockClick(event) {
                if (event.target.classList.contains('block-remove-btn')) {
                    const blockEl = event.target.closest('.block-control');
                    if (blockEl) {
                        const id = blockEl.dataset.id;
                        this.state.removeBlock(id);
                    }
                }
            }
            
            _renderBlockControls(blocks) {
                const container = document.getElementById('blocksListContainer');
                if (!container) return;
                
                const config = this.state.config$.value;
                const blocksWithHierarchy = this._calculateHierarchy(blocks, config);
                
                container.innerHTML = '';
                
                blocksWithHierarchy.forEach(block => {
                    const plugin = this.state.pluginRegistry.get(block.type);
                    
                    const controlEl = document.createElement('div');
                    controlEl.className = `block-control ${block.type}`;
                    controlEl.dataset.id = block.id;
                    
                    const editor = plugin ? plugin.createEditor(block) : this._createFallbackEditor(block);
                    
                    controlEl.innerHTML = `
                        <div class="drag-handle" title="Arrastar para reordenar">⋮⋮</div>
                        <div class="block-content">
                            <div class="block-header">
                                <div class="block-type-info">
                                    <span class="block-type-icon">${plugin?.icon || '❓'}</span>
                                    <span class="hierarchy-value">Hierarquia ${block.hierarchy}</span>
                                </div>
                                <button class="block-remove-btn" title="Remover Bloco">&times;</button>
                            </div>
                            <div class="block-editor-container"></div>
                        </div>
                    `;
                    
                    const editorContainer = controlEl.querySelector('.block-editor-container');
                    editorContainer.appendChild(editor);
                    
                    container.appendChild(controlEl);
                });
                
                this._initializeSortable();
            }
            
            _createFallbackEditor(block) {
                const textarea = document.createElement('textarea');
                textarea.className = 'block-content-input';
                textarea.rows = 2;
                textarea.value = `Plugin ${block.type} não encontrado`;
                textarea.disabled = true;
                return textarea;
            }
            
            _initializeSortable() {
                const container = document.getElementById('blocksListContainer');
                if (!container) return;
                
                if (this.sortableInstance) {
                    this.sortableInstance.destroy();
                }
                
                this.sortableInstance = Sortable.create(container, {
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    handle: '.drag-handle',
                    onEnd: (evt) => {
                        this.state.reorderBlocks(evt.oldIndex, evt.newIndex);
                    }
                });
            }
            
            _updateConfigUI(config) {
                const contrastSlider = document.getElementById('contrast-slider');
                const scaleSlider = document.getElementById('scale-slider');
                
                if (contrastSlider) {
                    contrastSlider.value = config.globalContrast;
                }
                
                const scaleIndex = SCALE_OPTIONS.findIndex(s => 
                    Math.abs(s.value - config.typographicRatio) < 0.001
                );
                
                const validScaleIndex = scaleIndex >= 0 ? scaleIndex : 0;
                
                if (scaleSlider) {
                    scaleSlider.value = validScaleIndex + 1;
                }
                
                const scaleLabel = document.getElementById('scale-label');
                const contrastLabel = document.getElementById('contrast-label');
                const contrastLabels = ["Pianissimo", "Piano", "Mezzo-forte", "Forte", "Fortissimo"];
                
                if (scaleLabel) {
                    scaleLabel.textContent = SCALE_OPTIONS[validScaleIndex]?.name || 'Suave';
                }
                
                if (contrastLabel) {
                    contrastLabel.textContent = contrastLabels[config.globalContrast - 1] || 'Mezzo-forte';
                }
            }
            
            _calculateHierarchy(blocks, config) {
                const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
                
                if (sortedBlocks.length < 2) {
                    return sortedBlocks.map(block => ({ ...block, hierarchy: 5 }));
                }
                
                const highestHierarchy = 5;
                const lowestHierarchy = Math.max(1, 6 - config.globalContrast);
                const range = highestHierarchy - lowestHierarchy;
                const steps = sortedBlocks.length - 1;
                
                return sortedBlocks.map((block, index) => {
                    const hierarchy = steps === 0 ? 
                        highestHierarchy : 
                        highestHierarchy - (index * range / steps);
                        
                    return { ...block, hierarchy: Math.round(hierarchy) };
                });
            }
            
            _renderErrors(errors) {
                const container = document.getElementById('errorContainer');
                if (!container) return;
                
                container.innerHTML = '';
                
                errors.forEach(error => {
                    const errorEl = document.createElement('div');
                    errorEl.className = 'error-message';
                    errorEl.textContent = error.message;
                    container.appendChild(errorEl);
                });
            }
            
            _updateStatus(status) {
                const indicator = document.getElementById('statusIndicator');
                const text = document.getElementById('statusText');
                
                if (indicator && text) {
                    indicator.className = 'status-indicator';
                    
                    switch (status) {
                        case 'success':
                            text.textContent = 'Sistema Operacional';
                            break;
                        case 'error':
                            indicator.classList.add('error');
                            text.textContent = 'Erro Detectado';
                            break;
                        case 'warning':
                            indicator.classList.add('warning');
                            text.textContent = 'Atenção Requerida';
                            break;
                    }
                }
            }
            
            _updateDebugInfo() {
                this.debugDebouncer.execute(() => {
                    const debugElement = document.getElementById('debugInfo');
                    if (!debugElement) return;
                    
                    const blocks = this.state.blocks$.value;
                    const layout = this.state.layout$.value;
                    
                    const info = {
                        'Blocos': blocks.length,
                        'Tipos': [...new Set(blocks.map(b => b.type))].join(',').substring(0, 10),
                        'Plugins': this.state.pluginRegistry.getAll().length,
                        'Contraste': this.state.config$.value.globalContrast,
                        'Escala': this._getScaleName(this.state.config$.value.typographicRatio),
                        'Estratégia': layout?.value?.strategy?.substring(0, 8) || 'N/A',
                        'Erros': this.state.errors$.value.length,
                        'Layout': layout?.isSuccess ? 'OK' : 'ERR',
                        'Zoom': layout?.value?.zoom?.toFixed(2) || 'N/A',
                        'Status': 'CORRIGIDO'
                    };
                    
                    debugElement.innerHTML = Object.entries(info)
                        .map(([key, value]) => 
                            `<div class="debug-item">
                                <span class="debug-key">${key}:</span>
                                <span class="debug-value">${value}</span>
                            </div>`
                        ).join('');
                });
            }
            
            _getScaleName(ratio) {
                const option = SCALE_OPTIONS.find(s => 
                    Math.abs(s.value - ratio) < 0.001
                );
                return option ? option.name.substring(0, 4) : 'N/A';
            }
        }
        //
