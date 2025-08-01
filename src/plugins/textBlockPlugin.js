import { BlockPlugin } from './blockPlugin.js';
import { Result } from '../utils/result.js';
import { CardCreatorError, LayoutError, ValidationError } from '../utils/customErrors.js';

export class TextBlockPlugin extends BlockPlugin {
            constructor() {
                super('text', 'Texto', '📝');
            }
            
            createBlock(data = 'Novo Bloco de Texto') {
                try {
                    // CORREÇÃO: Garantir que data seja sempre uma string
                    let textData = data;
                    
                    // Se data é um objeto, extrair a propriedade text
                    if (typeof data === 'object' && data !== null) {
                        if (data.text !== undefined) {
                            textData = data.text;
                        } else if (data.content !== undefined) {
                            textData = data.content;
                        } else {
                            textData = String(data);
                        }
                    }
                    
                    // Se não é string, converter para string
                    if (typeof textData !== 'string') {
                        textData = String(textData);
                    }
                    
                    const validationResult = this.validate(textData);
                    if (validationResult.isFailure) {
                        return validationResult;
                    }
                    
                    return Result.success({
                        type: 'text',
                        content: {
                            type: 'text',
                            data: { text: validationResult.value }
                        }
                    });
                } catch (error) {
                    return Result.failure(new ValidationError(error.message));
                }
            }
            
            createEditor(block) {
                const textarea = document.createElement('textarea');
                textarea.className = 'block-content-input';
                textarea.rows = 3;
                textarea.value = block.content.data.text;
                return textarea;
            }
            
            async measure(block, context) {
                return new Promise((resolve) => {
                    const testEl = document.createElement('div');
                    testEl.style.cssText = `
                        position: absolute;
                        visibility: hidden;
                        width: ${context.width}px;
                        font-size: ${context.fontSize}px;
                        line-height: ${context.lineHeight};
                    `;
                    testEl.textContent = block.content.data.text;
                    document.body.appendChild(testEl);
                    
                    const height = testEl.offsetHeight;
                    const lineCount = Math.round(height / (context.fontSize * context.lineHeight));
                    
                    document.body.removeChild(testEl);
                    resolve({ height, lineCount });
                });
            }
            
            render(block, context) {
                const el = document.createElement('div');
                el.className = 'card-element';
                el.style.fontSize = `${context.fontSize}px`;
                el.style.lineHeight = context.lineHeight;
                el.textContent = block.content.data.text;
                return el;
            }
            
            validate(data) {
                // CORREÇÃO: Validação mais robusta
                if (data === null || data === undefined) {
                    return Result.failure(new ValidationError('Conteúdo não pode ser nulo ou indefinido'));
                }
                
                // Converter para string se não for
                let textData = data;
                if (typeof data !== 'string') {
                    textData = String(data);
                }
                
                const trimmed = textData.trim();
                if (trimmed.length === 0) {
                    return Result.failure(new ValidationError('Texto não pode estar vazio'));
                }
                
                if (trimmed.length > 200) {
                    return Result.failure(new ValidationError('Texto não pode exceder 200 caracteres'));
                }
                
                return Result.success(trimmed);
            }
        }
        //
