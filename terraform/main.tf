terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 4.0.0"
    }
  }
}

# --- 1. Configuração do Provedor OCI ---
provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

# --- 2. Busca Automática da Imagem (Data Source) ---
# Isso resolve o problema de não achar o ID exato da imagem
data "oci_core_images" "latest_oracle_linux_9_arm" {
  compartment_id           = var.compartment_id
  operating_system         = "Oracle Linux"
  operating_system_version = "9"
  shape                    = "VM.Standard.A1.Flex" # Garante que é compatível com Ampere
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# --- 3. Configuração da Instância (O Servidor em si) ---
resource "oci_core_instance" "instancia_free" {
  # O Availability Domain exato de SP. 
  # Se der erro "Not Found", confira o nome correto na sua conta.
  availability_domain = "otYZ:SA-SAOPAULO-1-AD-1" 
  compartment_id      = var.compartment_id
  display_name        = "Servidor-AlwaysFree"
  shape               = "VM.Standard.A1.Flex"

  # Configuração dos recursos Always Free (4 OCPUs e 24GB RAM)
  shape_config {
    ocpus         = 2
    memory_in_gbs = 12
  }

  # Configuração de Rede
  create_vnic_details {
    subnet_id        = var.subnet_id
    assign_public_ip = true
    display_name     = "vnic-principal"
  }

  # Aqui usamos o resultado da busca automática da imagem!
  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.latest_oracle_linux_9_arm.images[0].id 
  }

  # Configuração de Acesso (Sua Chave SSH)
  metadata = {
    ssh_authorized_keys = file(var.ssh_public_key_path)
  }
}