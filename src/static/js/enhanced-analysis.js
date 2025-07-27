/**
 * ARQV30 Enhanced v2.0 - JavaScript Ultra-Moderno
 * Sistema completo de análise com barra de progresso precisa e interface avançada
 */

// Estado global da aplicação
const AppState = {
    sessionId: generateSessionId(),
    attachments: [],
    currentAnalysis: null,
    isAnalyzing: false,
    progressInterval: null,
    startTime: null,
    currentStep: 0,
    totalSteps: 6
};

// Configurações avançadas
const CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedExtensions: ['pdf', 'doc', 'docx', 'txt', 'json', 'csv', 'xlsx', 'xls'],
    apiBaseUrl: '/api',
    progressSteps: [
        { 
            name: 'Processando dados do formulário', 
            duration: 3000,
            description: 'Validando e estruturando informações fornecidas'
        },
        { 
            name: 'Analisando anexos enviados', 
            duration: 4000,
            description: 'Extraindo conteúdo e classificando documentos'
        },
        { 
            name: 'Realizando busca profunda na internet', 
            duration: 8000,
            description: 'Coletando dados atualizados do mercado'
        },
        { 
            name: 'Executando análise com Gemini Pro 1.5', 
            duration: 18000,
            description: 'Processando com inteligência artificial avançada'
        },
        { 
            name: 'Consolidando insights e resultados', 
            duration: 6000,
            description: 'Estruturando análise ultra-detalhada'
        },
        { 
            name: 'Finalizando análise completa', 
            duration: 3000,
            description: 'Preparando relatório final'
        }
    ],
    notifications: {
        duration: 5000,
        maxVisible: 3
    }
};

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando ARQV30 Enhanced v2.0');
    initializeApp();
});

function initializeApp() {
    try {
        // Verificar status do sistema
        checkSystemStatus();
        
        // Inicializar componentes
        initializeFileUpload();
        initializeForm();
        initializeTooltips();
        initializeKeyboardShortcuts();
        
        // Auto-save do formulário
        initializeAutoSave();
        
        // Inicializar animações
        initializeAnimations();
        
        console.log('✅ ARQV30 Enhanced v2.0 inicializado com sucesso');
        
        // Mostrar notificação de boas-vindas
        showNotification('🚀 ARQV30 Enhanced v2.0 carregado com sucesso!', 'success');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showNotification('Erro na inicialização do sistema', 'error');
    }
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
            updateStatusIndicator({ 
                status: 'error', 
                message: 'Erro de conexão com o servidor' 
            });
        });
}

function updateStatusIndicator(data) {
    const statusText = document.getElementById('status-text');
    const statusDot = document.querySelector('.status-dot');
    const versionInfo = document.getElementById('version-info');
    
    if (statusText) {
        if (data.status === 'running') {
            statusText.textContent = 'Sistema Online - Todos os Serviços Ativos';
            statusText.style.color = 'var(--brand-secondary)';
            if (statusDot) {
                statusDot.style.background = 'var(--brand-secondary)';
                statusDot.style.boxShadow = '0 0 20px var(--brand-secondary)';
            }
        } else {
            statusText.textContent = data.message || 'Sistema com Problemas';
            statusText.style.color = 'var(--brand-accent)';
            if (statusDot) {
                statusDot.style.background = 'var(--brand-accent)';
                statusDot.style.boxShadow = '0 0 20px var(--brand-accent)';
            }
        }
    }
    
    if (versionInfo) {
        versionInfo.textContent = `v${data.version || '2.0.0'}`;
    }
}

function logSystemInfo(data) {
    console.log('📊 Status do Sistema ARQV30 Enhanced:', data);
    
    if (data.services) {
        console.log('🤖 Gemini Pro 1.5:', data.services.gemini?.available ? '✅ Ativo' : '❌ Inativo');
        console.log('🚢 WebSailor:', data.services.websailor?.available ? '✅ Ativo' : '❌ Inativo');
        console.log('🔍 Deep Search:', data.services.deep_search?.available ? '✅ Ativo' : '❌ Inativo');
        console.log('📎 Attachments:', data.services.attachments?.available ? '✅ Ativo' : '❌ Inativo');
    }
}

/**
 * Sistema avançado de upload de arquivos
 */
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Click para selecionar arquivos
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop avançado
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Seleção de arquivos
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    
    // Paste de arquivos
    document.addEventListener('paste', handlePaste);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
    e.currentTarget.style.transform = 'scale(1.02)';
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
    e.currentTarget.style.transform = 'scale(1)';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    e.currentTarget.style.transform = 'scale(1)';
    
    const files = e.dataTransfer.files;
    handleFiles(files);
    
    // Animação de sucesso
    e.currentTarget.style.borderColor = 'var(--brand-secondary)';
    setTimeout(() => {
        e.currentTarget.style.borderColor = '';
    }, 1000);
}

function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    const files = [];
    for (let item of items) {
        if (item.kind === 'file') {
            files.push(item.getAsFile());
        }
    }
    
    if (files.length > 0) {
        handleFiles(files);
        showNotification(`${files.length} arquivo(s) colado(s) com sucesso`, 'success');
    }
}

function handleFiles(files) {
    console.log(`📁 Processando ${files.length} arquivo(s)`);
    
    if (files.length > 5) {
        showNotification('Máximo de 5 arquivos por vez', 'warning');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (validateFile(file)) {
            uploadFile(file);
        }
    });
}

function validateFile(file) {
    // Verificar tamanho
    if (file.size > CONFIG.maxFileSize) {
        showNotification(`"${file.name}" é muito grande. Máximo: 10MB`, 'error');
        return false;
    }
    
    // Verificar extensão
    const extension = file.name.split('.').pop().toLowerCase();
    if (!CONFIG.allowedExtensions.includes(extension)) {
        showNotification(`Tipo "${extension}" não suportado`, 'error');
        return false;
    }
    
    // Verificar se já existe
    const exists = AppState.attachments.some(att => att.filename === file.name);
    if (exists) {
        showNotification(`"${file.name}" já foi enviado`, 'warning');
        return false;
    }
    
    return true;
}

