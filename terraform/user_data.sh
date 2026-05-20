#!/bin/bash

# --- 1. Atualização do Sistema ---
dnf update -y

# --- 2. Instalação do Docker ---
dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Inicia e habilita o Docker
systemctl enable --now docker

# Adiciona o usuário padrão ao grupo docker
usermod -aG docker opc

# --- 3. Instalação do Git ---
dnf install -y git

# --- 4. Configuração do Firewall (Abrir portas 80, 443 e 8080) ---
# OCI instâncias vêm com iptables bloqueando quase tudo por padrão
firewall-offline-cmd --add-port=80/tcp
firewall-offline-cmd --add-port=443/tcp
firewall-offline-cmd --add-port=8080/tcp
systemctl restart firewalld

echo "Provisionamento concluído!"
