import { BlockPlugin } from './blockPlugin.js';
import { Result } from '../utils/result.js';
import { ValidationError } from '../utils/customErrors.js';

export class ImageBlockPlugin extends BlockPlugin {
    constructor() {
        super('image', 'Imagem', '🖼️');
    }
    
    createBlock(data = { src: '', alt: 'Imagem', fit: 'cover' }) {
        try {
            const validationResult = this.validate(data);
            if (validationResult.isFailure) {
                return validationResult;
            }
            
            return Result.success({
                type: 'image',
                content: {
                    type: 'image',
                    data: validationResult.value
                }
            });
        } catch (error) {
            return Result.failure(new ValidationError(error.message));
        }
    }
    
    createEditor(block) {
        const container = document.createElement('div');
        
        const input = document.createElement('input');
        input.type = 'url';
        input.className = 'block-image-input';
        input.placeholder = 'URL da imagem...';
        input.value = block.content.data.src || '';
        
        const altInput = document.createElement('input');
        altInput.type = 'text';
        altInput.className = 'block-image-input';
        altInput.placeholder = 'Texto alternativo...';
        altInput.value = block.content.data.alt || 'Imagem';
        
        container.appendChild(input);
        container.appendChild(altInput);
        
        if (block.content.data.src) {
            const preview = document.createElement('img');
            preview.className = 'image-preview';
            preview.src = block.content.data.src;
            preview.alt = block.content.data.alt;
            preview.onerror = () => preview.style.display = 'none';
            container.appendChild(preview);
        }
        
        return container;
    }
    
    async measure(block, context) {
        return new Promise((resolve) => {
            if (!block.content.data.src) {
                resolve({ height: 60, lineCount: 1 });
                return;
            }
            
            const img = new Image();
            img.onload = () => {
                const aspectRatio = img.height / img.width;
                const width = Math.min(150, context.width * 0.8);
                const height = width * aspectRatio;
                resolve({ height: Math.min(height, 100), lineCount: 1 });
            };
            img.onerror = () => resolve({ height: 60, lineCount: 1 });
            img.src = block.content.data.src;
        });
    }
    
    render(block, context) {
        if (!block.content.data.src) {
            const placeholder = document.createElement('div');
            placeholder.className = 'card-element';
            placeholder.textContent = '🖼️ Adicione uma URL de imagem';
            placeholder.style.fontSize = `${context.fontSize}px`;
            placeholder.style.color = '#64748b';
            return placeholder;
        }
        
        const img = document.createElement('img');
        img.className = 'card-element image';
        img.src = block.content.data.src;
        img.alt = block.content.data.alt;
        img.onerror = () => {
            const fallback = document.createElement('div');
            fallback.className = 'card-element';
            fallback.textContent = '🖼️ Erro ao carregar imagem';
            fallback.style.fontSize = `${context.fontSize * 0.8}px`;
            fallback.style.color = '#ef4444';
            img.parentNode?.replaceChild(fallback, img);
        };
        return img;
    }
    
    validate(data) {
        if (!data || typeof data !== 'object') {
            return Result.failure(new ValidationError('Dados da imagem devem ser um objeto'));
        }
        
        // CORREÇÃO: Permitir URL vazia para blocos novos
        const src = data.src || '';
        
        // Se há URL, deve ser válida
        if (src && src.trim()) {
            try {
                new URL(src.trim());
            } catch {
                return Result.failure(new ValidationError('URL da imagem inválida'));
            }
        }
        
        return Result.success({
            src: src.trim(),
            alt: (data.alt || 'Imagem').trim(),
            fit: data.fit || 'cover'
        });
    }
}