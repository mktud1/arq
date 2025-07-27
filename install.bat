@echo off
echo ========================================
echo ARQV30 Enhanced v2.0 - Instalacao Completa
echo ========================================
echo.

REM Verificar se Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Por favor, instale Python 3.11+ de https://python.org
    echo.
    pause
    exit /b 1
)

echo ✓ Python encontrado
python --version

REM Verificar se pip esta disponivel
pip --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: pip nao encontrado!
    echo Por favor, reinstale Python com pip incluido
    echo.
    pause
    exit /b 1
)

echo ✓ pip encontrado
pip --version

echo.
echo Instalando dependencias do ARQV30 Enhanced...
echo.

REM Atualizar pip
echo [1/8] Atualizando pip...
python -m pip install --upgrade pip

REM Instalar dependencias principais
echo.
echo [2/8] Instalando framework web...
pip install Flask==2.3.3
pip install Flask-CORS==4.0.0
pip install Flask-SQLAlchemy==3.1.1
pip install Werkzeug==2.3.7

REM Instalar banco de dados
echo.
echo [3/8] Instalando conectores de banco...
pip install supabase==1.0.4
pip install psycopg2-binary==2.9.7

REM Instalar IA e APIs
echo.
echo [4/8] Instalando integracao com IA...
pip install google-generativeai==0.3.2
pip install openai>=1.0.0
pip install tiktoken>=0.5.0

REM Instalar processamento de dados
echo.
echo [5/8] Instalando processamento de dados...
pip install requests==2.31.0
pip install python-dotenv==1.0.0
pip install pandas>=2.2.0
pip install openpyxl>=3.1.2
pip install Pillow>=10.2.0

REM Instalar processamento de documentos
echo.
echo [6/8] Instalando processamento de documentos...
pip install python-docx>=0.8.11
pip install PyPDF2>=3.0.1
pip install pdfplumber>=0.10.0

REM Instalar geracao de PDF
echo.
echo [7/8] Instalando geracao de PDF...
pip install reportlab==4.0.4
pip install fpdf2==2.7.6

REM Instalar web scraping e utilitarios
echo.
echo [8/8] Instalando utilitarios...
pip install beautifulsoup4>=4.12.2
pip install markdown>=3.5.1
pip install gunicorn==21.2.0

echo.
echo ========================================
echo Instalacao concluida com sucesso!
echo ========================================
echo.

REM Verificar instalacao
echo Verificando instalacao...
python -c "import flask; print('✓ Flask:', flask.__version__)" 2>nul || echo "❌ Flask nao instalado"
python -c "import google.generativeai; print('✓ Google Generative AI instalado')" 2>nul || echo "❌ Gemini nao instalado"
python -c "import supabase; print('✓ Supabase instalado')" 2>nul || echo "❌ Supabase nao instalado"
python -c "import pandas; print('✓ Pandas:', pandas.__version__)" 2>nul || echo "❌ Pandas nao instalado"
python -c "import requests; print('✓ Requests:', requests.__version__)" 2>nul || echo "❌ Requests nao instalado"

echo.
echo Criando estrutura de diretorios...
if not exist "src\static\css" mkdir src\static\css
if not exist "src\static\js" mkdir src\static\js
if not exist "src\templates" mkdir src\templates
if not exist "uploads" mkdir uploads

echo.
REM Verificar se arquivo .env existe
if not exist ".env" (
    echo CRIANDO arquivo .env com configuracoes...
    echo.
    
    (
    echo # ARQV30 Enhanced v2.0 - Configuracao Completa
    echo # Configure suas chaves de API abaixo
    echo.
    echo # === CONFIGURACOES BASICAS ===
    echo FLASK_ENV=development
    echo SECRET_KEY=FDGD851F8DGhgfhgf_fdsfewn543534_arqv30_enhanced_2024
    echo CORS_ORIGINS=*
    echo HOST=0.0.0.0
    echo PORT=5000
    echo.
    echo # === BANCO DE DADOS SUPABASE ===
    echo SUPABASE_URL=https://albyamqjdopihijsderu.supabase.co
    echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYnlhbXFqZG9waWhpanNkZXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTgzMTYsImV4cCI6MjA2Njk5NDMxNn0.n0fjjyDF7LZYa6MD2ZZ5tUVjEieNDtb_rbvfjNHS_Rg
    echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYnlhbXFqZG9waWhpanNkZXJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQxODMxNiwiZXhwIjoyMDY2OTk0MzE2fQ.muvh9Xxvb2e30d4fwiO8m2cL5x5KI5-VHO0bNd9F4hg
    echo DATABASE_URL=postgresql://postgres.albyamqjdopihijsderu:[9pfVX8TLcxXubcVv]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
    echo.
    echo # === INTELIGENCIA ARTIFICIAL ===
    echo GEMINI_API_KEY=AIzaSyBtLYVXxG61tu0CZ4uoLcO8pTWZuGteUFc
    echo DEEPSEEK_API_KEY=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
    echo.
    echo # === CONFIGURACOES AVANCADAS ===
    echo MAX_LLM_CALL_PER_RUN=40
    echo MAX_LENGTH=31744
    echo PYTHON_VERSION=3.11.0
    echo.
    echo # === WEBSAILOR ^(OPCIONAL^) ===
    echo # GOOGLE_SEARCH_KEY=sua_chave_google_search
    echo # JINA_API_KEY=sua_chave_jina
    echo # WEBSAILOR_ENABLED=true
    ) > .env
    
    echo ✓ Arquivo .env criado com configuracoes padrao
    echo   IMPORTANTE: Edite o .env se necessario com suas chaves
)

echo.
echo ========================================
echo INSTALACAO COMPLETA!
echo ========================================
echo.
echo Proximos passos:
echo 1. Execute: run.bat
echo 2. Acesse: http://localhost:5000
echo 3. Comece sua primeira analise!
echo.
echo ARQV30 Enhanced v2.0 pronto para uso!
echo.
pause