function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', AppState.sessionId);
    
    // Gerar ID único para o anexo
    const attachmentId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Mostrar progresso
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
                preview: data.content_preview,
                size: file.size
            });
            showNotification(`📎 "${file.name}" processado com sucesso`, 'success');
        } else {
            updateAttachmentStatus(attachmentId, 'error', data);
            showNotification(`❌ Erro em "${file.name}": ${data.error}`, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Erro no upload:', error);
        updateAttachmentStatus(attachmentId, 'error', { error: error.message });
        showNotification(`❌ Erro no upload de "${file.name}"`, 'error');
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
            <div class="attachment-icon">
                <i class="${fileIcon}"></i>
            </div>
            <div>
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                    ${file.name}
                </div>
                <div style="font-size: 0.875rem; color: var(--text-muted);">
                    ${formatFileSize(file.size)} • ${getStatusText(status)}
                </div>
            </div>
        </div>
        <div class="attachment-status">
            <i class="${statusIcon}" style="margin-right: 12px; font-size: 1.2rem;"></i>
            <button class="remove-attachment" onclick="removeAttachment('${attachmentId}')" title="Remover anexo">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Animação de entrada
    attachmentItem.style.opacity = '0';
    attachmentItem.style.transform = 'translateY(20px)';
    attachmentList.appendChild(attachmentItem);
    
    // Trigger animation
    requestAnimationFrame(() => {
        attachmentItem.style.transition = 'all 0.3s ease-out';
        attachmentItem.style.opacity = '1';
        attachmentItem.style.transform = 'translateY(0)';
    });
}

function updateAttachmentStatus(attachmentId, status, data) {
    const attachmentItem = document.getElementById(`attachment-${attachmentId}`);
    if (!attachmentItem) return;
    
    const statusIcon = getStatusIcon(status);
    const statusElement = attachmentItem.querySelector('.attachment-status i');
    const infoElement = attachmentItem.querySelector('.attachment-info div div:last-child');
    
    if (statusElement) {
        statusElement.className = statusIcon;
        
        // Animação de mudança de status
        statusElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            statusElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (infoElement) {
        const sizeText = infoElement.textContent.split(' • ')[0];
        let statusText = getStatusText(status);
        
        if (status === 'success' && data.content_type) {
            statusText = `${data.content_type} • Processado`;
        } else if (status === 'error') {
            statusText = `Erro: ${data.error || 'Falha no upload'}`;
        }
        
        infoElement.innerHTML = `${sizeText} • ${statusText}`;
    }
    
    // Atualizar cor do item baseado no status
    if (status === 'success') {
        attachmentItem.style.borderLeft = '4px solid var(--brand-secondary)';
    } else if (status === 'error') {
        attachmentItem.style.borderLeft = '4px solid var(--brand-accent)';
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'uploading': return 'fas fa-spinner fa-spin text-info';
        case 'success': return 'fas fa-check-circle text-success';
        case 'error': return 'fas fa-exclamation-circle text-error';
        default: return 'fas fa-file';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'uploading': return 'Processando...';
        case 'success': return 'Pronto';
        case 'error': return 'Erro';
        default: return 'Aguardando';
    }
}

function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    const iconMap = {
        'pdf': 'fas fa-file-pdf',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'txt': 'fas fa-file-alt',
        'json': 'fas fa-file-code',
        'csv': 'fas fa-file-excel',
        'xlsx': 'fas fa-file-excel',
        'xls': 'fas fa-file-excel'
    };
    
    return iconMap[extension] || 'fas fa-file';
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
        // Animação de saída
        attachmentItem.style.transition = 'all 0.3s ease-in';
        attachmentItem.style.opacity = '0';
        attachmentItem.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            attachmentItem.remove();
        }, 300);
    }
    
    // Remover do estado
    AppState.attachments = AppState.attachments.filter(att => att.id !== attachmentId);
    
    showNotification('📎 Anexo removido', 'info');
}

/**
 * Sistema avançado de formulário
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
    
    // Contador de caracteres para textareas
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        addCharacterCounter(textarea);
    });
    
    // Auto-resize para textareas
    textareas.forEach(textarea => {
        textarea.addEventListener('input', autoResizeTextarea);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (AppState.isAnalyzing) {
        showNotification('⏳ Análise já em andamento', 'warning');
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
    let isValid = true;
    
    // Verificar campos obrigatórios
    const segmento = formData.get('segmento');
    if (!segmento || segmento.trim().length < 3) {
        showFieldError(
            document.getElementById('segmento'), 
            'Segmento de mercado é obrigatório (mínimo 3 caracteres)'
        );
        isValid = false;
    }
    
    // Validações adicionais
    const preco = formData.get('preco');
    if (preco && (isNaN(preco) || parseFloat(preco) < 0)) {
        showFieldError(
            document.getElementById('preco'), 
            'Preço deve ser um número válido'
        );
        isValid = false;
    }
    
    const objetivoReceita = formData.get('objetivoReceita');
    if (objetivoReceita && (isNaN(objetivoReceita) || parseFloat(objetivoReceita) < 0)) {
        showFieldError(
            document.getElementById('objetivoReceita'), 
            'Objetivo de receita deve ser um número válido'
        );
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('❌ Por favor, corrija os erros no formulário', 'error');
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    // Validações específicas por tipo
    if (field.type === 'number' && value && (isNaN(value) || parseFloat(value) < 0)) {
        showFieldError(field, 'Deve ser um número válido');
        return false;
    }
    
    if (field.id === 'segmento' && value && value.length < 3) {
        showFieldError(field, 'Mínimo de 3 caracteres');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--brand-accent)';
    field.style.boxShadow = '0 0 0 3px rgba(234, 67, 53, 0.2)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: var(--brand-accent);
        font-size: 0.875rem;
        margin-top: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        animation: slideDown 0.3s ease-out;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
    
    // Focus no campo com erro
    field.focus();
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => errorDiv.remove(), 300);
    }
}

function addCharacterCounter(textarea) {
    const maxLength = textarea.getAttribute('maxlength');
    if (!maxLength) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        font-size: 0.75rem;
        color: var(--text-muted);
        text-align: right;
        margin-top: 4px;
    `;
    
    const updateCounter = () => {
        const current = textarea.value.length;
        const max = parseInt(maxLength);
        counter.textContent = `${current}/${max}`;
        
        if (current > max * 0.9) {
            counter.style.color = 'var(--brand-accent)';
        } else if (current > max * 0.7) {
            counter.style.color = 'var(--brand-warning)';
        } else {
            counter.style.color = 'var(--text-muted)';
        }
    };
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentNode.appendChild(counter);
    updateCounter();
}

function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

/**
 * Sistema de análise com barra de progresso ultra-precisa
 */
