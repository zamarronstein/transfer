#!/usr/bin/env node
import { Command } from 'commander';
import { startServer } from './src/server.js';
import { sendMessage, sendFile } from './src/client.js';
import { getConfig, setMe, setPeer } from './src/config.js';

const program = new Command();
const config = getConfig();

program
  .name('trf')
  .description('Herramienta CLI para transferir archivos y mensajes en red local')
  .version('1.0.0');

program
  .command('start')
  .description('Iniciar servidor receptor')
  .option('-p, --port <number>', 'Puerto para escuchar', '3000')
  .option('-n, --name <string>', 'Nombre identificador', config.me || 'MiComputadora')
  .action((options) => {
    startServer(parseInt(options.port), options.name);
  });

program
  .command('config')
  .description('Configurar perfiles e IPs')
  .option('--set-me <name>', 'Establecer tu nombre local')
  .option('--set-peer <name>', 'Nombre de la otra computadora')
  .option('--ip <ip>', 'IP de la otra computadora')
  .option('--port <number>', 'Puerto de la otra computadora', '3000')
  .action((options) => {
    if (options.setMe) setMe(options.setMe);
    if (options.setPeer && options.ip) setPeer(options.setPeer, options.ip, options.port);
    if (!options.setMe && !options.setPeer) {
      console.log('Configuración actual:', JSON.stringify(config, null, 2));
    }
  });

function getTarget(toParam) {
  const peers = Object.keys(config.peers);
  let targetIp = null;
  let targetPort = 3000;

  if (toParam) {
    if (config.peers[toParam]) {
      targetIp = config.peers[toParam].ip;
      targetPort = config.peers[toParam].port;
    } else {
      targetIp = toParam; // Asumir que es una IP directa
    }
  } else if (peers.length > 0) {
    // Si no hay parámetro, usar el primer peer configurado
    const defaultPeer = config.peers[peers[0]];
    targetIp = defaultPeer.ip;
    targetPort = defaultPeer.port;
    console.log(`Usando destinatario por defecto: ${peers[0]} (${targetIp})`);
  }

  return { targetIp, targetPort };
}

program
  .command('msg')
  .description('Enviar un mensaje de texto')
  .argument('[to]', 'Nombre del peer o IP (opcional si hay uno configurado)')
  .option('--from <string>', 'Tu nombre', config.me)
  .requiredOption('--message <string>', 'Mensaje a enviar')
  .action(async (toParam, options) => {
    const { targetIp, targetPort } = getTarget(toParam);
    if (!targetIp) return console.error('Error: No hay destinatarios configurados ni IP especificada.');
    await sendMessage(targetIp, targetPort, options.from, options.message);
  });

program
  .command('file')
  .description('Enviar un archivo')
  .argument('[to]', 'Nombre del peer o IP (opcional si hay uno configurado)')
  .option('--from <string>', 'Tu nombre', config.me)
  .requiredOption('--path <string>', 'Ruta del archivo a enviar')
  .action(async (toParam, options) => {
    const { targetIp, targetPort } = getTarget(toParam);
    if (!targetIp) return console.error('Error: No hay destinatarios configurados ni IP especificada.');
    await sendFile(targetIp, targetPort, options.from, options.path);
  });

program.parse();
