/**
 * ARQV30 Enhanced - JavaScript Principal
 * Funcionalidades avançadas para análise de mercado com barra de progresso precisa
 */

// Estado global da aplicação
const AppState = {
    sessionId: generateSessionId(),
    attachments: [],
    currentAnalysis: null,
    isAnalyzing: false,
    progressInterval: null,
    startTime: null
};

// Configurações
const CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedExtensions: ['pdf', 'doc', 'docx', 'txt', 'json', 'csv', 'xlsx', 'xls'],
    apiBaseUrl: '/api',
    progressSteps: [
        { name: 'Processando dados do formulário', duration: 2000 },
        { name: 'Analisando anexos enviados', duration: 3000 },
        { name: 'Realizando busca profunda na internet', duration: 8000 },
        { name: 'Executando análise com Gemini Pro', duration: 15000 },
        { name: 'Consolidando insights e resultados', duration: 5000 },
        { name: 'Finalizando análise ultra-detalhada', duration: 2000 }
    ]
};

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🚀 Inicializando ARQV30 Enhanced v2.0');
    
    // Verificar status do sistema
    checkSystemStatus();
    
    // Inicializar componentes
    initializeFileUpload();
    initializeForm();
    initializeTooltips();
    
    // Auto-save do formulário
    initializeAutoSave();
    
    console.log('✅ Aplicação inicializada com sucesso');
}

/**
 * Verificação de status do sistema
 */
function checkSystemStatus() {
    fetch(`${CONFIG.apiBaseUrl}/app_status`)
        .then(response => response.json())
        .then(data => {
            updateStatusIndicator(data);
            logSystemInfo(data);
        })
        .catch(error => {
            console.error('❌ Erro ao verificar status do sistema:', error);
            updateStatusIndicator({ status: 'error', message: 'Erro de conexão' });
        });
}

function updateStatusIndicator(data) {
    const statusText = document.getElementById('status-text');
    const statusDot = document.querySelector('.status-dot');
    const versionInfo = document.getElementById('version-info');
    
    if (statusText) {
        if (data.status === 'running') {
            statusText.textContent = 'Sistema Online';
            statusText.style.color = '#34a853';
            if (statusDot) statusDot.style.background = '#34a853';
        } else {
            statusText.textContent = data.message || 'Sistema com Problemas';
            statusText.style.color = '#ea4335';
            if (statusDot) statusDot.style.background = '#ea4335';
        }
    }
    
    if (versionInfo) {
        versionInfo.textContent = `v${data.version || '2.0.0'}`;
    }
}

function logSystemInfo(data) {
    console.log('📊 Status do Sistema:', data);
    
    if (data.services) {
        console.log('🤖 Gemini:', data.services.gemini?.available ? '✅' : '❌');
        console.log('🚢 WebSailor:', data.services.websailor?.available ? '✅' : '❌');
        console.log('🔍 Deep Search:', data.services.deep_search?.available ? '✅' : '❌');
        console.log('📎 Attachments:', data.services.attachments?.available ? '✅' : '❌');
    }
}

/**
 * Sistema de upload de arquivos
 */
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Click para selecionar arquivos
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Seleção de arquivos
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
}

function handleFiles(files) {
    console.log(`📁 Processando ${files.length} arquivo(s)`);
    
    Array.from(files).forEach(file => {
        if (validateFile(file)) {
            uploadFile(file);
        }
    });
}

function validateFile(file) {
    // Verificar tamanho
    if (file.size > CONFIG.maxFileSize) {
        showNotification(`Arquivo "${file.name}" é muito grande. Máximo: 10MB`, 'error');
        return false;
    }
    
    // Verificar extensão
    const extension = file.name.split('.').pop().toLowerCase();
    if (!CONFIG.allowedExtensions.includes(extension)) {
        showNotification(`Tipo de arquivo "${extension}" não suportado`, 'error');
        return false;
    }
    
    return true;
}

function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', AppState.sessionId);
    
    // Mostrar progresso
    const attachmentId = Date.now().toString();
    addAttachmentToList(file, attachmentId, 'uploading');
    
    fetch(`${CONFIG.apiBaseUrl}/upload_attachment`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            updateAttachmentStatus(attachmentId, 'success', data);
            AppState.attachments.push({
                id: data.attachment_id,
                filename: file.name,
                content_type: data.content_type,
                preview: data.content_preview
            });
            showNotification(`Anexo "${file.name}" processado com sucesso`, 'success');
        } else {
            updateAttachmentStatus(attachmentId, 'error', data);
            showNotification(`Erro ao processar "${file.name}": ${data.error}`, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Erro no upload:', error);
        updateAttachmentStatus(attachmentId, 'error', { error: error.message });
        showNotification(`Erro no upload de "${file.name}"`, 'error');
    });
}

