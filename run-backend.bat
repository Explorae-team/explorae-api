@echo off
cls
echo ==================================================
echo         Explorae - Inicializador do Backend
echo ==================================================
echo.

:: Verificar se o Java esta instalado no sistema
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Java nao foi encontrado no seu PATH!
    echo Como voce acabou de formatar o computador, voce precisa:
    echo 1. Baixar e instalar o JDK 25 (Java 25).
    echo    Recomendado baixar do site do Adoptium (Eclipse Temurin) ou Oracle.
    echo 2. Fechar e reabrir os terminais e janelas para atualizar as variaveis.
    echo.
    pause
    exit /b
)

echo Escolha o perfil de banco de dados para rodar:
echo 1) Local Sandbox (Banco H2 em memoria - Sem instalacao necessaria)
echo 2) Postgres (Conectando a nuvem/local conforme arquivo backend/.env)
echo.
set /p opcao="Digite a opcao desejada (1 ou 2, depois pressione Enter): "

cd backend

if "%opcao%"=="2" (
    echo.
    echo [INFO] Iniciando backend com Postgres (Perfil padrao)...
    call mvnw.cmd spring-boot:run
) else (
    echo.
    echo [INFO] Iniciando backend com H2 (Perfil local em memoria)...
    call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
)

if %errorlevel% neq 0 (
    echo.
    echo [AVISO] O backend parou com codigo de erro %errorlevel%.
)

echo.
echo Processo finalizado.
pause
