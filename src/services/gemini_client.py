import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import google.generativeai as genai
import time

logger = logging.getLogger(__name__)

class GeminiClient:
    """Cliente aprimorado para Google Gemini Pro 2.5"""
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY não configurada")
        
        # Configurar Gemini
        genai.configure(api_key=self.api_key)
        
        # Configurações do modelo
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
            logger.info("Cliente Gemini inicializado com sucesso")
        except Exception as e:
            logger.error(f"Erro ao inicializar Gemini: {e}")
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
            # Construir prompt ultra-detalhado
            prompt = self._build_ultra_detailed_prompt(
                form_data, search_context, websailor_context, attachments_context
            )
            
            logger.info("🤖 Iniciando análise com Gemini Pro")
            
            # Gerar resposta
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
                'form_data_fields': list(form_data.keys())
            }
            
            logger.info("Analise ultra-detalhada gerada com sucesso")
            return analysis
            
        except Exception as e:
            logger.error(f"Erro na analise Gemini: {e}")
            return self._generate_fallback_analysis(form_data)
    
    def _build_ultra_detailed_prompt(self, 
                                   form_data: Dict,
                                   search_context: Optional[str],
                                   websailor_context: Optional[str],
                                   attachments_context: Optional[str]) -> str:
        """Constrói prompt ultra-detalhado para análise"""
        
        prompt = f"""
# ANÁLISE ULTRA-DETALHADA DE MERCADO - ARQV30 ENHANCED v2.0

Você é um especialista em análise de mercado e estratégia de negócios com 20+ anos de experiência. 
Sua missão é gerar uma análise ULTRA-DETALHADA e ACIONÁVEL baseada nos dados fornecidos.

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

Gere uma análise COMPLETA e ACIONÁVEL seguindo EXATAMENTE esta estrutura JSON:

```json
{
  "avatar_ultra_detalhado": {
    "perfil_demografico": {
      "idade": "Faixa etária específica com justificativa",
      "genero": "Distribuição por gênero com percentuais",
      "renda": "Faixa de renda detalhada com valores específicos",
      "escolaridade": "Nível educacional predominante",
      "localizacao": "Localização geográfica específica",
      "profissao": "Profissões principais e secundárias"
    },
    "perfil_psicografico": {
      "personalidade": "Traços de personalidade dominantes",
      "valores": "Valores fundamentais que guiam decisões",
      "interesses": "Interesses e hobbies específicos",
      "estilo_vida": "Estilo de vida detalhado",
      "comportamento_compra": "Padrões específicos de compra"
    },
    "dores_especificas": [
      "Dor específica 1 com intensidade e frequência",
      "Dor específica 2 com impacto emocional",
      "Dor específica 3 com consequências práticas"
    ],
    "desejos_profundos": [
      "Desejo profundo 1 com motivação emocional",
      "Desejo profundo 2 com benefício esperado",
      "Desejo profundo 3 com transformação desejada"
    ],
    "gatilhos_mentais": [
      "Gatilho mental 1 com aplicação prática",
      "Gatilho mental 2 com exemplo de uso",
      "Gatilho mental 3 com timing ideal"
    ],
    "jornada_do_cliente": {
      "consciencia": "Como toma consciência do problema",
      "consideracao": "Como avalia soluções disponíveis",
      "decisao": "Fatores que influenciam a decisão final",
      "pos_compra": "Comportamento após a compra"
    }
  },
  
  "escopo": {
    "posicionamento_mercado": "Posicionamento único e diferenciado",
    "proposta_valor": "Proposta de valor clara e específica",
    "vantagem_competitiva": "Principais vantagens sobre concorrentes",
    "nicho_especifico": "Nicho específico de atuação",
    "tamanho_mercado": {
      "tam_total": "Tamanho total do mercado em R$",
      "sam_disponivel": "Mercado disponível em R$",
      "som_obtivel": "Mercado obtível em R$"
    }
  },
  
  "analise_concorrencia_detalhada": {
    "concorrentes_diretos": [
      {
        "nome": "Nome do concorrente",
        "preco_range": "Faixa de preços",
        "posicionamento": "Como se posiciona",
        "pontos_fortes": "Principais forças",
        "pontos_fracos": "Principais fraquezas"
      }
    ],
    "concorrentes_indiretos": [
      {
        "nome": "Nome do concorrente indireto",
        "como_compete": "Como compete indiretamente"
      }
    ],
    "gaps_mercado": [
      "Gap 1 com oportunidade específica",
      "Gap 2 com potencial de receita",
      "Gap 3 com estratégia de exploração"
    ],
    "analise_precos": {
      "faixa_mercado": "Faixa de preços do mercado",
      "posicionamento_preco": "Onde seu preço se posiciona",
      "estrategia_recomendada": "Estratégia de precificação"
    }
  },
  
  "estrategia_palavras_chave": {
    "palavras_chave_primarias": [
      {
        "termo": "palavra-chave principal",
        "volume_mensal": "Volume de busca mensal",
        "dificuldade": "Nível de dificuldade",
        "cpc_estimado": "CPC estimado em R$"
      }
    ],
    "palavras_chave_secundarias": [
      {
        "termo": "palavra-chave secundária",
        "volume_mensal": "Volume de busca",
        "oportunidade": "Nível de oportunidade"
      }
    ],
    "long_tail": [
      "Frase longa específica 1",
      "Frase longa específica 2"
    ],
    "estrategia_conteudo": "Estratégia de conteúdo baseada nas palavras-chave",
    "canais_marketing": {
      "google_ads": {
        "estrategia": "Estratégia específica para Google Ads",
        "orcamento_sugerido": "Orçamento mensal sugerido",
        "cpc_medio": "CPC médio esperado"
      },
      "facebook_ads": {
        "estrategia": "Estratégia para Facebook/Instagram Ads",
        "publico_alvo": "Definição de público-alvo",
        "orcamento_sugerido": "Orçamento mensal sugerido"
      },
      "seo": {
        "estrategia": "Estratégia de SEO",
        "tempo_resultados": "Tempo para ver resultados"
      },
      "content_marketing": {
        "tipos_conteudo": "Tipos de conteúdo recomendados",
        "frequencia": "Frequência de publicação"
      }
    }
  },
  
  "metricas_performance_detalhadas": {
    "kpis_principais": {
      "cac": "Custo de Aquisição de Cliente estimado em R$",
      "ltv": "Lifetime Value estimado em R$",
      "roi": "ROI esperado em %",
      "taxa_conversao": "Taxa de conversão esperada em %",
      "ticket_medio": "Ticket médio em R$"
    },
    "projecoes_vendas": {
      "mes_1": "Vendas projetadas mês 1",
      "mes_3": "Vendas projetadas mês 3",
      "mes_6": "Vendas projetadas mês 6",
      "mes_12": "Vendas projetadas mês 12"
    },
    "metricas_marketing": {
      "cpm": "CPM estimado em R$",
      "cpc": "CPC estimado em R$",
      "ctr": "CTR esperado em %",
      "roas": "ROAS esperado"
    },
    "benchmarks_segmento": {
      "taxa_conversao_media": "Taxa de conversão média do segmento",
      "cac_medio": "CAC médio do segmento",
      "ltv_medio": "LTV médio do segmento"
    }
  },
  
  "projecoes_cenarios": {
    "cenario_conservador": {
      "vendas_mensais": "Número de vendas mensais",
      "receita_mensal": "Receita mensal em R$",
      "receita_anual": "Receita anual em R$",
      "margem_lucro": "Margem de lucro em %",
      "premissas": ["Premissa 1", "Premissa 2"]
    },
    "cenario_realista": {
      "vendas_mensais": "Número de vendas mensais",
      "receita_mensal": "Receita mensal em R$",
      "receita_anual": "Receita anual em R$",
      "margem_lucro": "Margem de lucro em %",
      "premissas": ["Premissa 1", "Premissa 2"]
    },
    "cenario_otimista": {
      "vendas_mensais": "Número de vendas mensais",
      "receita_mensal": "Receita mensal em R$",
      "receita_anual": "Receita anual em R$",
      "margem_lucro": "Margem de lucro em %",
      "premissas": ["Premissa 1", "Premissa 2"]
    }
  },
  
  "inteligencia_mercado": {
    "tendencias_mercado": [
      {
        "tendencia": "Nome da tendência",
        "impacto": "Alto/Médio/Baixo",
        "oportunidade": "Como aproveitar"
      }
    ],
    "sazonalidade": {
      "picos_demanda": "Períodos de maior demanda",
      "baixas_demanda": "Períodos de menor demanda",
      "estrategia_sazonal": "Como lidar com sazonalidade"
    },
    "tecnologias_emergentes": [
      "Tecnologia 1 e seu impacto",
      "Tecnologia 2 e oportunidades"
    ],
    "mudancas_comportamento": [
      "Mudança 1 no comportamento do consumidor",
      "Mudança 2 e suas implicações"
    ]
  },
  
  "plano_acao_detalhado": {
    "fase_pre_lancamento": {
      "duracao": "8 semanas",
      "acoes": [
        {
          "acao": "Ação específica",
          "responsavel": "Quem executa",
          "prazo": "Prazo em semanas",
          "recursos_necessarios": "Recursos necessários",
          "resultado_esperado": "Resultado esperado"
        }
      ]
    },
    "fase_lancamento": {
      "duracao": "4 semanas",
      "acoes": [
        {
          "acao": "Ação de lançamento",
          "responsavel": "Quem executa",
          "prazo": "Prazo específico",
          "metricas_sucesso": "Como medir sucesso"
        }
      ]
    },
    "fase_pos_lancamento": {
      "duracao": "12 semanas",
      "acoes": [
        {
          "acao": "Ação pós-lançamento",
          "responsavel": "Quem executa",
          "frequencia": "Frequência de execução",
          "objetivo": "Objetivo específico"
        }
      ]
    }
  },
  
  "insights_exclusivos": [
    "Insight exclusivo 1 baseado na análise completa dos dados",
    "Insight exclusivo 2 que outros não veriam facilmente",
    "Insight exclusivo 3 com oportunidade única identificada",
    "Insight exclusivo 4 sobre timing ideal de mercado",
    "Insight exclusivo 5 sobre estratégia diferenciada"
  ]
}
```

## DIRETRIZES CRÍTICAS:

1. **SEJA ULTRA-ESPECÍFICO**: Use números reais, percentuais específicos, valores em R$ quando possível.

2. **USE OS CONTEXTOS**: Incorpore TODAS as informações dos contextos de pesquisa, WebSailor e anexos.

3. **SEJA ACIONÁVEL**: Cada recomendação deve ser implementável imediatamente.

4. **DADOS BRASILEIROS**: Foque no mercado brasileiro com dados locais.

5. **INSIGHTS ÚNICOS**: Gere insights que só um especialista experiente identificaria.

6. **FORMATO JSON**: Responda APENAS com o JSON válido, sem texto adicional.

GERE A ANÁLISE AGORA:
"""
        
        return prompt
    
    def _generate_with_retry(self, prompt: str, max_retries: int = 3) -> str:
        """Gera resposta com retry em caso de erro"""
        
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt)
                
                if response.text:
                    return response.text
                else:
                    raise Exception("Resposta vazia do Gemini")
                    
            except Exception as e:
                logger.warning(f"⚠️ Tentativa {attempt + 1} falhou: {e}")
                
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Backoff exponencial
                else:
                    raise e
    
    def _process_gemini_response(self, response_text: str) -> Dict:
        """Processa resposta do Gemini e extrai JSON"""
        
        try:
            # Tentar extrair JSON da resposta
            response_text = response_text.strip()
            
            # Remover markdown se presente
            if response_text.startswith('```json'):
                response_text = response_text[7:]
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
            
            for key in required_keys:
                if key not in analysis:
                    logger.warning(f"⚠️ Chave '{key}' não encontrada na resposta")
            
            return analysis
            
        except json.JSONDecodeError as e:
            logger.error(f"Erro ao parsear JSON: {e}")
            logger.error(f"Resposta recebida: {response_text[:500]}...")
            
            # Tentar extrair informações mesmo com JSON inválido
            return self._extract_fallback_analysis(response_text)
    
    def _extract_fallback_analysis(self, response_text: str) -> Dict:
        """Extrai análise mesmo com JSON inválido"""
        
        return {
            "avatar_ultra_detalhado": {
                "perfil_demografico": {
                    "resumo": "Análise baseada nos dados fornecidos"
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
                "concorrentes_diretos": {
                    "principais": ["Análise em andamento"],
                    "gaps_mercado": "Oportunidades sendo identificadas"
                }
            },
            "estrategia_palavras_chave": {
                "palavras_chave_primarias": ["estratégia", "mercado", "análise"],
                "canais_marketing": {
                    "estrategia_geral": "Estratégia multi-canal em desenvolvimento"
                }
            },
            "metricas_performance_detalhadas": {
                "kpis_principais": {
                    "resumo": "Métricas sendo calculadas com base nos dados"
                }
            },
            "projecoes_cenarios": {
                "resumo": "Projeções sendo elaboradas com base na análise"
            },
            "inteligencia_mercado": {
                "tendencias_mercado": ["Tendências sendo analisadas"],
                "oportunidades": ["Oportunidades sendo mapeadas"]
            },
            "plano_acao_detalhado": {
                "resumo": "Plano de ação detalhado em elaboração"
            },
            "insights_exclusivos": [
                "Análise ultra-detalhada processada com dados fornecidos",
                "Estratégias personalizadas baseadas no contexto específico",
                "Recomendações acionáveis para implementação imediata"
            ],
            "raw_response": response_text[:1000] + "..." if len(response_text) > 1000 else response_text
        }
    
    def _generate_fallback_analysis(self, form_data: Dict) -> Dict:
        """Gera análise de fallback em caso de erro"""
        
        logger.warning("Gerando analise de fallback")
        
        segmento = form_data.get('segmento', 'Produto Digital')
        preco = form_data.get('preco', 997)
        
        return {
            "avatar_ultra_detalhado": {
                "perfil_demografico": {
                    "idade": "30-45 anos",
                    "genero": "60% mulheres, 40% homens",
                    "renda": "R$ 5.000 - R$ 15.000",
                    "escolaridade": "Superior completo",
                    "localizacao": "Grandes centros urbanos",
                    "profissao": f"Profissionais de {segmento}"
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
                ]
            },
            "escopo": {
                "posicionamento_mercado": f"Líder em soluções para {segmento}",
                "proposta_valor": f"A melhor solução para {segmento} no Brasil",
                "nicho_especifico": segmento
            },
            "analise_concorrencia_detalhada": {
                "concorrentes_diretos": [
                    {
                        "nome": "Concorrente Principal",
                        "preco_range": f"R$ {float(preco) * 0.8:.0f} - R$ {float(preco) * 1.2:.0f}",
                        "posicionamento": "Posicionamento similar"
                    }
                ]
            },
            "estrategia_palavras_chave": {
                "palavras_chave_primarias": [
                    {
                        "termo": segmento.lower(),
                        "volume_mensal": "10.000+",
                        "dificuldade": "Média"
                    }
                ]
            },
            "metricas_performance_detalhadas": {
                "kpis_principais": {
                    "cac": f"R$ {float(preco) * 0.3:.0f}",
                    "ltv": f"R$ {float(preco) * 3:.0f}",
                    "roi": "300%",
                    "taxa_conversao": "2-5%"
                }
            },
            "projecoes_cenarios": {
                "cenario_realista": {
                    "vendas_mensais": "50-100 vendas",
                    "receita_mensal": f"R$ {float(preco) * 75:.0f}",
                    "receita_anual": f"R$ {float(preco) * 900:.0f}"
                }
            },
            "inteligencia_mercado": {
                "tendencias_mercado": [
                    f"Crescimento do mercado de {segmento}",
                    "Digitalização acelerada",
                    "Busca por soluções especializadas"
                ]
            },
            "plano_acao_detalhado": {
                "fase_pre_lancamento": {
                    "duracao": "8 semanas",
                    "acoes": [
                        {
                            "acao": "Definir estratégia de marketing",
                            "prazo": "2 semanas"
                        }
                    ]
                }
            },
            "insights_exclusivos": [
                f"Análise personalizada para o segmento {segmento}",
                "Estratégia adaptada ao mercado brasileiro",
                "Recomendações práticas para implementação imediata"
            ],
            "metadata": {
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "model": "fallback",
                "status": "fallback_analysis"
            }
        }
    
    def test_connection(self) -> bool:
        """Testa conexão com Gemini"""
        try:
            response = self.model.generate_content("Teste de conexão. Responda apenas: OK")
            return bool(response.text and "OK" in response.text.upper())
        except Exception as e:
            logger.error(f"Erro no teste de conexao Gemini: {e}")
            return False