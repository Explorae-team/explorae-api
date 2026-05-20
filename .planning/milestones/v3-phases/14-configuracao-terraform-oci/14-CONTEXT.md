# Context - Phase 14: Configuração de Infraestrutura (Terraform/OCI)

## 📋 Objetivo
Configurar e validar o provisionamento automatizado de um servidor Always Free na Oracle Cloud Infrastructure (OCI) utilizando Terraform, garantindo segurança das chaves e versionamento correto da lógica.

## 🛠 Decisões Técnicas

### 1. Ferramenta e Versão
- **Ferramenta:** Terraform (HashiCorp).
- **Provedor:** OCI (Oracle Cloud Infrastructure).
- **Instalação:** Via repositório oficial da HashiCorp para sistemas baseados em Ubuntu/Debian (Linux Mint).

### 2. Gestão de Estado (State)
- **Tipo:** Local (`terraform.tfstate`).
- **Decisão:** Manter local por enquanto para simplicidade inicial, com plano de migrar para backend remoto (OCI Object Storage) no futuro.

### 3. Segurança e Git
- **Proteção:** Chaves `.pem` e arquivos `.tfvars` já estão no `.gitignore` global/root.
- **Estrutura:** Trackear `main.tf` e `variables.tf`.
- **Prevenção:** Adicionar um `.gitignore` local na pasta `terraform/` para reforçar a segurança e evitar leaks acidentais de arquivos de estado ou logs.

### 4. Configurações OCI
- **AD:** `otYZ:SA-SAOPAULO-1-AD-1` (confirmado pelo usuário).
- **Recursos:** VM Always Free (Ampere ARM), 2 OCPUs, 12GB RAM (ou conforme limites da conta).
- **Acesso:** Chave SSH configurada via variável.

## ⚠️ Gray Areas / Riscos
- **Caminhos de Arquivo:** O `private_key_path` no `terraform.tfvars` assume execução da raiz do projeto. Caso execute de dentro da pasta `terraform/`, será necessário ajuste.
- **Limites de Cota:** Erros de "Out of capacity" são comuns em contas Always Free na região de SP. O Terraform pode falhar se não houver recursos disponíveis no momento.

## 📅 Próximos Passos
1. Instalar Terraform no sistema.
2. Criar `.gitignore` local em `terraform/`.
3. Inicializar (`terraform init`) e validar (`terraform validate`).
4. Realizar o `plan` e `apply` (manual) para testar o provisionamento.
5. Versionar arquivos de lógica no Git.