function addAttachmentToList(file, attachmentId, status) {
    const attachmentList = document.getElementById('attachmentList');
    if (!attachmentList) return;
    
    const attachmentItem = document.createElement('div');
    attachmentItem.className = 'attachment-item';
    attachmentItem.id = `attachment-${attachmentId}`;
    
    const statusIcon = getStatusIcon(status);
    const fileIcon = getFileIcon(file.name);
    
    attachmentItem.innerHTML = `
        <div class="attachment-info">
            <i class="${fileIcon} attachment-icon"></i>
            <div>
                <div style="font-weight: 500; color: var(--text-primary);">${file.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                    ${formatFileSize(file.size)} • ${status === 'uploading' ? 'Processando...' : 'Pronto'}
                </div>
            </div>
        </div>
        <div class="attachment-status">
            <i class="${statusIcon}" style="margin-right: 8px;"></i>
            <button class="remove-attachment" onclick="removeAttachment('${attachmentId}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    attachmentList.appendChild(attachmentItem);
}

function updateAttachmentStatus(attachmentId, status, data) {
    const attachmentItem = document.getElementById(`attachment-${attachmentId}`);
    if (!attachmentItem) return;
    
    const statusIcon = getStatusIcon(status);
    const statusElement = attachmentItem.querySelector('.attachment-status i');
    const infoElement = attachmentItem.querySelector('.attachment-info div div:last-child');
    
    if (statusElement) {
        statusElement.className = statusIcon;
    }
    
    if (infoElement) {
        if (status === 'success') {
            infoElement.innerHTML = `${infoElement.innerHTML.split(' • ')[0]} • ${data.content_type || 'Processado'}`;
        } else if (status === 'error') {
            infoElement.innerHTML = `${infoElement.innerHTML.split(' • ')[0]} • Erro: ${data.error || 'Falha no upload'}`;
        }
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'uploading': return 'fas fa-spinner fa-spin';
        case 'success': return 'fas fa-check-circle text-success';
        case 'error': return 'fas fa-exclamation-circle text-error';
        default: return 'fas fa-file';
    }
}

function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'doc':
        case 'docx': return 'fas fa-file-word';
        case 'txt': return 'fas fa-file-alt';
        case 'json': return 'fas fa-file-code';
        case 'csv':
        case 'xlsx':
        case 'xls': return 'fas fa-file-excel';
        default: return 'fas fa-file';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeAttachment(attachmentId) {
    const attachmentItem = document.getElementById(`attachment-${attachmentId}`);
    if (attachmentItem) {
        attachmentItem.remove();
    }
    
    // Remover do estado
    AppState.attachments = AppState.attachments.filter(att => att.id !== attachmentId);
    
    showNotification('Anexo removido', 'info');
}

/**
 * Sistema de formulário
 */
function initializeForm() {
    const form = document.getElementById('analysisForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Validação em tempo real
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (AppState.isAnalyzing) {
        showNotification('Análise já em andamento', 'warning');
        return;
    }
    
    if (!validateForm()) {
        return;
    }
    
    startAnalysis();
}

function validateForm() {
    const form = document.getElementById('analysisForm');
    const formData = new FormData(form);
    
    // Verificar campos obrigatórios
    const segmento = formData.get('segmento');
    if (!segmento || segmento.trim().length < 3) {
        showNotification('Segmento de mercado é obrigatório (mín. 3 caracteres)', 'error');
        document.getElementById('segmento').focus();
        return false;
    }
    
    return true;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ea4335';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ea4335';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Sistema de análise com barra de progresso precisa
 */
function startAnalysis() {
    console.log('🔍 Iniciando análise ultra-detalhada');
    
    AppState.isAnalyzing = true;
    AppState.startTime = Date.now();
    
    // Coletar dados do formulário
    const formData = collectFormData();
    
    // Mostrar loading com progresso
    showLoadingScreen();
    
    // Iniciar progresso simulado
    startProgressSimulation();
    
    // Enviar para análise
    performAnalysis(formData);
}

function collectFormData() {
    const form = document.getElementById('analysisForm');
    const formData = new FormData(form);
    
    const data = {
        segmento: formData.get('segmento'),
        produto: formData.get('produto'),
        publico: formData.get('publico'),
        preco: formData.get('preco'),
        concorrentes: formData.get('concorrentes'),
        objetivoReceita: formData.get('objetivoReceita'),
        orcamentoMarketing: formData.get('orcamentoMarketing'),
        prazoLancamento: formData.get('prazoLancamento'),
        query: formData.get('query'),
        dadosAdicionais: formData.get('dadosAdicionais'),
        session_id: AppState.sessionId
    };
    
    console.log('📋 Dados coletados:', data);
    return data;
}

function showLoadingScreen() {
    const formSection = document.querySelector('.form-section');
    const loadingSection = document.getElementById('loadingSection');
    
    if (formSection) formSection.style.display = 'none';
    if (loadingSection) loadingSection.style.display = 'block';
    
    // Criar estrutura de progresso se não existir
    createProgressStructure();
}

function createProgressStructure() {
    const loadingSection = document.getElementById('loadingSection');
    if (!loadingSection) return;
    
    loadingSection.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <h3>Processando Análise Ultra-Detalhada...</h3>
            <p id="loadingStatus">Iniciando análise com IA avançada...</p>
            
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressBar" style="width: 0%"></div>
                </div>
                <div class="progress-info">
                    <span class="progress-percentage" id="progressPercentage">0%</span>
                    <span class="progress-eta" id="progressETA">Calculando tempo...</span>
                </div>
            </div>
            
            <div id="progressSteps" style="margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">
                <div class="progress-step">⏳ Processando dados do formulário...</div>
            </div>
        </div>
    `;
}

