import { EnhancedUIController } from './ui/enhancedUIController.js';
import { DOMMeasurementProvider } from './measurement/domMeasurementProvider.js';
import { CardLayoutEngine } from './engine/cardLayoutEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the layout engine with DOM measurement provider
        const measurementProvider = new DOMMeasurementProvider();
        const layoutEngine = new CardLayoutEngine(measurementProvider);

        window.cardCreator = new EnhancedUIController(layoutEngine);
        console.log('✅ Card Creator v4.1 (Refatorado) inicializado com sucesso');
        console.log('🏛️  Arquitetura modular baseada nos princípios SOLID, KISS e DRY.');
        console.log('🔧 Layout Engine:', layoutEngine.getProviderInfo());
        console.log('📦 Plugins disponíveis:', window.cardCreator.state.pluginRegistry.getAll().map(p => p.name));
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        const container = document.getElementById('cardContent');
        if (container) {
            container.innerHTML = '<div style="color: red;">Erro crítico na inicialização da aplicação.</div>';
        }
    }
});
