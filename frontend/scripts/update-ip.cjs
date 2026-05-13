const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  let fallbackIp = null;

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioriza IPs comuns de rede doméstica/empresa
        if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.')) {
          return iface.address;
        }
        // Guarda o primeiro IP encontrado como fallback (ex: vEthernet)
        if (!fallbackIp) fallbackIp = iface.address;
      }
    }
  }
  return fallbackIp || 'localhost';
}

const envPath = path.resolve(__dirname, '..', '.env');
const localIp = getLocalIp();
const apiUrl = `http://${localIp}:8080`;

console.log(`🔍 Detectando IP local...`);
console.log(`✅ IP encontrado: ${localIp}`);

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('EXPO_PUBLIC_API_URL')) {
    envContent = envContent.replace(/EXPO_PUBLIC_API_URL=.*/, `EXPO_PUBLIC_API_URL=${apiUrl}`);
  } else {
    envContent += `\nEXPO_PUBLIC_API_URL=${apiUrl}`;
  }
} else {
  envContent = `EXPO_PUBLIC_API_URL=${apiUrl}\n`;
}

fs.writeFileSync(envPath, envContent);
console.log(`🚀 Arquivo .env atualizado com sucesso!`);
