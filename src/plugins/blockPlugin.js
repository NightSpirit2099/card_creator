import { Result } from '../utils/result.js';

/**
         * Interface base para plugins de bloco
         */
        export class BlockPlugin {
            constructor(type, name, icon) {
                this.type = type;
                this.name = name;
                this.icon = icon;
            }
            
            /**
             * Cria um novo bloco deste tipo
             * @param {*} data - Dados para o bloco
             * @returns {Result<EnhancedBlock>}
             */
            createBlock(data) {
                throw new Error('createBlock must be implemented by subclass');
            }
            
            /**
             * Renderiza o editor do bloco
             * @param {EnhancedBlock} block - Bloco a ser editado
             * @returns {HTMLElement}
             */
            createEditor(block) {
                throw new Error('createEditor must be implemented by subclass');
            }
            
            /**
             * Mede as dimensões do bloco
             * @param {EnhancedBlock} block - Bloco a ser medido
             * @param {Object} context - Contexto de medição
             * @returns {Promise<Object>}
             */
            async measure(block, context) {
                throw new Error('measure must be implemented by subclass');
            }
            
            /**
             * Renderiza o bloco no card
             * @param {EnhancedBlock} block - Bloco a ser renderizado
             * @param {Object} context - Contexto de renderização
             * @returns {HTMLElement}
             */
            render(block, context) {
                throw new Error('render must be implemented by subclass');
            }
            
            /**
             * Valida dados do bloco
             * @param {*} data - Dados a serem validados
             * @returns {Result<*>}
             */
            validate(data) {
                return Result.success(data);
            }
        }
        //