function startProgressSimulation() {
    let currentStep = 0;
    let currentProgress = 0;
    const totalDuration = CONFIG.progressSteps.reduce((sum, step) => sum + step.duration, 0);
    
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressETA = document.getElementById('progressETA');
    const loadingStatus = document.getElementById('loadingStatus');
    const progressSteps = document.getElementById('progressSteps');
    
    function updateProgress() {
        if (currentStep < CONFIG.progressSteps.length && AppState.isAnalyzing) {
            const step = CONFIG.progressSteps[currentStep];
            const stepProgress = Math.min(100, currentProgress + (100 / CONFIG.progressSteps.length));
            
            // Atualizar barra de progresso
            if (progressBar) progressBar.style.width = `${stepProgress}%`;
            if (progressPercentage) progressPercentage.textContent = `${Math.round(stepProgress)}%`;
            
            // Calcular ETA
            const elapsed = Date.now() - AppState.startTime;
            const estimatedTotal = (elapsed / stepProgress) * 100;
            const remaining = Math.max(0, estimatedTotal - elapsed);
            const etaMinutes = Math.ceil(remaining / 60000);
            const etaSeconds = Math.ceil((remaining % 60000) / 1000);
            
            if (progressETA) {
                if (etaMinutes > 0) {
                    progressETA.textContent = `~${etaMinutes}min ${etaSeconds}s restantes`;
                } else {
                    progressETA.textContent = `~${etaSeconds}s restantes`;
                }
            }
            
            // Atualizar status
            if (loadingStatus) loadingStatus.textContent = step.name;
            
            // Atualizar steps
            if (progressSteps) {
                const stepElement = document.createElement('div');
                stepElement.className = 'progress-step completed';
                stepElement.innerHTML = `✅ ${step.name}`;
                progressSteps.appendChild(stepElement);
            }
            
            currentProgress = stepProgress;
            currentStep++;
            
            // Próximo step
            if (currentStep < CONFIG.progressSteps.length) {
                AppState.progressInterval = setTimeout(updateProgress, CONFIG.progressSteps[currentStep - 1].duration);
            }
        }
    }
    
    // Iniciar progresso
    updateProgress();
}

