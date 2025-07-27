# -*- coding: utf-8 -*-
import sys
from flask import Blueprint, request, jsonify, Response
import json
from datetime import datetime, timedelta, timezone
import logging
from supabase import create_client, Client
from services.gemini_client import GeminiClient
from services.attachment_service import AttachmentService
import requests
import re
from typing import Dict, List, Optional, Tuple
import concurrent.futures
from functools import lru_cache
import uuid
import os

# Configurar encoding UTF-8 no Windows
if sys.platform.startswith('win'):
    try:
        os.system('chcp 65001 > nul 2>&1')
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8')
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8')
    except:
        pass

# Função para print seguro
def safe_print(text):
    try:
        print(text)
    except UnicodeEncodeError:
        # Remove emojis e caracteres especiais
        import re
        clean_text = re.sub(r'[^\x00-\x7F]+', '', str(text))
        print(clean_text)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

analysis_bp = Blueprint('analysis', __name__)

# Configure Supabase
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase: Client = None

if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        safe_print("Cliente Supabase configurado com sucesso")
    except Exception as e:
        safe_print(f"Erro ao configurar Supabase: {e}")

# Initialize services
try:
    gemini_client = GeminiClient()
    safe_print("Cliente Gemini Pro 2.5 configurado com sucesso")
except Exception as e:
    safe_print(f"Erro ao inicializar Gemini: {e}")
    gemini_client = None

# Initialize enhanced services
attachment_service = AttachmentService()

# WebSailor service - simplified for now
class SimpleWebSailorService:
    def is_available(self):
        return False
    
    def get_service_status(self):
        return {'available': False, 'reason': 'WebSailor integration in development'}
    
    def perform_deep_web_research(self, query, context_data):
        return {
            'success': False,
            'error': 'WebSailor not available',
            'results': f"Pesquisa simulada para: {query}"
        }

websailor_service = SimpleWebSailorService()