function startAnalysis() {
    console.log('🔍 Iniciando análise ultra-detalhada com ARQV30 Enhanced v2.0');
    
    AppState.isAnalyzing = true;
    AppState.startTime = Date.now();
    AppState.currentStep = 0;
    
    // Coletar dados do formulário
    const formData = collectFormData();
    
    // Mostrar loading com progresso avançado
    showLoadingScreen();
    
    // Iniciar progresso ultra-preciso
    startAdvancedProgressSimulation();
    
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
    
    console.log('📋 Dados coletados para análise:', data);
    return data;
}

function showLoadingScreen() {
    const formSection = document.querySelector('.form-section');
    const loadingSection = document.getElementById('loadingSection');
    
    if (formSection) {
        formSection.style.transition = 'all 0.5s ease-out';
        formSection.style.opacity = '0';
        formSection.style.transform = 'translateY(-20px)';
        setTimeout(() => formSection.style.display = 'none', 500);
    }
    
    if (loadingSection) {
        loadingSection.style.display = 'block';
        loadingSection.style.opacity = '0';
        setTimeout(() => {
            loadingSection.style.transition = 'all 0.5s ease-out';
            loadingSection.style.opacity = '1';
        }, 100);
    }
    
    // Criar estrutura de progresso avançada
    createAdvancedProgressStructure();
}

