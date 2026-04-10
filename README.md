# Local Transfer (trf) 🚀

Una herramienta CLI ultrarrápida para transferir mensajes y archivos entre computadoras en la misma red local (P2P) usando Node.js.

## Requisitos

- **Node.js**: v22.20.0 o superior.
- Ambas computadoras deben estar conectadas a la **misma red local**.

## Instalación rápida

1. Clona el repositorio:
   ```bash
   git clone https://github.com/zamarronstein/transfer.git
   cd transfer
   ```

2. Instala las dependencias y activa el comando global:
   ```bash
   npm install
   npm link
   ```
   *Ahora puedes usar el comando `trf` desde cualquier carpeta.*

---

## Configuración Inicial

Configura tu identidad y registra a tus amigos/colegas para no tener que escribir sus IPs cada vez.

### 1. Configura tu nombre
```bash
trf config --set-me "TuNombre"
```

### 2. Registra una computadora remota (Peer)
```bash
trf config --set-peer "Amigo" --ip 192.168.1.15
```

### 3. Ver tu configuración
```bash
trf config
```

---

## Cómo usarlo

### 1. Recibir (Inicia el servidor)
Para recibir archivos o mensajes, simplemente corre:
```bash
trf start
```
*Los archivos recibidos se guardan en `./received_files/`.*

### 2. Enviar Mensajes
```bash
# Enviar al primer peer configurado
trf msg --message "¡Hola!"

# Enviar a un peer específico
trf msg Amigo --message "Viste el archivo?"

# Enviar a una IP directa
trf msg 192.168.1.20 --message "IP Directa"
```

### 3. Enviar Archivos
```bash
# Enviar al peer por defecto
trf file --path "./fotos/vacaciones.jpg"

# Enviar a un peer específico
trf file Amigo --path "./documentos/reporte.pdf"
```

---

## Estructura del Proyecto

- `transfer.js`: El motor de la CLI (`trf`).
- `src/server.js`: Receptor de datos (Express).
- `src/client.js`: Emisor de datos (Native Fetch).
- `src/config.js`: Persistencia de datos en `~/.local-transfer.json`.

## Licencia
MIT
