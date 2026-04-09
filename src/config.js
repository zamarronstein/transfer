import fs from 'fs';
import os from 'os';
import path from 'path';

const CONFIG_PATH = path.join(os.homedir(), '.local-transfer.json');

export function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return { me: 'Anon', peers: {} };
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

export function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function setMe(name) {
  const config = getConfig();
  config.me = name;
  saveConfig(config);
  console.log(`Tu nombre se ha configurado como: ${name}`);
}

export function setPeer(name, ip, port = 3000) {
  const config = getConfig();
  config.peers[name] = { ip, port };
  saveConfig(config);
  console.log(`Computadora "${name}" guardada con IP ${ip}:${port}`);
}