function createAdvancedProgressStructure() {
    const loadingSection = document.getElementById('loadingSection');
    if (!loadingSection) return;
    
    const totalDuration = CONFIG.progressSteps.reduce((sum, step) => sum + step.duration, 0);
    const totalMinutes = Math.ceil(totalDuration / 60000);
    const totalSeconds = Math.ceil((totalDuration % 60000) / 1000);
    
    loadingSection.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <h3>🤖 Processando Análise Ultra-Detalhada</h3>
            <p id="loadingStatus">Iniciando análise com Gemini Pro 1.5...</p>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;">
                Tempo estimado: ~${totalMinutes > 0 ? totalMinutes + 'min ' : ''}${totalSeconds}s
            </p>
            
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressBar" style="width: 0%"></div>
                </div>
                <div class="progress-info">
                    <span class="progress-percentage" id="progressPercentage">0%</span>
                    <span class="progress-eta" id="progressETA">Calculando tempo...</span>
                </div>
            </div>
            
            <div id="progressSteps" style="margin-top: 24px;">
                ${CONFIG.progressSteps.map((step, index) => `
                    <div class="progress-step" id="step-${index}">
                        ⏳ ${step.name}
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                            ${step.description}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function startAdvancedProgressSimulation() {
    let currentProgress = 0;
    const totalDuration = CONFIG.progressSteps.reduce((sum, step) => sum + step.duration, 0);
    
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressETA = document.getElementById('progressETA');
    const loadingStatus = document.getElementById('loadingStatus');
    
    function updateProgressStep() {
        if (AppState.currentStep < CONFIG.progressSteps.length && AppState.isAnalyzing) {
            const step = CONFIG.progressSteps[AppState.currentStep];
            const stepProgress = ((AppState.currentStep + 1) / CONFIG.progressSteps.length) * 100;
            
            // Atualizar barra de progresso com animação suave
            if (progressBar) {
                progressBar.style.width = `${stepProgress}%`;
            }
            if (progressPercentage) {
                progressPercentage.textContent = `${Math.round(stepProgress)}%`;
            }
            
            // Calcular ETA preciso
            const elapsed = Date.now() - AppState.startTime;
            const estimatedTotal = (elapsed / stepProgress) * 100;
            const remaining = Math.max(0, estimatedTotal - elapsed);
            const etaMinutes = Math.floor(remaining / 60000);
            const etaSeconds = Math.ceil((remaining % 60000) / 1000);
            
            if (progressETA) {
                if (etaMinutes > 0) {
                    progressETA.textContent = `~${etaMinutes}min ${etaSeconds}s restantes`;
                } else {
                    progressETA.textContent = `~${etaSeconds}s restantes`;
                }
            }
            
            // Atualizar status principal
            if (loadingStatus) {
                loadingStatus.textContent = step.name;
            }
            
            // Atualizar step visual
            const stepElement = document.getElementById(`step-${AppState.currentStep}`);
            if (stepElement) {
                stepElement.classList.add('completed');
                stepElement.innerHTML = `
                    ✅ ${step.name}
                    <div style="font-size: 0.8rem; color: var(--brand-secondary); margin-top: 2px; font-weight: 500;">
                        ${step.description} - Concluído
                    </div>
                `;
            }
            
            AppState.currentStep++;
            
            // Próximo step
            if (AppState.currentStep < CONFIG.progressSteps.length) {
                AppState.progressInterval = setTimeout(updateProgressStep, step.duration);
            }
        }
    }
    
    // Iniciar progresso
    updateProgressStep();
}

function performAnalysis(data) {
    fetch(`${CONFIG.apiBaseUrl}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('✅ Análise concluída com sucesso:', result);
        AppState.currentAnalysis = result;
        
        // Finalizar progresso
        finishProgress();
        
        // Mostrar resultados após animação
        setTimeout(() => {
            showResults(result);
        }, 1500);
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
    
    // Completar progresso
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    if (progressPercentage) {
        progressPercentage.textContent = '100%';
    }
    if (progressETA) {
        progressETA.textContent = 'Concluído!';
        progressETA.style.color = 'var(--brand-secondary)';
    }
    if (loadingStatus) {
        loadingStatus.textContent = '🎉 Análise ultra-detalhada concluída com sucesso!';
        loadingStatus.style.color = 'var(--brand-secondary)';
        loadingStatus.style.fontWeight = '600';
    }
    
    // Marcar todos os steps como concluídos
    CONFIG.progressSteps.forEach((step, index) => {
        const stepElement = document.getElementById(`step-${index}`);
        if (stepElement) {
            stepElement.classList.add('completed');
            stepElement.innerHTML = `
                ✅ ${step.name}
                <div style="font-size: 0.8rem; color: var(--brand-secondary); margin-top: 2px; font-weight: 500;">
                    ${step.description} - Concluído
                </div>
            `;
        }
    });
}

function showResults(result) {
    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    
    // Transição suave
    if (loadingSection) {
        loadingSection.style.transition = 'all 0.5s ease-in';
        loadingSection.style.opacity = '0';
        loadingSection.style.transform = 'translateY(-20px)';
        setTimeout(() => loadingSection.style.display = 'none', 500);
    }
    
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.style.opacity = '0';
        resultsSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultsSection.style.transition = 'all 0.6s ease-out';
            resultsSection.style.opacity = '1';
            resultsSection.style.transform = 'translateY(0)';
        }, 100);
    }
    
    const resultsContainer = document.getElementById('analysisResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = formatAnalysisResults(result);
    }
    
    // Scroll suave para os resultados
    setTimeout(() => {
        if (resultsSection) {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 700);
    
    showNotification('🎉 Análise ultra-detalhada concluída com sucesso!', 'success');
}

function formatAnalysisResults(result) {
    let html = '';
    
    // Header dos resultados
    html += `
        <div class="result-card" style="background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1)); border-left: 4px solid var(--brand-primary); margin-bottom: 32px;">
            <h3><i class="fas fa-chart-pie"></i> Análise Ultra-Detalhada Concluída</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px;">
                ${result.search_context_used ? '<div class="feature-item"><i class="fas fa-search"></i> Busca Profunda Realizada</div>' : ''}
                ${result.websailor_used ? '<div class="feature-item"><i class="fas fa-ship"></i> WebSailor Utilizado</div>' : ''}
                ${result.attachments_used ? '<div class="feature-item"><i class="fas fa-paperclip"></i> Anexos Analisados</div>' : ''}
                <div class="feature-item"><i class="fas fa-robot"></i> Gemini Pro 1.5</div>
            </div>
        </div>
    `;
    
    // Avatar Ultra-Detalhado
    if (result.avatar_ultra_detalhado) {
        html += formatAvatarSection(result.avatar_ultra_detalhado);
    }
    
    // Escopo e Posicionamento
    if (result.escopo) {
        html += formatSection('Escopo e Posicionamento de Mercado', result.escopo, 'fas fa-bullseye');
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
                        <div style="font-size: 1rem; color: var(--text-primary); font-weight: 500; margin-top: 8px;">
                            ${value}
                        </div>
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
                html += `
                    <div style="background: var(--neo-bg-dark); padding: 16px; border-radius: var(--neo-border-radius-small); margin-bottom: 12px; border-left: 4px solid var(--brand-primary);">
                        <strong style="color: var(--brand-primary);">${formatKey(key)}:</strong>
                        <p style="margin: 8px 0 0 0; color: var(--text-secondary);">${value}</p>
                    </div>
                `;
            }
        });
    }
    
    // Dores Específicas
    if (avatarData.dores_especificas && Array.isArray(avatarData.dores_especificas)) {
        html += `<h4>💔 Dores Específicas</h4>`;
        html += `<div style="display: flex; flex-direction: column; gap: 12px;">`;
        avatarData.dores_especificas.forEach((dor, index) => {
            html += `
                <div style="background: var(--neo-bg-dark); padding: 16px; border-radius: var(--neo-border-radius-small); border-left: 4px solid var(--brand-accent);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="background: var(--brand-accent); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;">
                            ${index + 1}
                        </span>
                        <strong style="color: var(--brand-accent);">Dor Crítica</strong>
                    </div>
                    <p style="margin: 0; color: var(--text-secondary); line-height: 1.5;">${dor}</p>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // Desejos Profundos
    if (avatarData.desejos_profundos && Array.isArray(avatarData.desejos_profundos)) {
        html += `<h4>✨ Desejos Profundos</h4>`;
        html += `<div style="display: flex; flex-direction: column; gap: 12px;">`;
        avatarData.desejos_profundos.forEach((desejo, index) => {
            html += `
                <div style="background: var(--neo-bg-dark); padding: 16px; border-radius: var(--neo-border-radius-small); border-left: 4px solid var(--brand-secondary);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="background: var(--brand-secondary); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;">
                            ${index + 1}
                        </span>
                        <strong style="color: var(--brand-secondary);">Desejo Profundo</strong>
                    </div>
                    <p style="margin: 0; color: var(--text-secondary); line-height: 1.5;">${desejo}</p>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // Gatilhos Mentais
    if (avatarData.gatilhos_mentais && Array.isArray(avatarData.gatilhos_mentais)) {
        html += `<h4>🎯 Gatilhos Mentais</h4>`;
        html += `<div style="display: flex; flex-direction: column; gap: 12px;">`;
        avatarData.gatilhos_mentais.forEach((gatilho, index) => {
            html += `
                <div style="background: var(--neo-bg-dark); padding: 16px; border-radius: var(--neo-border-radius-small); border-left: 4px solid var(--brand-warning);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="background: var(--brand-warning); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;">
                            ${index + 1}
                        </span>
                        <strong style="color: var(--brand-warning);">Gatilho Mental</strong>
                    </div>
                    <p style="margin: 0; color: var(--text-secondary); line-height: 1.5;">${gatilho}</p>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}

function formatCompetitionSection(competitionData) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-chess"></i> Análise de Concorrência Detalhada</h3>
    `;
    
    // Concorrentes Diretos
    if (competitionData.concorrentes_diretos && Array.isArray(competitionData.concorrentes_diretos)) {
        html += `<h4>🎯 Concorrentes Diretos</h4>`;
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">`;
        
        competitionData.concorrentes_diretos.forEach((concorrente, index) => {
            if (typeof concorrente === 'object') {
                html += `
                    <div style="background: var(--neo-bg-dark); padding: 20px; border-radius: var(--neo-border-radius); border-left: 4px solid var(--brand-accent);">
                        <h5 style="color: var(--brand-accent); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-building"></i>
                            ${concorrente.nome || `Concorrente ${index + 1}`}
                        </h5>
                        ${concorrente.preco_range ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: var(--text-primary);">Preço:</strong> 
                                <span style="color: var(--text-secondary);">${concorrente.preco_range}</span>
                            </div>
                        ` : ''}
                        ${concorrente.posicionamento ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: var(--text-primary);">Posicionamento:</strong> 
                                <span style="color: var(--text-secondary);">${concorrente.posicionamento}</span>
                            </div>
                        ` : ''}
                        ${concorrente.pontos_fortes ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: var(--brand-secondary);">Pontos Fortes:</strong> 
                                <span style="color: var(--text-secondary);">${concorrente.pontos_fortes}</span>
                            </div>
                        ` : ''}
                        ${concorrente.pontos_fracos ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: var(--brand-accent);">Pontos Fracos:</strong> 
                                <span style="color: var(--text-secondary);">${concorrente.pontos_fracos}</span>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    }
    
    // Gaps de Mercado
    if (competitionData.gaps_mercado && Array.isArray(competitionData.gaps_mercado)) {
        html += `<h4>🔍 Oportunidades de Mercado</h4>`;
        html += `<div style="display: flex; flex-direction: column; gap: 12px;">`;
        competitionData.gaps_mercado.forEach((gap, index) => {
            html += `
                <div style="background: var(--neo-bg-dark); padding: 16px; border-radius: var(--neo-border-radius-small); border-left: 4px solid var(--brand-secondary);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="background: var(--brand-secondary); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;">
                            ${index + 1}
                        </span>
                        <strong style="color: var(--brand-secondary);">Oportunidade</strong>
                    </div>
                    <p style="margin: 0; color: var(--text-secondary); line-height: 1.5;">${gap}</p>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}

function formatMarketingSection(marketingData) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-megaphone"></i> Estratégia de Marketing Digital</h3>
    `;
    
    // Palavras-chave Primárias
    if (marketingData.palavras_chave_primarias && Array.isArray(marketingData.palavras_chave_primarias)) {
        html += `<h4>🔑 Palavras-Chave Primárias</h4>`;
        html += `<div style="overflow-x: auto; margin-bottom: 24px;">`;
        html += `
            <table style="width: 100%; border-collapse: collapse; background: var(--neo-bg-dark); border-radius: var(--neo-border-radius);">
                <thead>
                    <tr style="background: var(--neo-bg-elevated);">
                        <th style="padding: 16px; text-align: left; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1);">Termo</th>
                        <th style="padding: 16px; text-align: left; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1);">Volume</th>
                        <th style="padding: 16px; text-align: left; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1);">Dificuldade</th>
                        <th style="padding: 16px; text-align: left; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1);">CPC</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        marketingData.palavras_chave_primarias.forEach((palavra, index) => {
            if (typeof palavra === 'object') {
                const difficultyColor = palavra.dificuldade === 'Alta' ? 'var(--brand-accent)' : 
                                      palavra.dificuldade === 'Média' ? 'var(--brand-warning)' : 'var(--brand-secondary)';
                
                html += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 16px; color: var(--text-primary); font-weight: 500;">${palavra.termo || 'N/A'}</td>
                        <td style="padding: 16px; color: var(--text-secondary);">${palavra.volume_mensal || 'N/A'}</td>
                        <td style="padding: 16px;">
                            <span style="color: ${difficultyColor}; font-weight: 500;">
                                ${palavra.dificuldade || 'N/A'}
                            </span>
                        </td>
                        <td style="padding: 16px; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">
                            ${palavra.cpc_estimado || 'N/A'}
                        </td>
                    </tr>
                `;
            }
        });
        
        html += `</tbody></table></div>`;
    }
    
    // Canais de Marketing
    if (marketingData.canais_marketing) {
        html += `<h4>📢 Canais de Marketing Recomendados</h4>`;
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">`;
        
        Object.entries(marketingData.canais_marketing).forEach(([canal, dados]) => {
            if (typeof dados === 'object') {
                const canalIcons = {
                    'google_ads': 'fab fa-google',
                    'facebook_ads': 'fab fa-facebook',
                    'seo': 'fas fa-search',
                    'content_marketing': 'fas fa-pen-fancy'
                };
                
                html += `
                    <div style="background: var(--neo-bg-dark); padding: 20px; border-radius: var(--neo-border-radius); border-left: 4px solid var(--brand-primary);">
                        <h5 style="color: var(--brand-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <i class="${canalIcons[canal] || 'fas fa-bullhorn'}"></i>
                            ${formatKey(canal)}
                        </h5>
                        ${dados.estrategia ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: var(--text-primary);">Estratégia:</strong>
                                <p style="margin: 4px 0 0 0; color: var(--text-secondary); line-height: 1.5;">${dados.estrategia}</p>
                            </div>
                        ` : ''}
                        ${dados.orcamento_sugerido ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: var(--text-primary);">Orçamento:</strong> 
                                <span style="color: var(--brand-secondary); font-family: 'JetBrains Mono', monospace; font-weight: 600;">
                                    ${dados.orcamento_sugerido}
                                </span>
                            </div>
                        ` : ''}
                        ${dados.cpc_medio ? `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: var(--text-primary);">CPC Médio:</strong> 
                                <span style="color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">
                                    ${dados.cpc_medio}
                                </span>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}

function formatMetricsSection(metricsData) {
    let html = `
        <div class="result-card">
            <h3><i class="fas fa-chart-bar"></i> Métricas de Performance Detalhadas</h3>
    `;
    
    // KPIs Principais
    if (metricsData.kpis_principais) {
        html += `<h4>📊 KPIs Principais</h4>`;
        html += `<div class="metrics-grid">`;
        
        Object.entries(metricsData.kpis_principais).forEach(([key, value]) => {
            if (value && key !== 'resumo') {
                const kpiIcons = {
                    'cac': 'fas fa-dollar-sign',
                    'ltv': 'fas fa-chart-line',
                    'roi': 'fas fa-percentage',
                    'taxa_conversao': 'fas fa-funnel-dollar',
                    'ticket_medio': 'fas fa-receipt',
                    'payback': 'fas fa-clock'
                };
                
                html += `
                    <div class="metric-item">
                        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                            <i class="${kpiIcons[key] || 'fas fa-chart-bar'}" style="font-size: 1.5rem; color: var(--brand-primary);"></i>
                        </div>
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
    
    // Benchmarks do Segmento
    if (metricsData.benchmarks_segmento) {
        html += `<h4>🎯 Benchmarks do Segmento</h4>`;
        html += `<div style="background: var(--neo-bg-dark); padding: 20px; border-radius: var(--neo-border-radius); border-left: 4px solid var(--brand-secondary);">`;
        
        Object.entries(metricsData.benchmarks_segmento).forEach(([key, value]) => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: var(--text-primary); font-weight: 500;">${formatKey(key)}:</span>
                    <span style="color: var(--brand-secondary); font-weight: 600; font-family: 'JetBrains Mono', monospace;">${value}</span>
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
            <h3><i class="fas fa-chart-line"></i> Projeções e Cenários Financeiros</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-top: 24px;">
    `;
    
    const scenarios = ['cenario_conservador', 'cenario_realista', 'cenario_otimista'];
    const scenarioNames = ['🔴 Conservador', '🟡 Realista', '🟢 Otimista'];
    const scenarioColors = ['var(--brand-accent)', 'var(--brand-warning)', 'var(--brand-secondary)'];
    const scenarioDescriptions = [
        'Cenário mais cauteloso com premissas conservadoras',
        'Cenário mais provável baseado em dados históricos',
        'Cenário otimista com condições favoráveis'
    ];
    
    scenarios.forEach((scenario, index) => {
        if (scenariosData[scenario]) {
            const data = scenariosData[scenario];
            html += `
                <div style="background: var(--neo-bg-dark); padding: 24px; border-radius: var(--neo-border-radius); border-left: 4px solid ${scenarioColors[index]}; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; right: 0; width: 60px; height: 60px; background: ${scenarioColors[index]}; opacity: 0.1; border-radius: 0 0 0 60px;"></div>
                    
                    <h4 style="color: ${scenarioColors[index]}; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; font-size: 1.2rem;">
                        ${scenarioNames[index]}
                    </h4>
                    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 16px; line-height: 1.4;">
                        ${scenarioDescriptions[index]}
                    </p>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${data.vendas_mensais ? `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-secondary);">Vendas Mensais:</span>
                                <span style="color: var(--text-primary); font-weight: 600; font-family: 'JetBrains Mono', monospace;">${data.vendas_mensais}</span>
                            </div>
                        ` : ''}
                        ${data.receita_mensal ? `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-secondary);">Receita Mensal:</span>
                                <span style="color: ${scenarioColors[index]}; font-weight: 700; font-family: 'JetBrains Mono', monospace;">${data.receita_mensal}</span>
                            </div>
                        ` : ''}
                        ${data.receita_anual ? `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-secondary);">Receita Anual:</span>
                                <span style="color: ${scenarioColors[index]}; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 1.1rem;">${data.receita_anual}</span>
                            </div>
                        ` : ''}
                        ${data.margem_lucro ? `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-secondary);">Margem de Lucro:</span>
                                <span style="color: var(--text-primary); font-weight: 600; font-family: 'JetBrains Mono', monospace;">${data.margem_lucro}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${data.premissas && Array.isArray(data.premissas) ? `
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <strong style="color: var(--text-primary); font-size: 0.9rem;">Premissas:</strong>
                            <ul style="margin: 8px 0 0 16px; padding: 0;">
                                ${data.premissas.map(premissa => `
                                    <li style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 4px; line-height: 1.4;">
                                        ${premissa}
                                    </li>
                                `).join('')}
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
    const phaseColors = ['var(--brand-primary)', 'var(--brand-accent)', 'var(--brand-secondary)'];
    
    phases.forEach((phase, index) => {
        if (actionPlan[phase]) {
            const phaseData = actionPlan[phase];
            html += `
                <div style="background: var(--neo-bg-dark); padding: 24px; border-radius: var(--neo-border-radius); margin-bottom: 20px; border-left: 4px solid ${phaseColors[index]}; position: relative;">
                    <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: ${phaseColors[index]}; opacity: 0.05; border-radius: 0 0 0 80px;"></div>
                    
                    <h4 style="color: ${phaseColors[index]}; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; font-size: 1.3rem;">
                        <div style="width: 40px; height: 40px; background: ${phaseColors[index]}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="${phaseIcons[index]}"></i>
                        </div>
                        ${phaseNames[index]}
                    </h4>
                    
                    ${phaseData.duracao ? `
                        <div style="margin-bottom: 16px;">
                            <span style="background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 12px; font-size: 0.875rem; color: var(--text-primary); font-weight: 500;">
                                <i class="fas fa-clock" style="margin-right: 6px;"></i>
                                Duração: ${phaseData.duracao}
                            </span>
                        </div>
                    ` : ''}
                    
                    ${phaseData.acoes && Array.isArray(phaseData.acoes) ? `
                        <div style="margin-top: 16px;">
                            <strong style="color: var(--text-primary); margin-bottom: 12px; display: block;">Ações Detalhadas:</strong>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${phaseData.acoes.map((acao, actionIndex) => {
                                    if (typeof acao === 'object') {
                                        return `
                                            <div style="background: var(--neo-bg-elevated); padding: 20px; border-radius: var(--neo-border-radius-small); border-left: 3px solid ${phaseColors[index]};">
                                                <h6 style="color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 1rem;">
                                                    <span style="background: ${phaseColors[index]}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;">
                                                        ${actionIndex + 1}
                                                    </span>
                                                    ${acao.acao || 'Ação não especificada'}
                                                </h6>
                                                
                                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 12px;">
                                                    ${acao.responsavel ? `
                                                        <div>
                                                            <strong style="color: var(--text-primary); font-size: 0.875rem;">Responsável:</strong>
                                                            <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">${acao.responsavel}</p>
                                                        </div>
                                                    ` : ''}
                                                    ${acao.prazo ? `
                                                        <div>
                                                            <strong style="color: var(--text-primary); font-size: 0.875rem;">Prazo:</strong>
                                                            <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">${acao.prazo}</p>
                                                        </div>
                                                    ` : ''}
                                                    ${acao.recursos_necessarios ? `
                                                        <div>
                                                            <strong style="color: var(--text-primary); font-size: 0.875rem;">Recursos:</strong>
                                                            <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">${acao.recursos_necessarios}</p>
                                                        </div>
                                                    ` : ''}
                                                    ${acao.resultado_esperado ? `
                                                        <div>
                                                            <strong style="color: var(--text-primary); font-size: 0.875rem;">Resultado:</strong>
                                                            <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">${acao.resultado_esperado}</p>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `;
                                    }
                                    return `
                                        <div style="background: var(--neo-bg-elevated); padding: 16px; border-radius: var(--neo-border-radius-small); border-left: 3px solid ${phaseColors[index]};">
                                            <p style="margin: 0; color: var(--text-secondary);">• ${acao}</p>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
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
            <h3 style="color: var(--text-primary); margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-size: 1.6rem;">
                <div style="width: 48px; height: 48px; background: var(--brand-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                    <i class="fas fa-lightbulb" style="font-size: 1.4rem;"></i>
                </div>
                Insights Exclusivos
            </h3>
            <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 1rem; line-height: 1.6;">
                Descobertas únicas identificadas através da análise ultra-detalhada com IA avançada:
            </p>
    `;
    
    insights.forEach((insight, index) => {
        html += `
            <div class="insight-item">
                <div class="insight-number">${index + 1}</div>
                <div class="insight-text">
                    <p style="margin: 0; line-height: 1.7; font-size: 1rem;">${insight}</p>
                </div>
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
            content += `<h4 style="color: var(--brand-secondary); margin: 24px 0 12px 0; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-angle-right" style="font-size: 0.9rem;"></i>
                ${formatKey(key)}
            </h4>`;
            content += formatObject(value);
        } else if (Array.isArray(value)) {
            content += `<h4 style="color: var(--brand-secondary); margin: 24px 0 12px 0; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-angle-right" style="font-size: 0.9rem;"></i>
                ${formatKey(key)}
            </h4>`;
            content += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
            value.forEach((item, index) => {
                if (typeof item === 'object') {
                    content += `
                        <div style="background: var(--neo-bg-dark); padding: 16px; border-radius: var(--neo-border-radius-small); border-left: 4px solid var(--brand-primary);">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                <span style="background: var(--brand-primary); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600;">
                                    ${index + 1}
                                </span>
                            </div>
                    `;
                    Object.entries(item).forEach(([subKey, subValue]) => {
                        content += `
                            <div style="margin-bottom: 6px;">
                                <strong style="color: var(--text-primary); font-size: 0.9rem;">${formatKey(subKey)}:</strong>
                                <span style="color: var(--text-secondary); margin-left: 8px;">${subValue}</span>
                            </div>
                        `;
                    });
                    content += `</div>`;
                } else {
                    content += `
                        <div style="background: var(--neo-bg-dark); padding: 12px 16px; border-radius: var(--neo-border-radius-small); border-left: 4px solid var(--brand-secondary);">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="background: var(--brand-secondary); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600;">
                                    ${index + 1}
                                </span>
                                <span style="color: var(--text-secondary);">${item}</span>
                            </div>
                        </div>
                    `;
                }
            });
            content += `</div>`;
        } else if (value) {
            content += `
                <div style="background: var(--neo-bg-dark); padding: 16px; border-radius: var(--neo-border-radius-small); margin-bottom: 12px; border-left: 4px solid var(--brand-primary);">
                    <strong style="color: var(--brand-primary);">${formatKey(key)}:</strong>
                    <p style="margin: 8px 0 0 0; color: var(--text-secondary); line-height: 1.5;">${value}</p>
                </div>
            `;
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
    const indent = level * 16;
    
    for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            html += `
                <div style="margin-left: ${indent}px; margin-bottom: 16px;">
                    <h5 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">${formatKey(key)}</h5>
                    ${formatObject(value, level + 1)}
                </div>
            `;
        } else if (Array.isArray(value)) {
            html += `
                <div style="margin-left: ${indent}px; margin-bottom: 16px;">
                    <strong style="color: var(--text-primary);">${formatKey(key)}:</strong>
                    <div style="margin: 8px 0 0 16px;">
                        ${value.map(item => `
                            <div style="color: var(--text-secondary); margin-bottom: 4px;">• ${item}</div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (value) {
            html += `
                <div style="margin-left: ${indent}px; margin-bottom: 8px;">
                    <strong style="color: var(--text-primary);">${formatKey(key)}:</strong>
                    <span style="color: var(--text-secondary); margin-left: 8px;">${value}</span>
                </div>
            `;
        }
    }
    
    return html;
}

function formatKey(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

function showAnalysisError(error) {
    const loadingSection = document.getElementById('loadingSection');
    const formSection = document.querySelector('.form-section');
    
    if (loadingSection) {
        loadingSection.style.transition = 'all 0.5s ease-in';
        loadingSection.style.opacity = '0';
        setTimeout(() => loadingSection.style.display = 'none', 500);
    }
    
    if (formSection) {
        formSection.style.display = 'block';
        formSection.style.opacity = '0';
        setTimeout(() => {
            formSection.style.transition = 'all 0.5s ease-out';
            formSection.style.opacity = '1';
            formSection.style.transform = 'translateY(0)';
        }, 100);
    }
    
    showNotification(`❌ Erro na análise: ${error.message || 'Erro desconhecido'}`, 'error');
    
    AppState.isAnalyzing = false;
}

/**
 * Funcionalidades auxiliares avançadas
 */
function generatePDF() {
    if (!AppState.currentAnalysis) {
        showNotification('⚠️ Nenhuma análise disponível para gerar PDF', 'warning');
        return;
    }
    
    showNotification('📄 Gerando PDF profissional...', 'info');
    
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
        
        showNotification('📄 PDF gerado e baixado com sucesso!', 'success');
    })
    .catch(error => {
        console.error('❌ Erro ao gerar PDF:', error);
        showNotification('❌ Erro ao gerar PDF', 'error');
    });
}

function resetForm() {
    // Limpar estado
    AppState.attachments = [];
    AppState.currentAnalysis = null;
    AppState.sessionId = generateSessionId();
    AppState.isAnalyzing = false;
    AppState.currentStep = 0;
    
    if (AppState.progressInterval) {
        clearTimeout(AppState.progressInterval);
    }
    
    // Resetar interface
    const resultsSection = document.getElementById('resultsSection');
    const formSection = document.querySelector('.form-section');
    const loadingSection = document.getElementById('loadingSection');
    const form = document.getElementById('analysisForm');
    const attachmentList = document.getElementById('attachmentList');
    
    if (resultsSection) {
        resultsSection.style.transition = 'all 0.5s ease-in';
        resultsSection.style.opacity = '0';
        setTimeout(() => resultsSection.style.display = 'none', 500);
    }
    
    if (loadingSection) {
        loadingSection.style.display = 'none';
    }
    
    if (formSection) {
        formSection.style.display = 'block';
        formSection.style.opacity = '0';
        setTimeout(() => {
            formSection.style.transition = 'all 0.5s ease-out';
            formSection.style.opacity = '1';
            formSection.style.transform = 'translateY(0)';
        }, 100);
    }
    
    if (form) {
        form.reset();
        // Resetar altura dos textareas
        form.querySelectorAll('textarea').forEach(textarea => {
            textarea.style.height = 'auto';
        });
    }
    
    if (attachmentList) {
        attachmentList.innerHTML = '';
    }
    
    // Limpar erros
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.form-control').forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
    
    showNotification('🔄 Formulário resetado - Pronto para nova análise', 'info');
}

/**
 * Sistema avançado de notificações
 */
let notificationContainer = null;
let activeNotifications = [];

function showNotification(message, type = 'info') {
    // Criar container se não existir
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 400px;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Limitar número de notificações visíveis
    if (activeNotifications.length >= CONFIG.notifications.maxVisible) {
        const oldestNotification = activeNotifications.shift();
        if (oldestNotification && oldestNotification.parentElement) {
            removeNotification(oldestNotification);
        }
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    const colors = getNotificationColors(type);
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                <i class="${icon}" style="font-size: 1.2rem;"></i>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 500; margin-bottom: 4px; line-height: 1.3;">
                    ${getNotificationTitle(type)}
                </div>
                <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">
                    ${message}
                </div>
            </div>
            <button onclick="removeNotification(this.parentElement)" style="flex-shrink: 0; background: none; border: none; color: inherit; cursor: pointer; font-size: 1.1rem; opacity: 0.7; transition: opacity 0.2s; padding: 4px;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        background: colors.background,
        color: colors.text,
        padding: '16px 20px',
        borderRadius: 'var(--neo-border-radius)',
        boxShadow: 'var(--neo-shadow-2)',
        border: `1px solid ${colors.border}`,
        backdropFilter: 'blur(20px)',
        transform: 'translateX(100%)',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
    });
    
    // Barra de progresso
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: ${colors.accent};
        width: 100%;
        transform-origin: left;
        animation: notificationProgress ${CONFIG.notifications.duration}ms linear;
    `;
    notification.appendChild(progressBar);
    
    notificationContainer.appendChild(notification);
    activeNotifications.push(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });
    
    // Auto-remover
    const timeoutId = setTimeout(() => {
        removeNotification(notification);
    }, CONFIG.notifications.duration);
    
    // Pausar auto-remoção no hover
    notification.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        progressBar.style.animationPlayState = 'paused';
    });
    
    notification.addEventListener('mouseleave', () => {
        const remainingTime = CONFIG.notifications.duration * (1 - (progressBar.getBoundingClientRect().width / notification.getBoundingClientRect().width));
        setTimeout(() => removeNotification(notification), remainingTime);
        progressBar.style.animationPlayState = 'running';
    });
    
    // Click para remover
    notification.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
}

function removeNotification(notification) {
    if (!notification || !notification.parentElement) return;
    
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
        
        // Remover da lista ativa
        const index = activeNotifications.indexOf(notification);
        if (index > -1) {
            activeNotifications.splice(index, 1);
        }
    }, 400);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColors(type) {
    const colorSchemes = {
        success: {
            background: 'rgba(52, 168, 83, 0.15)',
            border: 'rgba(52, 168, 83, 0.3)',
            text: '#ffffff',
            accent: 'var(--brand-secondary)'
        },
        error: {
            background: 'rgba(234, 67, 53, 0.15)',
            border: 'rgba(234, 67, 53, 0.3)',
            text: '#ffffff',
            accent: 'var(--brand-accent)'
        },
        warning: {
            background: 'rgba(251, 188, 4, 0.15)',
            border: 'rgba(251, 188, 4, 0.3)',
            text: '#ffffff',
            accent: 'var(--brand-warning)'
        },
        info: {
            background: 'rgba(66, 133, 244, 0.15)',
            border: 'rgba(66, 133, 244, 0.3)',
            text: '#ffffff',
            accent: 'var(--brand-primary)'
        }
    };
    return colorSchemes[type] || colorSchemes.info;
}

function getNotificationTitle(type) {
    const titles = {
        success: 'Sucesso',
        error: 'Erro',
        warning: 'Atenção',
        info: 'Informação'
    };
    return titles[type] || titles.info;
}

/**
 * Auto-save avançado do formulário
 */
function initializeAutoSave() {
    const form = document.getElementById('analysisForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 2000));
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
    
    // Salvar no localStorage
    localStorage.setItem('arqv30_form_data', JSON.stringify(data));
    localStorage.setItem('arqv30_form_timestamp', Date.now().toString());
    
    console.log('💾 Dados do formulário salvos automaticamente');
}

function loadFormData() {
    try {
        const savedData = localStorage.getItem('arqv30_form_data');
        const timestamp = localStorage.getItem('arqv30_form_timestamp');
        
        if (savedData && timestamp) {
            const age = Date.now() - parseInt(timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 horas
            
            if (age < maxAge) {
                const data = JSON.parse(savedData);
                
                for (const [key, value] of Object.entries(data)) {
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field && value) {
                        field.value = value;
                        
                        // Auto-resize textarea se necessário
                        if (field.tagName === 'TEXTAREA') {
                            field.style.height = 'auto';
                            field.style.height = field.scrollHeight + 'px';
                        }
                    }
                }
                
                console.log('📂 Dados do formulário carregados do auto-save');
                showNotification('📂 Dados anteriores restaurados', 'info');
            } else {
                // Limpar dados antigos
                localStorage.removeItem('arqv30_form_data');
                localStorage.removeItem('arqv30_form_timestamp');
            }
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados salvos:', error);
    }
}

/**
 * Tooltips e ajuda contextual
 */
function initializeTooltips() {
    const tooltips = {
        'segmento': 'Defina o segmento de mercado principal do seu produto ou serviço. Ex: E-commerce, SaaS, Educação Online',
        'query': 'Descreva o que você quer pesquisar na internet para enriquecer a análise. Ex: "tendências de mercado 2024"',
        'uploadArea': 'Envie arquivos com drivers mentais, provas visuais, perfis psicológicos ou dados de pesquisa'
    };
    
    for (const [id, text] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.title = text;
            
            // Adicionar ícone de ajuda
            const label = element.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                const helpIcon = document.createElement('i');
                helpIcon.className = 'fas fa-question-circle';
                helpIcon.style.cssText = `
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    cursor: help;
                    margin-left: 6px;
                `;
                helpIcon.title = text;
                label.appendChild(helpIcon);
            }
        }
    }
}

/**
 * Atalhos de teclado
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter para enviar formulário
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const form = document.getElementById('analysisForm');
            if (form && !AppState.isAnalyzing) {
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Esc para resetar formulário
        if (e.key === 'Escape' && !AppState.isAnalyzing) {
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection && resultsSection.style.display !== 'none') {
                resetForm();
            }
        }
        
        // Ctrl/Cmd + S para salvar dados
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveFormData();
            showNotification('💾 Dados salvos', 'success');
        }
    });
}

/**
 * Animações e micro-interações
 */
function initializeAnimations() {
    // Intersection Observer para animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem animar
    document.querySelectorAll('.result-card, .feature-item, .metric-item').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax suave no header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
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

// Adicionar estilos de animação CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideUp {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes notificationProgress {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from { 
            opacity: 0; 
            transform: translateY(30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    
    .slide-up {
        animation: slideUp 0.5s ease-out;
    }
    
    /* Smooth scrolling para todos os elementos */
    * {
        scroll-behavior: smooth;
    }
    
    /* Melhorar performance de animações */
    .spinner,
    .progress-fill,
    .status-dot,
    .insight-number::after {
        will-change: transform;
    }
`;
document.head.appendChild(animationStyles);

// Exportar funções globais
window.generatePDF = generatePDF;
window.resetForm = resetForm;
window.removeAttachment = removeAttachment;
window.removeNotification = removeNotification;

// Log de inicialização
console.log('🎉 ARQV30 Enhanced v2.0 - JavaScript Ultra-Moderno Carregado');