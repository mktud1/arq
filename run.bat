@echo off
echo ========================================
echo ARQV30 Enhanced v2.0 - Iniciando Sistema
echo ========================================
echo.

REM Verificar se estamos no diretorio correto
if not exist "src" (
    echo ERRO: Diretorio 'src' nao encontrado!
    echo Execute este script a partir da raiz do projeto
    echo.
    pause
    exit /b 1
)

REM Verificar se Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Execute install.bat primeiro para instalar dependencias
    echo.
    pause
    exit /b 1
)

echo ✓ Python encontrado
python --version

REM Verificar se arquivo .env existe
if not exist ".env" (
    echo ERRO: Arquivo .env nao encontrado!
    echo Execute install.bat primeiro para criar configuracao
    echo.
    pause
    exit /b 1
)

echo ✓ Arquivo .env encontrado

REM Definir variaveis de ambiente
set FLASK_APP=src/run.py
set FLASK_ENV=development
set PYTHONPATH=%CD%

echo.
echo Carregando configuracoes...
echo ✓ FLASK_APP: %FLASK_APP%
echo ✓ FLASK_ENV: %FLASK_ENV%
echo ✓ PYTHONPATH: %PYTHONPATH%

REM Verificar dependencias criticas
echo.
echo Verificando dependencias criticas...
python -c "import flask" 2>nul
if errorlevel 1 (
    echo ERRO: Flask nao instalado!
    echo Execute install.bat primeiro
    pause
    exit /b 1
)
echo ✓ Flask OK

python -c "import google.generativeai" 2>nul
if errorlevel 1 (
    echo AVISO: Google Generative AI nao instalado
    echo Algumas funcionalidades podem nao funcionar
) else (
    echo ✓ Gemini Pro OK
)

python -c "import supabase" 2>nul
if errorlevel 1 (
    echo AVISO: Supabase nao instalado
    echo Banco de dados pode nao funcionar
) else (
    echo ✓ Supabase OK
)

echo.
echo Verificando estrutura de arquivos...
if not exist "src\run.py" (
    echo ERRO: Arquivo principal src\run.py nao encontrado!
    pause
    exit /b 1
)
echo ✓ Arquivo principal OK

if not exist "src\static" mkdir src\static
if not exist "src\templates" mkdir src\templates
echo ✓ Estrutura de diretorios OK

echo.
echo ========================================
echo Iniciando ARQV30 Enhanced v2.0...
echo ========================================
echo.
echo 🚀 Sistema iniciando...
echo 🌐 Servidor sera executado em: http://localhost:5000
echo 📊 Interface moderna com Dark Neumorphism 3D
echo 🤖 IA Gemini Pro 2.5 integrada
echo 📈 Analise ultra-detalhada de mercado
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.

REM Aguardar um momento e abrir navegador
echo Aguarde 3 segundos para abrir o navegador...
timeout /t 3 /nobreak >nul
start http://localhost:5000

REM Iniciar aplicacao Flask
cd src
python run.py

REM Se chegou aqui, o servidor foi parado
echo.
echo ========================================
echo ARQV30 Enhanced v2.0 - Servidor Parado
echo ========================================
echo.
echo Obrigado por usar o ARQV30 Enhanced!
echo.
pause