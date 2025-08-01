import { EnhancedUIController } from './ui/enhancedUIController.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.cardCreator = new EnhancedUIController();
        console.log('✅ Card Creator v4.1 (Refatorado) inicializado com sucesso');
        console.log('🏛️  Arquitetura modular baseada nos princípios SOLID, KISS e DRY.');
        console.log('📦 Plugins disponíveis:', window.cardCreator.state.pluginRegistry.getAll().map(p => p.name));
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        const container = document.getElementById('cardContent');
        if (container) {
            container.innerHTML = '<div style="color: red;">Erro crítico na inicialização da aplicação.</div>';
        }
    }
});
