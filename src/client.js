import { readFile } from 'fs/promises';
import { basename } from 'path';

export async function sendMessage(ip, port, from, message) {
  try {
    const response = await fetch(`http://${ip}:${port}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, message })
    });
    if (response.ok) {
      console.log('Mensaje enviado correctamente');
    } else {
      console.error(`Error al enviar mensaje: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error de conexión a ${ip}:${port}: ${error.message}`);
  }
}

export async function sendFile(ip, port, from, filePath) {
  try {
    const fileName = basename(filePath);
    const fileBuffer = await readFile(filePath);
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append('file', blob, fileName);
    formData.append('from', from);

    const response = await fetch(`http://${ip}:${port}/file`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log(`Archivo ${fileName} enviado correctamente`);
    } else {
      console.error(`Error al enviar archivo: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error al procesar el archivo o conectarse: ${error.message}`);
  }
}
