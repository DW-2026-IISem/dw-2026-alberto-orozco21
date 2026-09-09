# Bitacora de creación del backend manual

## FASE 1 — 00_BASE_INIT_NESTJS

### 1.1 — Crear carpetas padre y permisos
Preparacion de la ruta de trabajo en WSL

```bash
mkdir -p /home/alberto/ia-lab/dw-2026-alberto-orozco21/projects/app-enlace-express
chmod -R 755 /home/alberto/ia-lab/dw-2026-alberto-orozco21/projects/app-enlace-express
```

![alt text](imagenes/carpeta_app_enlace_express.PNG)

### 1.2 — Instalar Nest CLI (si no existe)

El CLI genera `main.ts`, `app.module.ts`, `tsconfig`, scripts npm, etc.

```bash
npm install -g @nestjs/cli
nest --version
```

![alt text](imagenes/nest_version.PNG)