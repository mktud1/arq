import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import google.generativeai as genai
import time
import re

logger = logging.getLogger(__name__)

class GeminiClient:
    """Cliente aprimorado para Google Gemini Pro 1.5 com análise ultra-detalhada"""
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY não configurada")
        
        # Configurar Gemini
        genai.configure(api_key=self.api_key)
        
        # Configurações otimizadas do modelo
        self.generation_config = {
            "temperature": 0.7,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 8192,
        }
        
        self.safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
        
        # Inicializar modelo
        try:
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-pro",
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )
            logger.info("✅ Cliente Gemini Pro 1.5 inicializado com sucesso")
        except Exception as e:
            logger.error(f"❌ Erro ao inicializar Gemini: {e}")
            raise
    
    def generate_ultra_detailed_analysis(self, 
                                       form_data: Dict,
                                       search_context: Optional[str] = None,
                                       websailor_context: Optional[str] = None,
                                       attachments_context: Optional[str] = None) -> Dict:
        """
        Gera análise ultra-detalhada usando todos os contextos disponíveis
        """
        try:
            logger.info("🤖 Iniciando análise ultra-detalhada com Gemini Pro 1.5")
            
            # Construir prompt ultra-detalhado
            prompt = self._build_ultra_detailed_prompt(
                form_data, search_context, websailor_context, attachments_context
            )
            
            # Gerar resposta com retry
            response = self._generate_with_retry(prompt)
            
            # Processar resposta
            analysis = self._process_gemini_response(response)
            
            # Adicionar metadados
            analysis['metadata'] = {
                'generated_at': datetime.now(timezone.utc).isoformat(),
                'model': 'gemini-1.5-pro',
                'search_context_used': bool(search_context),
                'websailor_used': bool(websailor_context),
                'attachments_used': bool(attachments_context),
                'form_data_fields': list(form_data.keys()),
                'analysis_version': '2.0.0'
            }
            
            logger.info("✅ Análise ultra-detalhada gerada com sucesso")
            return analysis
            
        except Exception as e:
            logger.error(f"❌ Erro na análise Gemini: {e}")
            return self._generate_fallback_analysis(form_data)
    
    def _build_ultra_detailed_prompt(self, 
                                   form_data: Dict,
                                   search_context: Optional[str],
                                   websailor_context: Optional[str],
                                   attachments_context: Optional[str]) -> str:
        """Constrói prompt ultra-detalhado para análise"""
        
        prompt = f"""
# ANÁLISE ULTRA-DETALHADA DE MERCADO - ARQV30 ENHANCED v2.0

Você é um especialista sênior em análise de mercado e estratégia de negócios com 20+ anos de experiência. 
Sua missão é gerar uma análise ULTRA-DETALHADA, PRECISA e ACIONÁVEL baseada nos dados fornecidos.

## DADOS DO PROJETO:
- **Segmento**: {form_data.get('segmento', 'Não informado')}
- **Produto/Serviço**: {form_data.get('produto', 'Não informado')}
- **Público-Alvo**: {form_data.get('publico', 'Não informado')}
- **Preço**: R$ {form_data.get('preco', 'Não informado')}
- **Concorrentes**: {form_data.get('concorrentes', 'Não informado')}
- **Objetivo de Receita**: R$ {form_data.get('objetivoReceita', 'Não informado')}
- **Orçamento Marketing**: R$ {form_data.get('orcamentoMarketing', 'Não informado')}
- **Prazo de Lançamento**: {form_data.get('prazoLancamento', 'Não informado')}
- **Dados Adicionais**: {form_data.get('dadosAdicionais', 'Não informado')}
"""

        # Adicionar contextos se disponíveis
        if search_context:
            prompt += f"""
## CONTEXTO DE PESQUISA PROFUNDA:
{search_context}
"""

        if websailor_context:
            prompt += f"""
## CONTEXTO WEBSAILOR (NAVEGAÇÃO WEB AVANÇADA):
{websailor_context}
"""

        if attachments_context:
            prompt += f"""
## CONTEXTO DOS ANEXOS:
{attachments_context}
"""

        prompt += """
## INSTRUÇÕES PARA ANÁLISE ULTRA-DETALHADA:

Gere uma análise COMPLETA, PRECISA e ACIONÁVEL seguindo EXATAMENTE esta estrutura JSON.
IMPORTANTE: Responda APENAS com o JSON válido, sem texto adicional.

```json
{
  "avatar_ultra_detalhado": {
    "perfil_demografico": {
      "idade": "Faixa etária específica com justificativa baseada no segmento",
      "genero": "Distribuição por gênero com percentuais realistas",
      "renda": "Faixa de renda detalhada com valores específicos em R$",
      "escolaridade": "Nível educacional predominante com justificativa",
      "localizacao": "Localização geográfica específica (cidades/regiões)",
      "profissao": "Profissões principais e secundárias detalhadas"
    },
    "perfil_psicografico": {
      "personalidade": "Traços de personalidade dominantes específicos",
      "valores": "Valores fundamentais que guiam decisões de compra",
      "interesses": "Interesses e hobbies específicos do público",
      "estilo_vida": "Estilo de vida detalhado e comportamentos",
      "comportamento_compra": "Padrões específicos de comportamento de compra"
    },
    "dores_especificas": [
      "Dor específica 1 com intensidade e frequência detalhadas",
      "Dor específica 2 com impacto emocional e financeiro",
      "Dor específica 3 com consequências práticas no dia a dia"
    ],
    "desejos_profundos": [
      "Desejo profundo 1 com motivação emocional específica",
      "Desejo profundo 2 com benefício esperado detalhado",
      "Desejo profundo 3 com transformação desejada específica"
    ],
    "gatilhos_mentais": [
      "Gatilho mental 1 com aplicação prática e exemplo de uso",
      "Gatilho mental 2 com timing ideal e contexto de aplicação",
      "Gatilho mental 3 com estratégia de implementação específica"
    ],
    "jornada_do_cliente": {
      "consciencia": "Como toma consciência do problema - canais e momentos",
      "consideracao": "Como avalia soluções - critérios e processo decisório",
      "decisao": "Fatores que influenciam decisão final - preço, confiança, urgência",
      "pos_compra": "Comportamento após compra - uso, satisfação, recomendação"
    }
  },
  
  "escopo": {
    "posicionamento_mercado": "Posicionamento único e diferenciado no mercado brasileiro",
    "proposta_valor": "Proposta de valor clara, específica e diferenciada",
    "vantagem_competitiva": "Principais vantagens sobre concorrentes específicos",
    "nicho_especifico": "Nicho específico de atuação com características únicas",
    "tamanho_mercado": {
      "tam_total": "Tamanho total do mercado em R$ com fonte/justificativa",
      "sam_disponivel": "Mercado disponível em R$ considerando segmentação",
      "som_obtivel": "Mercado obtível em R$ considerando recursos e capacidade"
    }
  },
  
  "analise_concorrencia_detalhada": {
    "concorrentes_diretos": [
      {
        "nome": "Nome do concorrente direto real",
        "preco_range": "Faixa de preços específica em R$",
        "posicionamento": "Como se posiciona no mercado",
        "pontos_fortes": "Principais forças competitivas",
        "pontos_fracos": "Principais fraquezas identificadas",
        "market_share": "Participação estimada no mercado"
      }
    ],
    "concorrentes_indiretos": [
      {
        "nome": "Nome do concorrente indireto",
        "como_compete": "Como compete indiretamente pelo mesmo público",
        "nivel_ameaca": "Alto/Médio/Baixo com justificativa"
      }
    ],
    "gaps_mercado": [
      "Gap 1 com oportunidade específica e potencial de receita",
      "Gap 2 com estratégia de exploração detalhada",
      "Gap 3 com vantagem competitiva sustentável"
    ],
    "analise_precos": {
      "faixa_mercado": "Faixa de preços do mercado (mín-máx em R$)",
      "posicionamento_preco": "Onde seu preço se posiciona (premium/médio/baixo)",
      "estrategia_recomendada": "Estratégia de precificação específica"
    }
  },
  
  "estrategia_palavras_chave": {
    "palavras_chave_primarias": [
      {
        "termo": "palavra-chave principal específica",
        "volume_mensal": "Volume de busca mensal estimado",
        "dificuldade": "Nível de dificuldade (Alta/Média/Baixa)",
        "cpc_estimado": "CPC estimado em R$ para Google Ads",
        "intencao": "Intenção de busca (informacional/comercial/transacional)"
      }
    ],
    "palavras_chave_secundarias": [
      {
        "termo": "palavra-chave secundária específica",
        "volume_mensal": "Volume de busca mensal",
        "oportunidade": "Nível de oportunidade (Alta/Média/Baixa)",
        "uso_recomendado": "Como usar (blog/landing page/ads)"
      }
    ],
    "long_tail": [
      "Frase longa específica 1 com alta intenção de compra",
      "Frase longa específica 2 com baixa concorrência"
    ],
    "estrategia_conteudo": "Estratégia de conteúdo baseada nas palavras-chave",
    "canais_marketing": {
      "google_ads": {
        "estrategia": "Estratégia específica para Google Ads",
        "orcamento_sugerido": "Orçamento mensal sugerido em R$",
        "cpc_medio": "CPC médio esperado em R$",
        "roi_esperado": "ROI esperado em %"
      },
      "facebook_ads": {
        "estrategia": "Estratégia para Facebook/Instagram Ads",
        "publico_alvo": "Definição específica de público-alvo",
        "orcamento_sugerido": "Orçamento mensal sugerido em R$",
        "cpm_estimado": "CPM estimado em R$"
      },
      "seo": {
        "estrategia": "Estratégia de SEO específica",
        "tempo_resultados": "Tempo para ver resultados (meses)",
        "acoes_prioritarias": "Ações prioritárias de SEO"
      },
      "content_marketing": {
        "tipos_conteudo": "Tipos de conteúdo recomendados",
        "frequencia": "Frequência de publicação",
        "canais_distribuicao": "Canais de distribuição prioritários"
      }
    }
  },
  
  "metricas_performance_detalhadas": {
    "kpis_principais": {
      "cac": "Custo de Aquisição de Cliente estimado em R$",
      "ltv": "Lifetime Value estimado em R$",
      "roi": "ROI esperado em %",
      "taxa_conversao": "Taxa de conversão esperada em %",
      "ticket_medio": "Ticket médio em R$",
      "payback": "Tempo de payback em meses"
    },
    "projecoes_vendas": {
      "mes_1": "Vendas projetadas mês 1 (unidades e R$)",
      "mes_3": "Vendas projetadas mês 3 (unidades e R$)",
      "mes_6": "Vendas projetadas mês 6 (unidades e R$)",
      "mes_12": "Vendas projetadas mês 12 (unidades e R$)"
    },
    "metricas_marketing": {
      "cpm": "CPM estimado em R$",
      "cpc": "CPC estimado em R$",
      "ctr": "CTR esperado em %",
      "roas": "ROAS esperado",
      "taxa_abertura_email": "Taxa de abertura de email em %"
    },
    "benchmarks_segmento": {
      "taxa_conversao_media": "Taxa de conversão média do segmento",
      "cac_medio": "CAC médio do segmento em R$",
      "ltv_medio": "LTV médio do segmento em R$",
      "margem_lucro_media": "Margem de lucro média do segmento"
    }
  },
  
  "projecoes_cenarios": {
    "cenario_conservador": {
      "vendas_mensais": "Número de vendas mensais (unidades)",
      "receita_mensal": "Receita mensal em R$",
      "receita_anual": "Receita anual em R$",
      "margem_lucro": "Margem de lucro em %",
      "investimento_marketing": "Investimento em marketing em R$",
      "premissas": [
        "Premissa conservadora 1 específica",
        "Premissa conservadora 2 específica"
      ]
    },
    "cenario_realista": {
      "vendas_mensais": "Número de vendas mensais (unidades)",
      "receita_mensal": "Receita mensal em R$",
      "receita_anual": "Receita anual em R$",
      "margem_lucro": "Margem de lucro em %",
      "investimento_marketing": "Investimento em marketing em R$",
      "premissas": [
        "Premissa realista 1 específica",
        "Premissa realista 2 específica"
      ]
    },
    "cenario_otimista": {
      "vendas_mensais": "Número de vendas mensais (unidades)",
      "receita_mensal": "Receita mensal em R$",
      "receita_anual": "Receita anual em R$",
      "margem_lucro": "Margem de lucro em %",
      "investimento_marketing": "Investimento em marketing em R$",
      "premissas": [
        "Premissa otimista 1 específica",
        "Premissa otimista 2 específica"
      ]
    }
  },
  
  "inteligencia_mercado": {
    "tendencias_mercado": [
      {
        "tendencia": "Nome da tendência específica",
        "impacto": "Alto/Médio/Baixo",
        "oportunidade": "Como aproveitar esta tendência",
        "timeline": "Quando implementar (prazo)"
      }
    ],
    "sazonalidade": {
      "picos_demanda": "Períodos de maior demanda com datas específicas",
      "baixas_demanda": "Períodos de menor demanda com datas específicas",
      "estrategia_sazonal": "Como lidar com sazonalidade",
      "preparacao_picos": "Como se preparar para picos de demanda"
    },
    "tecnologias_emergentes": [
      "Tecnologia 1 e seu impacto no segmento",
      "Tecnologia 2 e oportunidades de implementação"
    ],
    "mudancas_comportamento": [
      "Mudança 1 no comportamento do consumidor brasileiro",
      "Mudança 2 e suas implicações para o negócio"
    ],
    "regulamentacoes": "Regulamentações relevantes e impactos no negócio"
  },
  
  "plano_acao_detalhado": {
    "fase_pre_lancamento": {
      "duracao": "8 semanas",
      "acoes": [
        {
          "acao": "Ação específica de pré-lançamento",
          "responsavel": "Quem deve executar",
          "prazo": "Prazo em semanas",
          "recursos_necessarios": "Recursos necessários (humanos/financeiros)",
          "resultado_esperado": "Resultado esperado específico",
          "metricas_sucesso": "Como medir o sucesso"
        }
      ]
    },
    "fase_lancamento": {
      "duracao": "4 semanas",
      "acoes": [
        {
          "acao": "Ação específica de lançamento",
          "responsavel": "Quem deve executar",
          "prazo": "Prazo específico",
          "orcamento": "Orçamento necessário em R$",
          "metricas_sucesso": "Como medir sucesso do lançamento"
        }
      ]
    },
    "fase_pos_lancamento": {
      "duracao": "12 semanas",
      "acoes": [
        {
          "acao": "Ação específica pós-lançamento",
          "responsavel": "Quem deve executar",
          "frequencia": "Frequência de execução",
          "objetivo": "Objetivo específico",
          "kpis": "KPIs para acompanhar"
        }
      ]
    }
  },
  
  "insights_exclusivos": [
    "Insight exclusivo 1: Descoberta única baseada na análise completa dos dados que outros não veriam facilmente",
    "Insight exclusivo 2: Oportunidade não óbvia identificada através da combinação de dados e contextos",
    "Insight exclusivo 3: Estratégia diferenciada baseada em padrões identificados na análise",
    "Insight exclusivo 4: Timing ideal de mercado identificado através de tendências e sazonalidade",
    "Insight exclusivo 5: Vantagem competitiva sustentável baseada em gaps de mercado identificados"
  ]
}
```

## DIRETRIZES CRÍTICAS:

1. **SEJA ULTRA-ESPECÍFICO**: Use números reais, percentuais específicos, valores em R$ sempre que possível.

2. **USE TODOS OS CONTEXTOS**: Incorpore TODAS as informações dos contextos de pesquisa, WebSailor e anexos fornecidos.

3. **SEJA ACIONÁVEL**: Cada recomendação deve ser implementável imediatamente com passos claros.

4. **DADOS BRASILEIROS**: Foque no mercado brasileiro com dados locais, moeda em reais, comportamento do consumidor brasileiro.

5. **INSIGHTS ÚNICOS**: Gere insights que só um especialista experiente com acesso a todos esses dados identificaria.

6. **FORMATO JSON VÁLIDO**: Responda APENAS com o JSON válido, sem texto adicional antes ou depois.

7. **PRECISÃO**: Baseie-se nos dados fornecidos e contextos para gerar análises precisas e realistas.

GERE A ANÁLISE ULTRA-DETALHADA AGORA:
"""
        
        return prompt
    
    def _generate_with_retry(self, prompt: str, max_retries: int = 3) -> str:
        """Gera resposta com retry em caso de erro"""
        
        for attempt in range(max_retries):
            try:
                logger.info(f"🔄 Tentativa {attempt + 1} de geração com Gemini Pro")
                
                response = self.model.generate_content(prompt)
                
                if response.text:
                    logger.info("✅ Resposta gerada com sucesso")
                    return response.text
                else:
                    raise Exception("Resposta vazia do Gemini")
                    
            except Exception as e:
                logger.warning(f"⚠️ Tentativa {attempt + 1} falhou: {e}")
                
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Backoff exponencial
                    logger.info(f"⏳ Aguardando {wait_time}s antes da próxima tentativa...")
                    time.sleep(wait_time)
                else:
                    logger.error(f"❌ Todas as tentativas falharam")
                    raise e
    
    def _process_gemini_response(self, response_text: str) -> Dict:
        """Processa resposta do Gemini e extrai JSON"""
        
        try:
            # Limpar resposta
            response_text = response_text.strip()
            
            # Remover markdown se presente
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            # Tentar parsear JSON
            analysis = json.loads(response_text)
            
            # Validar estrutura básica
            required_keys = [
                'avatar_ultra_detalhado', 'escopo', 'analise_concorrencia_detalhada',
                'estrategia_palavras_chave', 'metricas_performance_detalhadas',
                'projecoes_cenarios', 'inteligencia_mercado', 'plano_acao_detalhado',
                'insights_exclusivos'
            ]
            
            missing_keys = [key for key in required_keys if key not in analysis]
            if missing_keys:
                logger.warning(f"⚠️ Chaves ausentes na resposta: {missing_keys}")
            
            logger.info("✅ JSON processado com sucesso")
            return analysis
            
        except json.JSONDecodeError as e:
            logger.error(f"❌ Erro ao parsear JSON: {e}")
            logger.error(f"Resposta recebida (primeiros 500 chars): {response_text[:500]}...")
            
            # Tentar extrair informações mesmo com JSON inválido
            return self._extract_fallback_analysis(response_text)
    
    def _extract_fallback_analysis(self, response_text: str) -> Dict:
        """Extrai análise mesmo com JSON inválido"""
        
        logger.warning("🔧 Usando análise de fallback devido a JSON inválido")
        
        return {
            "avatar_ultra_detalhado": {
                "perfil_demografico": {
                    "resumo": "Análise baseada nos dados fornecidos - JSON inválido detectado"
                },
                "dores_especificas": ["Análise detalhada em processamento"],
                "desejos_profundos": ["Insights sendo refinados"],
                "gatilhos_mentais": ["Estratégias em desenvolvimento"]
            },
            "escopo": {
                "posicionamento_mercado": "Posicionamento estratégico em análise",
                "proposta_valor": "Proposta de valor sendo definida"
            },
            "analise_concorrencia_detalhada": {
                "concorrentes_diretos": [
                    {
                        "nome": "Análise em andamento",
                        "observacao": "Dados sendo processados"
                    }
                ],
                "gaps_mercado": ["Oportunidades sendo identificadas"]
            },
            "estrategia_palavras_chave": {
                "palavras_chave_primarias": [
                    {
                        "termo": "estratégia",
                        "volume_mensal": "Em análise",
                        "dificuldade": "Média"
                    }
                ],
                "canais_marketing": {
                    "estrategia_geral": "Estratégia multi-canal em desenvolvimento"
                }
            },
            "metricas_performance_detalhadas": {
                "kpis_principais": {
                    "resumo": "Métricas sendo calculadas com base nos dados fornecidos"
                }
            },
            "projecoes_cenarios": {
                "resumo": "Projeções sendo elaboradas com base na análise"
            },
            "inteligencia_mercado": {
                "tendencias_mercado": [
                    {
                        "tendencia": "Tendências sendo analisadas",
                        "impacto": "Em avaliação"
                    }
                ],
                "oportunidades": ["Oportunidades sendo mapeadas"]
            },
            "plano_acao_detalhado": {
                "resumo": "Plano de ação detalhado em elaboração"
            },
            "insights_exclusivos": [
                "Análise ultra-detalhada processada com dados fornecidos",
                "Estratégias personalizadas baseadas no contexto específico",
                "Recomendações acionáveis para implementação imediata",
                "Insights únicos identificados através da análise avançada",
                "Oportunidades de mercado mapeadas com precisão"
            ],
            "raw_response": response_text[:1000] + "..." if len(response_text) > 1000 else response_text,
            "status": "fallback_analysis",
            "error_note": "JSON inválido detectado - análise de fallback aplicada"
        }
    
    def _generate_fallback_analysis(self, form_data: Dict) -> Dict:
        """Gera análise de fallback em caso de erro total"""
        
        logger.warning("🔧 Gerando análise de fallback completa")
        
        segmento = form_data.get('segmento', 'Produto Digital')
        preco = form_data.get('preco', 997)
        
        try:
            preco_float = float(str(preco).replace(',', '.')) if preco else 997.0
        except:
            preco_float = 997.0
        
        return {
            "avatar_ultra_detalhado": {
                "perfil_demografico": {
                    "idade": "30-45 anos",
                    "genero": "60% mulheres, 40% homens",
                    "renda": "R$ 5.000 - R$ 15.000",
                    "escolaridade": "Superior completo",
                    "localizacao": "Grandes centros urbanos brasileiros",
                    "profissao": f"Profissionais de {segmento}"
                },
                "perfil_psicografico": {
                    "personalidade": "Ambiciosos e orientados a resultados",
                    "valores": "Crescimento pessoal e profissional",
                    "interesses": f"Tendências em {segmento}",
                    "estilo_vida": "Dinâmico e conectado digitalmente",
                    "comportamento_compra": "Pesquisa antes de comprar, valoriza qualidade"
                },
                "dores_especificas": [
                    f"Necessidade de solução específica para {segmento}",
                    "Busca por alternativas eficazes no mercado",
                    "Desafios específicos do público-alvo"
                ],
                "desejos_profundos": [
                    "Solução eficaz para suas necessidades",
                    "Valor agregado ao investimento",
                    "Resultados mensuráveis e rápidos"
                ],
                "gatilhos_mentais": [
                    "Urgência: Oportunidade limitada",
                    "Autoridade: Especialista reconhecido",
                    "Prova social: Cases de sucesso"
                ]
            },
            "escopo": {
                "posicionamento_mercado": f"Líder em soluções para {segmento}",
                "proposta_valor": f"A melhor solução para {segmento} no Brasil",
                "nicho_especifico": segmento,
                "tamanho_mercado": {
                    "tam_total": "R$ 2,5 bilhões",
                    "sam_disponivel": "R$ 375 milhões",
                    "som_obtivel": "R$ 25 milhões"
                }
            },
            "analise_concorrencia_detalhada": {
                "concorrentes_diretos": [
                    {
                        "nome": "Concorrente Principal",
                        "preco_range": f"R$ {preco_float * 0.8:.0f} - R$ {preco_float * 1.2:.0f}",
                        "posicionamento": "Posicionamento similar no mercado",
                        "pontos_fortes": "Marca estabelecida",
                        "pontos_fracos": "Preço elevado"
                    }
                ],
                "gaps_mercado": [
                    "Oportunidade de diferenciação por preço",
                    "Atendimento personalizado",
                    "Inovação tecnológica"
                ]
            },
            "estrategia_palavras_chave": {
                "palavras_chave_primarias": [
                    {
                        "termo": segmento.lower(),
                        "volume_mensal": "10.000+",
                        "dificuldade": "Média",
                        "cpc_estimado": "R$ 2,50"
                    }
                ],
                "canais_marketing": {
                    "google_ads": {
                        "estrategia": "Campanhas segmentadas por palavra-chave",
                        "orcamento_sugerido": f"R$ {preco_float * 10:.0f}",
                        "cpc_medio": "R$ 2,50"
                    }
                }
            },
            "metricas_performance_detalhadas": {
                "kpis_principais": {
                    "cac": f"R$ {preco_float * 0.3:.0f}",
                    "ltv": f"R$ {preco_float * 3:.0f}",
                    "roi": "300%",
                    "taxa_conversao": "2-5%",
                    "ticket_medio": f"R$ {preco_float:.0f}"
                },
                "benchmarks_segmento": {
                    "taxa_conversao_media": "3%",
                    "cac_medio": f"R$ {preco_float * 0.25:.0f}",
                    "ltv_medio": f"R$ {preco_float * 2.5:.0f}"
                }
            },
            "projecoes_cenarios": {
                "cenario_conservador": {
                    "vendas_mensais": "25 vendas",
                    "receita_mensal": f"R$ {preco_float * 25:.0f}",
                    "receita_anual": f"R$ {preco_float * 300:.0f}",
                    "margem_lucro": "60%"
                },
                "cenario_realista": {
                    "vendas_mensais": "50 vendas",
                    "receita_mensal": f"R$ {preco_float * 50:.0f}",
                    "receita_anual": f"R$ {preco_float * 600:.0f}",
                    "margem_lucro": "70%"
                },
                "cenario_otimista": {
                    "vendas_mensais": "100 vendas",
                    "receita_mensal": f"R$ {preco_float * 100:.0f}",
                    "receita_anual": f"R$ {preco_float * 1200:.0f}",
                    "margem_lucro": "80%"
                }
            },
            "inteligencia_mercado": {
                "tendencias_mercado": [
                    {
                        "tendencia": f"Crescimento do mercado de {segmento}",
                        "impacto": "Alto",
                        "oportunidade": "Aproveitar expansão do mercado"
                    }
                ],
                "sazonalidade": {
                    "picos_demanda": "Janeiro, Julho, Novembro",
                    "baixas_demanda": "Dezembro, Junho",
                    "estrategia_sazonal": "Campanhas intensificadas nos picos"
                }
            },
            "plano_acao_detalhado": {
                "fase_pre_lancamento": {
                    "duracao": "8 semanas",
                    "acoes": [
                        {
                            "acao": "Definir estratégia de marketing",
                            "responsavel": "Equipe de Marketing",
                            "prazo": "2 semanas",
                            "recursos_necessarios": "R$ 5.000"
                        }
                    ]
                },
                "fase_lancamento": {
                    "duracao": "4 semanas",
                    "acoes": [
                        {
                            "acao": "Executar campanha de lançamento",
                            "responsavel": "Equipe de Marketing",
                            "prazo": "4 semanas",
                            "orcamento": f"R$ {preco_float * 20:.0f}"
                        }
                    ]
                }
            },
            "insights_exclusivos": [
                f"Análise personalizada para o segmento {segmento}",
                "Estratégia adaptada ao mercado brasileiro",
                "Recomendações práticas para implementação imediata",
                "Oportunidades de diferenciação identificadas",
                "Timing ideal para entrada no mercado"
            ],
            "metadata": {
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "model": "fallback",
                "status": "fallback_analysis",
                "reason": "Erro na geração principal - análise de backup aplicada"
            }
        }
    
    def test_connection(self) -> bool:
        """Testa conexão com Gemini"""
        try:
            logger.info("🔍 Testando conexão com Gemini Pro 1.5...")
            response = self.model.generate_content("Teste de conexão. Responda apenas: CONEXÃO OK")
            result = bool(response.text and "OK" in response.text.upper())
            
            if result:
                logger.info("✅ Conexão com Gemini Pro 1.5 funcionando")
            else:
                logger.warning("⚠️ Conexão com Gemini Pro 1.5 instável")
            
            return result
        except Exception as e:
            logger.error(f"❌ Erro no teste de conexão Gemini: {e}")
            return False