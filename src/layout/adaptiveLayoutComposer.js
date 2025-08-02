import { ContentAnalyzer } from '../analysis/contentAnalyzer.js';
import { LayoutComposer } from './layoutComposer.js';
import { LayoutOptimizer } from './layoutOptimizer.js';
import { BlockPluginRegistry } from '../plugins/pluginRegistry.js';
import { Result } from '../utils/result.js';
import { LayoutError } from '../utils/customErrors.js';

export class LayoutStrategy {
    constructor(name) {
        this.name = name;
    }
    
    async compose(blocks, context) {
        throw new Error('compose must be implemented by subclass');
    }
}

export class TextOptimizedStrategy extends LayoutStrategy {
    constructor() {
        super('text-optimized');
    }
    
    async compose(blocks, context) {
        const composer = new LayoutComposer(blocks, context.config.typographicRatio, context.width);
        return composer.findBestCandidate();
    }
}

export class MixedContentStrategy extends LayoutStrategy {
    constructor() {
        super('mixed-content');
    }
    
    async compose(blocks, context) {
        const composer = new LayoutComposer(blocks, context.config.typographicRatio, context.width);
        const result = await composer.findBestCandidate();
        
        if (result.isSuccess) {
            const adjusted = { ...result.value };
            adjusted.baseFontSize = Math.max(adjusted.baseFontSize * 0.9, 6);
            return Result.success(adjusted);
        }
        
        return result;
    }
}

export class BalancedStrategy extends LayoutStrategy {
    constructor() {
        super('balanced');
    }
    
    async compose(blocks, context) {
        const composer = new LayoutComposer(blocks, context.config.typographicRatio, context.width);
        return composer.findBestCandidate();
    }
}

export class AdaptiveLayoutComposer {
    constructor() {
        this.contentAnalyzer = new ContentAnalyzer();
        this.strategies = new Map();
        this.pluginRegistry = new BlockPluginRegistry();
        
        this.strategies.set('text-optimized', new TextOptimizedStrategy());
        this.strategies.set('mixed-content', new MixedContentStrategy());
        this.strategies.set('balanced', new BalancedStrategy());
    }
    
    async createLayout(blocks, config) {
        try {
            if (!blocks || blocks.length === 0) {
                return Result.failure(new LayoutError('Nenhum bloco fornecido'));
            }
            
            const width = (config.cardWidth || 400) - 64;

            const analysis = this.contentAnalyzer.analyze(blocks);
            const strategy = this.selectOptimalStrategy(analysis, config);
            const blocksWithHierarchy = this._calculateHierarchy(blocks, config);

            const candidateResult = await strategy.compose(blocksWithHierarchy, {
                config,
                analysis,
                width
            });
            
            if (candidateResult.isFailure) {
                return candidateResult;
            }
            
            const optimizer = new LayoutOptimizer(blocksWithHierarchy, candidateResult.value, width);
            const finalResult = await optimizer.optimizeZoom();
            
            if (finalResult.isSuccess) {
                finalResult.value.strategy = strategy.name;
                finalResult.value.analysis = analysis;
            }
            
            return finalResult;
            
        } catch (error) {
            return Result.failure(new LayoutError(
                'Erro no motor adaptativo: ' + error.message,
                { blocks, config }
            ));
        }
    }
    
    selectOptimalStrategy(analysis, config) {
        if (analysis.hasImages && analysis.textDensity > 0.7) {
            return this.strategies.get('mixed-content');
        }
        
        if (analysis.hasOnlyText && analysis.totalBlocks > 3) {
            return this.strategies.get('text-optimized');
        }
        
        return this.strategies.get('balanced');
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
}