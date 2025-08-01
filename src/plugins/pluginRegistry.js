import { BlockPlugin } from './blockPlugin.js';
import { Result } from '../utils/result.js';

export class BlockPluginRegistry {
            constructor() {
                this.plugins = new Map();
                this.selectedType = 'text';
            }
            
            register(plugin) {
                if (!(plugin instanceof BlockPlugin)) {
                    throw new Error('Plugin must extend BlockPlugin');
                }
                this.plugins.set(plugin.type, plugin);
            }
            
            get(type) {
                return this.plugins.get(type);
            }
            
            getAll() {
                return Array.from(this.plugins.values());
            }
            
            createBlock(type, data) {
                const plugin = this.plugins.get(type);
                if (!plugin) {
                    return Result.failure(new Error(`Unknown block type: ${type}`));
                }
                return plugin.createBlock(data);
            }
            
            setSelectedType(type) {
                if (this.plugins.has(type)) {
                    this.selectedType = type;
                    return Result.success(type);
                }
                return Result.failure(new Error(`Plugin type ${type} not found`));
            }
            
            getSelectedType() {
                return this.selectedType;
            }
        }
        //
