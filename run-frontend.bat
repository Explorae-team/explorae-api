@echo off
cls
echo ==================================================
echo         Explorae - Inicializador do Frontend
echo ==================================================
echo.

:: Verificar se o Node/NPM esta instalado no sistema
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] NPM/Node.js nao foi encontrado no seu PATH!
    echo Como voce acabou de formatar o computador, certifique-se de:
    echo 1. Ter instalado o Node.js (versao LTS recomendada).
    echo 2. Reiniciar o computador ou o terminal/editor para que o Windows
    echo    atualize as variaveis de ambiente.
    echo.
    pause
    exit /b
)

cd frontend

:: Verifica se a pasta node_modules existe, senao instala
if not exist node_modules (
    echo [INFO] Pasta node_modules nao encontrada.
    echo [INFO] Instalando as dependencias do projeto (npm install)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao executar npm install.
        pause
        exit /b
    )
)

echo.
echo Escolha como deseja iniciar o Expo:
echo 1) Expo Go (Padrao / Metro Bundler na rede local)
echo 2) Expo Go com Tunnel (Se o celular estiver no 4G ou outra rede Wi-Fi)
echo 3) Versao Web (PWA para rodar no navegador)
echo.
set /p opcao="Digite a opcao desejada (1, 2 ou 3, depois pressione Enter): "

if "%opcao%"=="2" (
    echo.
    echo [INFO] Atualizando IP local na .env...
    call node scripts/update-ip.cjs
    echo [INFO] Iniciando com Tunnel...
    call npx expo start --tunnel
) else if "%opcao%"=="3" (
    echo.
    echo [INFO] Iniciando a versao Web...
    call npm run web
) else (
    echo.
    echo [INFO] Iniciando Expo Go padrao...
    call npm run start
)

if %errorlevel% neq 0 (
    echo.
    echo [AVISO] O processo do frontend terminou com codigo de erro %errorlevel%.
)

echo.
echo Processo finalizado.
pause