@analysis_bp.route('/analyze', methods=['POST'])
def analyze_market():
    """Análise ultra-detalhada de mercado com Gemini Pro 2.5, WebSailor, pesquisa profunda na internet e análise de anexos"""
    try:
        data = request.get_json()
        
        # Aceitar tanto 'segmento' quanto 'nicho' para compatibilidade
        segmento = data.get('segmento') or data.get('nicho')
        if not segmento:
            return jsonify({'error': 'Segmento é obrigatório'}), 400
        
        # Extract and validate form data
        analysis_data = {
            'segmento': segmento.strip(),
            'produto': data.get('produto', '').strip(),
            'descricao': data.get('descricao', '').strip(),
            'preco': data.get('preco', ''),
            'publico': data.get('publico', '').strip(),
            'concorrentes': data.get('concorrentes', '').strip(),
            'dados_adicionais': data.get('dadosAdicionais', '').strip(),
            'objetivo_receita': data.get('objetivoReceita', ''),
            'prazo_lancamento': data.get('prazoLancamento', ''),
            'orcamento_marketing': data.get('orcamentoMarketing', ''),
            'user_query': data.get('query', '').strip(),  # Nova funcionalidade de pesquisa
            'session_id': data.get('session_id', str(uuid.uuid4()))  # Para gerenciar anexos
        }
        
        # Safe numeric conversion
        def safe_float_conversion(value, default=None):
            if value is None or value == '':
                return default
            try:
                return float(str(value).replace(',', '.'))
            except (ValueError, TypeError):
                return default
        
        analysis_data['preco_float'] = safe_float_conversion(analysis_data['preco'], 997.0)
        analysis_data['objetivo_receita_float'] = safe_float_conversion(analysis_data['objetivo_receita'], 100000.0)
        analysis_data['orcamento_marketing_float'] = safe_float_conversion(analysis_data['orcamento_marketing'], 50000.0)
        
        safe_print(f"Iniciando analise ultra-detalhada para segmento: {analysis_data['segmento']}")
        
        # Busca profunda na internet com WebSailor (prioritário) ou DeepSeek (fallback)
        search_context = None
        websailor_used = False
        
        # Implementar busca profunda se query fornecida
        if analysis_data.get('user_query'):
            try:
                # Tentar usar WebSailor primeiro
                if websailor_service.is_available():
                    websailor_result = websailor_service.perform_deep_web_research(
                        analysis_data['user_query'], 
                        analysis_data
                    )
                    if websailor_result['success']:
                        search_context = websailor_result['results']
                        websailor_used = True
                
                # Fallback para busca simulada
                if not search_context:
                    search_context = f"""
PESQUISA PROFUNDA SIMULADA:
Query: {analysis_data['user_query']}
Segmento: {analysis_data['segmento']}

Dados coletados:
- Tendências atuais do mercado brasileiro
- Análise de concorrentes principais
- Comportamento do consumidor
- Oportunidades identificadas
- Desafios do segmento

Nota: Esta é uma simulação. Para pesquisa real na internet, 
configure as APIs WebSailor ou DeepSeek.
"""
                    websailor_used = False
                    
            except Exception as e:
                safe_print(f"Erro na busca profunda: {e}")
                search_context = f"Erro na pesquisa: {str(e)}"
                websailor_used = False
        
        # Recuperar anexos da sessão
        attachments_context = attachment_service.get_session_attachments_content(analysis_data['session_id'])
        
        # Save initial analysis record
        analysis_id = save_initial_analysis(analysis_data)
        
        # Generate comprehensive analysis with Gemini Pro 2.5
        if gemini_client:
            safe_print("🤖 Usando Gemini Pro 1.5 com pesquisa profunda e análise de anexos")
            analysis_result = gemini_client.generate_ultra_detailed_analysis(
                analysis_data,
                search_context=search_context,
                attachments_context=attachments_context
            )
        else:
            safe_print("⚠️ Gemini não disponível, usando análise de fallback")
            analysis_result = create_fallback_analysis(analysis_data)
        
        # Adicionar contextos à resposta para transparência
        analysis_result['search_context_used'] = bool(search_context)
        analysis_result['websailor_used'] = websailor_used
        analysis_result['attachments_used'] = bool(attachments_context)
        analysis_result['deep_search_results'] = search_context if search_context else None
        
        # Update analysis record with results
        if supabase and analysis_id:
            update_analysis_record(analysis_id, analysis_result)
            analysis_result['analysis_id'] = analysis_id
        
        safe_print("✅ Análise ultra-detalhada concluída com sucesso")
        return jsonify(analysis_result)
        
    except Exception as e:
        safe_print(f"❌ Erro na análise: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor', 'details': str(e)}), 500

@analysis_bp.route('/upload_attachment', methods=['POST'])
def upload_attachment():
    """Upload e processamento de anexos para análise"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400

        file = request.files['file']
        session_id = request.form.get('session_id', str(uuid.uuid4()))
        
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

        if file:
            # Processar anexo usando o serviço
            result = attachment_service.process_attachment(file, session_id)
            
            if result['success']:
                return jsonify({
                    'status': 'success', 
                    'message': f"Anexo '{file.filename}' processado com sucesso.",
                    'session_id': session_id,
                    'attachment_id': result['attachment_id']
                }), 200
            else:
                return jsonify({'error': result['error']}), 400
                
    except Exception as e:
        safe_print(f"[ERROR] Erro no upload de anexo: {str(e)}")
        return jsonify({'error': f'Erro no upload: {str(e)}'}), 500

@analysis_bp.route('/analyze_batch', methods=['POST'])
def analyze_batch_data():
    """Análise em lote com suporte a anexos, busca profunda e WebSailor"""
    try:
        batch_data = request.get_json()
        if not isinstance(batch_data, list) or not batch_data:
            return jsonify({'error': 'Formato de dados inválido. Esperado uma lista de objetos.'}), 400

        reports = []
        errors = []

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_data = {
                executor.submit(process_single_analysis_enhanced, item): item 
                for item in batch_data
            }
            
            for future in concurrent.futures.as_completed(future_to_data):
                item_data = future_to_data[future]
                try:
                    report = future.result()
                    reports.append(report)
                except Exception as e:
                    safe_print(f"Erro ao processar item em lote {item_data}: {e}")
                    errors.append({'data': item_data, 'error': str(e)})

        return jsonify({'reports': reports, 'errors': errors})
        
    except Exception as e:
        safe_print(f"Erro na analise em lote: {str(e)}")
        return jsonify({'error': f'Erro na análise em lote: {str(e)}'}), 500

def process_single_analysis_enhanced(data_item: Dict) -> Dict:
    """Processa uma análise individual com funcionalidades aprimoradas"""
    user_query = data_item.get('query')
    session_id = data_item.get('session_id', str(uuid.uuid4()))
    
    # Busca profunda se query fornecida
    search_context = None
    websailor_used = False
    
    if user_query:
        search_context = f"Pesquisa profunda simulada para: {user_query}"
        websailor_used = False

    # Recuperar anexos da sessão
    attachments_context = attachment_service.get_session_attachments_content(session_id)

    if not gemini_client:
        raise Exception('Serviço Gemini não configurado para processamento em lote')

    analysis_result = gemini_client.generate_ultra_detailed_analysis(
        data_item, 
        search_context=search_context,
        attachments_context=attachments_context
    )
    
    return {
        'data': data_item, 
        'report': analysis_result,
        'search_context_used': bool(search_context),
        'websailor_used': websailor_used,
        'attachments_used': bool(attachments_context)
    }

@analysis_bp.route('/generate_pdf', methods=['POST'])
def generate_pdf_report():
    """Gera relatório em PDF com análise aprimorada"""
    try:
        data = request.get_json()
        if not data or 'report_content' not in data:
            return jsonify({'error': 'Conteúdo do relatório não fornecido'}), 400

        report_content = data['report_content']
        
        # Importar gerador de PDF
        from .pdf_generator import generate_enhanced_pdf
        pdf_buffer = generate_enhanced_pdf(report_content)
        
        return Response(
            pdf_buffer.getvalue(), 
            mimetype='application/pdf', 
            headers={'Content-Disposition': 'attachment;filename=relatorio_analise_aprimorado.pdf'}
        )
        
    except Exception as e:
        safe_print(f"Erro ao gerar PDF: {e}")
        return jsonify({'error': f'Erro ao gerar PDF: {e}'}), 500

@analysis_bp.route('/session_attachments/<session_id>', methods=['GET'])
def get_session_attachments(session_id):
    """Recupera anexos de uma sessão específica"""
    try:
        attachments = attachment_service.get_session_attachments(session_id)
        return jsonify({
            'session_id': session_id,
            'attachments': attachments,
            'count': len(attachments) if attachments else 0
        })
        
    except Exception as e:
        safe_print(f"Erro ao recuperar anexos da sessao: {str(e)}")
        return jsonify({'error': f'Erro ao recuperar anexos: {str(e)}'}), 500

@analysis_bp.route('/clear_session/<session_id>', methods=['DELETE'])
def clear_session_attachments(session_id):
    """Limpa anexos de uma sessão específica"""
    try:
        result = attachment_service.clear_session(session_id)
        return jsonify({
            'status': 'success' if result else 'warning',
            'message': 'Sessão limpa com sucesso' if result else 'Sessão não encontrada',
            'session_id': session_id
        })
        
    except Exception as e:
        safe_print(f"Erro ao limpar sessao: {str(e)}")
        return jsonify({'error': f'Erro ao limpar sessão: {str(e)}'}), 500

def save_initial_analysis(data: Dict) -> Optional[int]:
    """Salva registro inicial da análise no Supabase"""
    if not supabase:
        safe_print("Supabase nao configurado, pulando salvamento")
        return None
    
    try:
        analysis_record = {
            'nicho': data['segmento'],  # Manter compatibilidade com schema
            'produto': data['produto'],
            'descricao': data['descricao'],
            'preco': data['preco_float'],
            'publico': data['publico'],
            'concorrentes': data['concorrentes'],
            'dados_adicionais': data['dados_adicionais'],
            'objetivo_receita': data['objetivo_receita_float'],
            'orcamento_marketing': data['orcamento_marketing_float'],
            'prazo_lancamento': data['prazo_lancamento'],
            'user_query': data.get('user_query', ''),  # Nova coluna
            'session_id': data.get('session_id', ''),  # Nova coluna
            'status': 'processing',
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        result = supabase.table('analyses').insert(analysis_record).execute()
        if result.data:
            analysis_id = result.data[0]['id']
            safe_print(f"Analise salva no Supabase com ID: {analysis_id}")
            return analysis_id
    except Exception as e:
        safe_print(f"Erro ao salvar no Supabase: {str(e)}")
    
    return None

def update_analysis_record(analysis_id: int, results: Dict):
    """Atualiza registro da análise com resultados aprimorados"""
    try:
        update_data = {
            'avatar_data': results.get('avatar_ultra_detalhado', {}),
            'positioning_data': results.get('escopo', {}),
            'competition_data': results.get('analise_concorrencia_detalhada', {}),
            'marketing_data': results.get('estrategia_palavras_chave', {}),
            'metrics_data': results.get('metricas_performance_detalhadas', {}),
            'funnel_data': results.get('projecoes_cenarios', {}),
            'market_intelligence': results.get('inteligencia_mercado', {}),
            'action_plan': results.get('plano_acao_detalhado', {}),
            'comprehensive_analysis': results,  # Análise completa
            'search_context_used': results.get('search_context_used', False),  # Novo campo
            'websailor_used': results.get('websailor_used', False),  # Novo campo
            'attachments_used': results.get('attachments_used', False),  # Novo campo
            'status': 'completed',
            'updated_at': datetime.now(timezone.utc).isoformat()
        }
        
        supabase.table('analyses').update(update_data).eq('id', analysis_id).execute()
        safe_print(f"Analise {analysis_id} atualizada no Supabase")
        
    except Exception as e:
        safe_print(f"Erro ao atualizar analise no Supabase: {str(e)}")

def create_fallback_analysis(data: Dict) -> Dict:
    """Cria análise de fallback quando Gemini falha"""
    if gemini_client:
        return gemini_client._generate_fallback_analysis(data)
    
    # Fallback básico se nem o cliente Gemini estiver disponível
    segmento = data.get('segmento', 'Produto Digital')
    return {
        "escopo": {
            "segmento_principal": segmento,
            "subsegmentos": [f"{segmento} básico", f"{segmento} avançado"],
            "produto_ideal": data.get('produto', 'Produto Digital'),
            "proposta_valor": f"Solução completa para {segmento}"
        },
        "avatar_ultra_detalhado": {
            "persona_principal": {
                "nome": "Avatar Padrão",
                "idade": "35 anos",
                "profissao": f"Profissional de {segmento}",
                "renda_mensal": "R$ 10.000 - R$ 20.000",
                "localizacao": "São Paulo, SP",
                "estado_civil": "Casado",
                "escolaridade": "Superior completo"
            }
        },
        "insights_exclusivos": [
            f"Análise básica para o segmento {segmento}",
            "Recomenda-se análise mais detalhada com Gemini Pro 2.5"
        ]
    }

# Rotas existentes mantidas com adaptações para 'segmento'
@analysis_bp.route('/analyses', methods=['GET'])
def get_analyses():
    """Get list of recent analyses"""
    try:
        if not supabase:
            return jsonify({'error': 'Banco de dados não configurado'}), 500
        
        limit = request.args.get('limit', 10, type=int)
        segmento = request.args.get('segmento') or request.args.get('nicho')  # Compatibilidade
        
        query = supabase.table('analyses').select('*').order('created_at', desc=True)
        
        if segmento:
            query = query.eq('nicho', segmento)  # Campo no DB ainda é 'nicho'
        
        result = query.limit(limit).execute()
        
        return jsonify({
            'analyses': result.data,
            'count': len(result.data)
        })
        
    except Exception as e:
        safe_print(f"Erro ao buscar análises: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@analysis_bp.route('/analyses/<int:analysis_id>', methods=['GET'])
def get_analysis(analysis_id):
    """Get specific analysis by ID"""
    try:
        if not supabase:
            return jsonify({'error': 'Banco de dados não configurado'}), 500
        
        result = supabase.table('analyses').select('*').eq('id', analysis_id).execute()
        
        if not result.data:
            return jsonify({'error': 'Análise não encontrada'}), 404
        
        analysis = result.data[0]
        
        # Retorna análise completa se disponível
        if analysis.get('comprehensive_analysis'):
            return jsonify(analysis['comprehensive_analysis'])
        
        # Fallback para estrutura antiga
        structured_analysis = {
            'id': analysis['id'],
            'segmento': analysis['nicho'],  # Mapear nicho para segmento
            'produto': analysis['produto'],
            'avatar_ultra_detalhado': analysis['avatar_data'],
            'escopo': analysis['positioning_data'],
            'analise_concorrencia_detalhada': analysis['competition_data'],
            'estrategia_palavras_chave': analysis['marketing_data'],
            'metricas_performance_detalhadas': analysis['metrics_data'],
            'projecoes_cenarios': analysis['funnel_data'],
            'inteligencia_mercado': analysis.get('market_intelligence', {}),
            'plano_acao_detalhado': analysis.get('action_plan', {}),
            'created_at': analysis['created_at'],
            'status': analysis['status']
        }
        
        return jsonify(structured_analysis)
        
    except Exception as e:
        safe_print(f"Erro ao buscar análise: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@analysis_bp.route('/segmentos', methods=['GET'])
def get_segmentos():
    """Get list of unique segments from analyses"""
    try:
        if not supabase:
            return jsonify({'error': 'Banco de dados não configurado'}), 500
        
        result = supabase.table('analyses').select('nicho').execute()
        
        segmentos = list(set([item['nicho'] for item in result.data if item['nicho']]))
        segmentos.sort()
        
        return jsonify({
            'segmentos': segmentos,
            'count': len(segmentos)
        })
        
    except Exception as e:
        safe_print(f"Erro ao buscar segmentos: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

# Manter rota antiga para compatibilidade
@analysis_bp.route('/nichos', methods=['GET'])
def get_nichos():
    """Get list of unique niches (compatibility route)"""
    return get_segmentos()

# Novas rotas para funcionalidades aprimoradas
@analysis_bp.route('/status', methods=['GET'])
def status_check():
    """Endpoint para verificar o status do serviço"""
    
    # Testar conexão com Gemini
    gemini_status = False
    if gemini_client:
        try:
            gemini_status = gemini_client.test_connection()
        except:
            gemini_status = False
    
    status = {
        'supabase_configured': supabase is not None,
        'gemini_configured': gemini_client is not None,
        'gemini_working': gemini_status,
        'attachment_service_configured': attachment_service.is_configured(),
        'websailor_configured': websailor_service.is_available(),
        'websailor_status': websailor_service.get_service_status(),
        'timestamp': datetime.utcnow().isoformat(),
        'version': '2.0.0',
        'model': 'gemini-1.5-pro'
    }
    return jsonify(status), 200

@analysis_bp.route('/health', methods=['GET'])
def health_check():
    """Endpoint de health check para balanceadores de carga"""
    return jsonify({'status': 'healthy', 'version': '2.0.0'}), 200

@analysis_bp.route('/test_websailor', methods=['GET'])
def test_websailor():
    """Endpoint para testar WebSailor"""
    result = websailor_service.test_connection()
    return jsonify(result), 200 if result['success'] else 503

@analysis_bp.route('/websailor_status', methods=['GET'])
def websailor_status():
    """Endpoint para status detalhado do WebSailor"""
    return jsonify(websailor_service.get_service_status()), 200
