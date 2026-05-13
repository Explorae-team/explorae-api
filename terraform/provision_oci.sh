#!/bin/bash

# Cores para o log
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando loop de provisionamento OCI (Always Free)...${NC}"

# Garante que estamos na pasta correta
cd "$(dirname "$0")"

while true; do
  echo -e "${YELLOW}[$(date +%T)] Tentando criar instância...${NC}"
  
  # Tenta rodar o apply sem pedir confirmação
  terraform apply -auto-approve
  
  # Verifica o resultado (0 = sucesso)
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCESSO! Instância criada com êxito em $(date).${NC}"
    # Opcional: Tocar um alerta sonoro se estiver no linux
    # paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null
    break
  else
    echo -e "${RED}❌ Falha (Capacidade esgotada ou erro temporário).${NC}"
    echo -e "${YELLOW}Aguardando 60 segundos para a próxima tentativa...${NC}"
    sleep 60
  fi
done