function performAnalysis(data) {
    fetch(`${CONFIG.apiBaseUrl}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('✅ Análise concluída:', result);
        AppState.currentAnalysis = result;
        
        // Finalizar progresso
        finishProgress();
        
        // Mostrar resultados após um delay para completar a animação
        setTimeout(() => {
            showResults(result);
        }, 1000);
    })
    .catch(error => {
        console.error('❌ Erro na análise:', error);
        finishProgress();
        setTimeout(() => {
            showAnalysisError(error);
        }, 1000);
    })
    .finally(() => {
        AppState.isAnalyzing = false;
        if (AppState.progressInterval) {
            clearTimeout(AppState.progressInterval);
        }
    });
}

function finishProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressETA = document.getElementById('progressETA');
    const loadingStatus = document.getElementById('loadingStatus');
    
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercentage) progressPercentage.textContent = '100%';
    if (progressETA) progressETA.textContent = 'Concluído!';
    if (loadingStatus) loadingStatus.textContent = 'Análise concluída com sucesso!';
}

function showResults(result) {
    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    
    if (loadingSection) loadingSection.style.display = 'none';
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
    }
    
    const resultsContainer = document.getElementById('analysisResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = formatAnalysisResults(result);
    }
    
    // Scroll para os resultados
    if (resultsSection) {
        resultsSection.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    showNotification('Análise ultra-detalhada concluída com sucesso!', 'success');
}

function formatAnalysisResults(result) {
    let html = '';
    
    // Informações sobre contextos utilizados
    if (result.search_context_used || result.websailor_used || result.attachments_used) {
        html += `
            <div class="result-card" style="background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1)); border-left: 4px solid var(--brand-primary);">
                <h3><i class="fas fa-info-circle"></i> Contextos Utilizados na Análise</h3>
                <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 15px;">
                    ${result.websailor_used ? '<div class="feature-item"><i class="fas fa-ship"></i> WebSailor Navigation</div>' : ''}
                    ${result.search_context_used ? '<div class="feature-item"><i class="fas fa-search"></i> Busca Profunda</div>' : ''}
                    ${result.attachments_used ? '<div class="feature-item"><i class="fas fa-paperclip"></i> Análise de Anexos</div>' : ''}
                </div>
            </div>
        `;
    }
    
    // Avatar Ultra-Detalhado
    if (result.avatar_ultra_detalhado) {
        html += formatAvatarSection(result.avatar_ultra_detalhado);
    }
    
    // Escopo e Posicionamento
    if (result.escopo) {
        html += formatSection('Escopo e Posicionamento', result.escopo, 'fas fa-bullseye');
    }
    
    // Análise de Concorrência
    if (result.analise_concorrencia_detalhada) {
        html += formatCompetitionSection(result.analise_concorrencia_detalhada);
    }
    
    // Estratégia de Marketing
    if (result.estrategia_palavras_chave) {
        html += formatMarketingSection(result.estrategia_palavras_chave);
    }
    
    // Métricas de Performance
    if (result.metricas_performance_detalhadas) {
        html += formatMetricsSection(result.metricas_performance_detalhadas);
    }
    
    // Projeções e Cenários
    if (result.projecoes_cenarios) {
        html += formatScenariosSection(result.projecoes_cenarios);
    }
    
    // Inteligência de Mercado
    if (result.inteligencia_mercado) {
        html += formatSection('Inteligência de Mercado', result.inteligencia_mercado, 'fas fa-brain');
    }
    
    // Plano de Ação
    if (result.plano_acao_detalhado) {
        html += formatActionPlanSection(result.plano_acao_detalhado);
    }
    
    // Insights Exclusivos
    if (result.insights_exclusivos) {
        html += formatInsightsSection(result.insights_exclusivos);
    }
    
    return html;
}

function formatAvatarSection(avatarData) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-user-circle"></i> Avatar Ultra-Detalhado</h3>
    `;
    
    // Perfil Demográfico
    if (avatarData.perfil_demografico) {
        html += `<h4>📊 Perfil Demográfico</h4>`;
        html += `<div class="metrics-grid">`;
        
        Object.entries(avatarData.perfil_demografico).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                html += `
                    <div class="metric-item">
                        <div class="metric-label">${formatKey(key)}</div>
                        <div class="metric-value" style="font-size: 1rem; color: var(--text-primary);">${value}</div>
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    }
    
    // Perfil Psicográfico
    if (avatarData.perfil_psicografico) {
        html += `<h4>🧠 Perfil Psicográfico</h4>`;
        Object.entries(avatarData.perfil_psicografico).forEach(([key, value]) => {
            if (value) {
                html += `<p><strong>${formatKey(key)}:</strong> ${value}</p>`;
            }
        });
    }
    
    // Dores Específicas
    if (avatarData.dores_especificas && Array.isArray(avatarData.dores_especificas)) {
        html += `<h4>💔 Dores Específicas</h4>`;
        html += `<ul>`;
        avatarData.dores_especificas.forEach(dor => {
            html += `<li style="margin-bottom: 8px; color: var(--text-secondary);">${dor}</li>`;
        });
        html += `</ul>`;
    }
    
    // Desejos Profundos
    if (avatarData.desejos_profundos && Array.isArray(avatarData.desejos_profundos)) {
        html += `<h4>✨ Desejos Profundos</h4>`;
        html += `<ul>`;
        avatarData.desejos_profundos.forEach(desejo => {
            html += `<li style="margin-bottom: 8px; color: var(--text-secondary);">${desejo}</li>`;
        });
        html += `</ul>`;
    }
    
    // Gatilhos Mentais
    if (avatarData.gatilhos_mentais && Array.isArray(avatarData.gatilhos_mentais)) {
        html += `<h4>🎯 Gatilhos Mentais</h4>`;
        html += `<ul>`;
        avatarData.gatilhos_mentais.forEach(gatilho => {
            html += `<li style="margin-bottom: 8px; color: var(--text-secondary);">${gatilho}</li>`;
        });
        html += `</ul>`;
    }
    
    html += `</div>`;
    return html;
}

function formatCompetitionSection(competitionData) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-chess"></i> Análise de Concorrência</h3>
    `;
    
    // Concorrentes Diretos
    if (competitionData.concorrentes_diretos && Array.isArray(competitionData.concorrentes_diretos)) {
        html += `<h4>🎯 Concorrentes Diretos</h4>`;
        competitionData.concorrentes_diretos.forEach((concorrente, index) => {
            if (typeof concorrente === 'object') {
                html += `
                    <div style="background: var(--neo-bg); padding: 15px; border-radius: var(--neo-border-radius-small); margin-bottom: 15px; border-left: 4px solid var(--brand-accent);">
                        <h5 style="color: var(--brand-accent); margin-bottom: 10px;">${concorrente.nome || `Concorrente ${index + 1}`}</h5>
                        ${concorrente.preco_range ? `<p><strong>Preço:</strong> ${concorrente.preco_range}</p>` : ''}
                        ${concorrente.posicionamento ? `<p><strong>Posicionamento:</strong> ${concorrente.posicionamento}</p>` : ''}
                        ${concorrente.pontos_fortes ? `<p><strong>Pontos Fortes:</strong> ${concorrente.pontos_fortes}</p>` : ''}
                        ${concorrente.pontos_fracos ? `<p><strong>Pontos Fracos:</strong> ${concorrente.pontos_fracos}</p>` : ''}
                    </div>
                `;
            }
        });
    }
    
    // Gaps de Mercado
    if (competitionData.gaps_mercado && Array.isArray(competitionData.gaps_mercado)) {
        html += `<h4>🔍 Oportunidades de Mercado</h4>`;
        html += `<ul>`;
        competitionData.gaps_mercado.forEach(gap => {
            html += `<li style="margin-bottom: 8px; color: var(--brand-secondary);">${gap}</li>`;
        });
        html += `</ul>`;
    }
    
    html += `</div>`;
    return html;
}

function formatMarketingSection(marketingData) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-megaphone"></i> Estratégia de Marketing</h3>
    `;
    
    // Palavras-chave Primárias
    if (marketingData.palavras_chave_primarias && Array.isArray(marketingData.palavras_chave_primarias)) {
        html += `<h4>🔑 Palavras-Chave Primárias</h4>`;
        html += `<div style="overflow-x: auto;">`;
        html += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">`;
        html += `<thead><tr style="background: var(--neo-bg);">`;
        html += `<th style="padding: 10px; text-align: left; color: var(--text-primary);">Termo</th>`;
        html += `<th style="padding: 10px; text-align: left; color: var(--text-primary);">Volume</th>`;
        html += `<th style="padding: 10px; text-align: left; color: var(--text-primary);">Dificuldade</th>`;
        html += `<th style="padding: 10px; text-align: left; color: var(--text-primary);">CPC</th>`;
        html += `</tr></thead><tbody>`;
        
        marketingData.palavras_chave_primarias.forEach(palavra => {
            if (typeof palavra === 'object') {
                html += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">`;
                html += `<td style="padding: 10px; color: var(--text-secondary);">${palavra.termo || 'N/A'}</td>`;
                html += `<td style="padding: 10px; color: var(--text-secondary);">${palavra.volume_mensal || 'N/A'}</td>`;
                html += `<td style="padding: 10px; color: var(--text-secondary);">${palavra.dificuldade || 'N/A'}</td>`;
                html += `<td style="padding: 10px; color: var(--text-secondary);">${palavra.cpc_estimado || 'N/A'}</td>`;
                html += `</tr>`;
            }
        });
        
        html += `</tbody></table></div>`;
    }
    
    // Canais de Marketing
    if (marketingData.canais_marketing) {
        html += `<h4>📢 Canais de Marketing</h4>`;
        Object.entries(marketingData.canais_marketing).forEach(([canal, dados]) => {
            if (typeof dados === 'object') {
                html += `
                    <div style="background: var(--neo-bg); padding: 15px; border-radius: var(--neo-border-radius-small); margin-bottom: 15px;">
                        <h5 style="color: var(--brand-primary); margin-bottom: 10px;">${formatKey(canal)}</h5>
                        ${dados.estrategia ? `<p><strong>Estratégia:</strong> ${dados.estrategia}</p>` : ''}
                        ${dados.orcamento_sugerido ? `<p><strong>Orçamento:</strong> ${dados.orcamento_sugerido}</p>` : ''}
                        ${dados.cpc_medio ? `<p><strong>CPC Médio:</strong> ${dados.cpc_medio}</p>` : ''}
                    </div>
                `;
            }
        });
    }
    
    html += `</div>`;
    return html;
}

function formatMetricsSection(metricsData) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-chart-bar"></i> Métricas de Performance</h3>
    `;
    
    // KPIs Principais
    if (metricsData.kpis_principais) {
        html += `<h4>📊 KPIs Principais</h4>`;
        html += `<div class="metrics-grid">`;
        
        Object.entries(metricsData.kpis_principais).forEach(([key, value]) => {
            if (value && key !== 'resumo') {
                html += `
                    <div class="metric-item">
                        <div class="metric-value">${value}</div>
                        <div class="metric-label">${formatKey(key)}</div>
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    }
    
    // Projeções de Vendas
    if (metricsData.projecoes_vendas) {
        html += `<h4>📈 Projeções de Vendas</h4>`;
        html += `<div class="metrics-grid">`;
        
        Object.entries(metricsData.projecoes_vendas).forEach(([periodo, valor]) => {
            html += `
                <div class="metric-item">
                    <div class="metric-value">${valor}</div>
                    <div class="metric-label">${formatKey(periodo)}</div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}

function formatScenariosSection(scenariosData) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-chart-line"></i> Projeções e Cenários</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
    `;
    
    const scenarios = ['cenario_conservador', 'cenario_realista', 'cenario_otimista'];
    const scenarioNames = ['Conservador', 'Realista', 'Otimista'];
    const scenarioColors = ['#ea4335', '#4285f4', '#34a853'];
    
    scenarios.forEach((scenario, index) => {
        if (scenariosData[scenario]) {
            const data = scenariosData[scenario];
            html += `
                <div style="background: var(--neo-bg); padding: 20px; border-radius: var(--neo-border-radius-small); border-left: 4px solid ${scenarioColors[index]};">
                    <h4 style="color: ${scenarioColors[index]}; margin-bottom: 15px;">${scenarioNames[index]}</h4>
                    ${data.vendas_mensais ? `<p><strong>Vendas Mensais:</strong> ${data.vendas_mensais}</p>` : ''}
                    ${data.receita_mensal ? `<p><strong>Receita Mensal:</strong> ${data.receita_mensal}</p>` : ''}
                    ${data.receita_anual ? `<p><strong>Receita Anual:</strong> ${data.receita_anual}</p>` : ''}
                    ${data.margem_lucro ? `<p><strong>Margem de Lucro:</strong> ${data.margem_lucro}</p>` : ''}
                    
                    ${data.premissas && Array.isArray(data.premissas) ? `
                        <div style="margin-top: 15px;">
                            <strong>Premissas:</strong>
                            <ul style="margin-top: 5px;">
                                ${data.premissas.map(premissa => `<li style="font-size: 0.9rem; color: var(--text-muted);">${premissa}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    });
    
    html += `</div></div>`;
    return html;
}

function formatActionPlanSection(actionPlan) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-tasks"></i> Plano de Ação Detalhado</h3>
    `;
    
    const phases = ['fase_pre_lancamento', 'fase_lancamento', 'fase_pos_lancamento'];
    const phaseNames = ['Pré-Lançamento', 'Lançamento', 'Pós-Lançamento'];
    const phaseIcons = ['fas fa-cog', 'fas fa-rocket', 'fas fa-chart-line'];
    
    phases.forEach((phase, index) => {
        if (actionPlan[phase]) {
            const phaseData = actionPlan[phase];
            html += `
                <div style="background: var(--neo-bg); padding: 20px; border-radius: var(--neo-border-radius-small); margin-bottom: 20px; border-left: 4px solid var(--brand-primary);">
                    <h4 style="color: var(--brand-primary); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="${phaseIcons[index]}"></i> ${phaseNames[index]}
                    </h4>
                    
                    ${phaseData.duracao ? `<p><strong>Duração:</strong> ${phaseData.duracao}</p>` : ''}
                    
                    ${phaseData.acoes && Array.isArray(phaseData.acoes) ? `
                        <div style="margin-top: 15px;">
                            <strong>Ações:</strong>
                            ${phaseData.acoes.map((acao, actionIndex) => {
                                if (typeof acao === 'object') {
                                    return `
                                        <div style="background: var(--neo-bg-dark); padding: 15px; border-radius: var(--neo-border-radius-small); margin: 10px 0;">
                                            <h6 style="color: var(--text-primary); margin-bottom: 8px;">${actionIndex + 1}. ${acao.acao || 'Ação não especificada'}</h6>
                                            ${acao.responsavel ? `<p style="font-size: 0.9rem;"><strong>Responsável:</strong> ${acao.responsavel}</p>` : ''}
                                            ${acao.prazo ? `<p style="font-size: 0.9rem;"><strong>Prazo:</strong> ${acao.prazo}</p>` : ''}
                                            ${acao.recursos_necessarios ? `<p style="font-size: 0.9rem;"><strong>Recursos:</strong> ${acao.recursos_necessarios}</p>` : ''}
                                            ${acao.resultado_esperado ? `<p style="font-size: 0.9rem;"><strong>Resultado:</strong> ${acao.resultado_esperado}</p>` : ''}
                                        </div>
                                    `;
                                }
                                return `<p style="margin: 5px 0;">• ${acao}</p>`;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
    });
    
    html += `</div>`;
    return html;
}

function formatInsightsSection(insights) {
    if (!Array.isArray(insights)) return '';
    
    let html = `
        <div class="insights-section">
            <h3 style="color: var(--text-primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-lightbulb" style="color: var(--brand-secondary);"></i> Insights Exclusivos
            </h3>
    `;
    
    insights.forEach((insight, index) => {
        html += `
            <div class="insight-item">
                <div class="insight-number">${index + 1}</div>
                <div class="insight-text">${insight}</div>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

function formatSection(title, data, icon) {
    if (!data || typeof data !== 'object') {
        return '';
    }
    
    let content = '';
    
    for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            content += `<h4 style="color: var(--brand-secondary); margin: 20px 0 10px 0;">${formatKey(key)}</h4>`;
            content += formatObject(value);
        } else if (Array.isArray(value)) {
            content += `<h4 style="color: var(--brand-secondary); margin: 20px 0 10px 0;">${formatKey(key)}</h4>`;
            content += `<ul>`;
            value.forEach(item => {
                if (typeof item === 'object') {
                    content += `<li style="margin-bottom: 10px;">`;
                    Object.entries(item).forEach(([subKey, subValue]) => {
                        content += `<strong>${formatKey(subKey)}:</strong> ${subValue}<br>`;
                    });
                    content += `</li>`;
                } else {
                    content += `<li style="margin-bottom: 5px; color: var(--text-secondary);">${item}</li>`;
                }
            });
            content += `</ul>`;
        } else if (value) {
            content += `<p><strong>${formatKey(key)}:</strong> ${value}</p>`;
        }
    }
    
    return `
        <div class="result-card">
            <h3><i class="${icon}"></i> ${title}</h3>
            ${content}
        </div>
    `;
}

function formatObject(obj, level = 0) {
    let html = '';
    const indent = level * 20;
    
    for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            html += `<div style="margin-left: ${indent}px; margin-bottom: 15px;">`;
            html += `<h5 style="color: var(--text-primary); margin-bottom: 8px;">${formatKey(key)}</h5>`;
            html += formatObject(value, level + 1);
            html += `</div>`;
        } else if (Array.isArray(value)) {
            html += `<div style="margin-left: ${indent}px; margin-bottom: 15px;">`;
            html += `<strong>${formatKey(key)}:</strong>`;
            html += `<ul style="margin: 8px 0 0 20px;">`;
            value.forEach(item => {
                html += `<li style="color: var(--text-secondary);">${item}</li>`;
            });
            html += `</ul></div>`;
        } else if (value) {
            html += `<p style="margin-left: ${indent}px;"><strong>${formatKey(key)}:</strong> ${value}</p>`;
        }
    }
    
    return html;
}

function formatKey(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}

function showAnalysisError(error) {
    const loadingSection = document.getElementById('loadingSection');
    const formSection = document.querySelector('.form-section');
    
    if (loadingSection) loadingSection.style.display = 'none';
    if (formSection) formSection.style.display = 'block';
    
    showNotification(`Erro na análise: ${error.message || 'Erro desconhecido'}`, 'error');
    
    AppState.isAnalyzing = false;
}

/**
 * Funcionalidades auxiliares
 */
function generatePDF() {
    if (!AppState.currentAnalysis) {
        showNotification('Nenhuma análise disponível para gerar PDF', 'warning');
        return;
    }
    
    showNotification('Gerando PDF...', 'info');
    
    fetch(`${CONFIG.apiBaseUrl}/generate_pdf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            report_content: AppState.currentAnalysis
        })
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error('Erro ao gerar PDF');
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analise_arqv30_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification('PDF gerado com sucesso!', 'success');
    })
    .catch(error => {
        console.error('❌ Erro ao gerar PDF:', error);
        showNotification('Erro ao gerar PDF', 'error');
    });
}

function resetForm() {
    // Limpar estado
    AppState.attachments = [];
    AppState.currentAnalysis = null;
    AppState.sessionId = generateSessionId();
    AppState.isAnalyzing = false;
    
    if (AppState.progressInterval) {
        clearTimeout(AppState.progressInterval);
    }
    
    // Resetar interface
    const resultsSection = document.getElementById('resultsSection');
    const formSection = document.querySelector('.form-section');
    const loadingSection = document.getElementById('loadingSection');
    const form = document.getElementById('analysisForm');
    const attachmentList = document.getElementById('attachmentList');
    
    if (resultsSection) resultsSection.style.display = 'none';
    if (loadingSection) loadingSection.style.display = 'none';
    if (formSection) formSection.style.display = 'block';
    if (form) form.reset();
    if (attachmentList) attachmentList.innerHTML = '';
    
    // Limpar erros
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.form-control').forEach(field => {
        field.style.borderColor = '';
    });
    
    showNotification('Formulário resetado', 'info');
}

/**
 * Sistema de notificações
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2rem;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    // Cores por tipo
    const colors = {
        success: '#34a853',
        error: '#ea4335',
        warning: '#f59e0b',
        info: '#4285f4'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        case 'info': return 'fas fa-info-circle';
        default: return 'fas fa-bell';
    }
}

/**
 * Auto-save do formulário
 */
function initializeAutoSave() {
    const form = document.getElementById('analysisForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 1000));
    });
    
    // Carregar dados salvos
    loadFormData();
}

function saveFormData() {
    const form = document.getElementById('analysisForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('arqv30_form_data', JSON.stringify(data));
    console.log('💾 Dados do formulário salvos automaticamente');
}

function loadFormData() {
    try {
        const savedData = localStorage.getItem('arqv30_form_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            for (const [key, value] of Object.entries(data)) {
                const field = document.querySelector(`[name="${key}"]`);
                if (field && value) {
                    field.value = value;
                }
            }
            
            console.log('📂 Dados do formulário carregados');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados salvos:', error);
    }
}

/**
 * Tooltips e ajuda
 */
function initializeTooltips() {
    // Adicionar tooltips aos campos
    const tooltips = {
        'segmento': 'Defina o segmento de mercado principal do seu produto ou serviço',
        'query': 'Descreva o que você quer pesquisar na internet para enriquecer a análise',
        'uploadArea': 'Envie arquivos com drivers mentais, provas visuais, perfis psicológicos ou dados de pesquisa'
    };
    
    for (const [id, text] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.title = text;
        }
    }
}

/**
 * Utilitários
 */
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .progress-step {
        padding: 8px 0;
        color: var(--text-muted);
        font-size: 0.9rem;
        transition: var(--neo-transition);
    }
    
    .progress-step.completed {
        color: var(--brand-secondary);
        font-weight: 500;
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Exportar funções globais
window.generatePDF = generatePDF;
window.resetForm = resetForm;
window.removeAttachment = removeAttachment;