# Bitacora de creación del frontned en Angular

## ISS-00 · Requisitos previos

**Objetivo**

- Dejar el equipo listo para construir el frontend: Node, npm, Angular CLI, navegador, backend Express corriendo y base de datos sembrada. Al terminar este ISS no se ha escrito código de Angular todavía; solo se comprueba el entorno.


### 0.1 Versiones del laboratorio

| Herramienta | Versión usada | Verificación |
|-------------|---------------|--------------|
|Node.js |	22 LTS o superior (lab: 24.x)|	node -v|
|npm |	10 o superior	|npm -v|
|Angular CLI |	22.x	|npx @angular/cli version|
|Backend |Express 5 + Sequelize 6	|curl http://localhost:4000/api/sesion/perfil|
|Navegador |Chrome / Edge / Firefox actual|	Abrir http://localhost:4200|

```bash
node -v
npm -v
npx @angular/cli@22 version
```

![alt text](img-angular/requisitos.png)

### 0.2 Backend en marcha

El frontend no funciona solo: consume la API en `http://localhost:4000/api`. Levanta el backend correcto:

```bash
cd ~/ia-lab/dw-2026-alberto-orozco21/projects/app-enlace-express/backend-express/
npm run db:seed
npm run dev
```

![alt text](img-angular/rundev_backend.png)

### Comprobación de la matriz de permisos>

```bash
curl -i http://localhost:4000/api/companies
```

- 401 Unauthorized → el backend está protegido (estado final). Correcto.
- 200 con { "clients": [...] } → backend en Fase I (sin middlewares).
- ECONNREFUSED → el backend no está escuchando en el puerto 4000.

![alt text](img-angular/matriz_permiso.png)

### 0.3 Login y permisos

El login del backend devuelve solo el par de tokens. El perfil y los permisos se piden aparte:

1. **Login (OPEN)**

```bash
curl -s -X POST http://localhost:4000/api/sesion/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"Admin123!"}'
```

![alt text](img-angular/login_open.png)

2. **Perfil (JWT)**
curl -s http://localhost:4000/api/sesion/perfil \
  -H "Authorization: Bearer $TOKEN"

![alt text](img-angular/permisos_jwt.png)

3. **Permisos efectivos (JWT)**
curl -s http://localhost:4000/api/permisos \
  -H "Authorization: Bearer $TOKEN"

![alt text](img-angular/permisos_jwt.png)

### 0.4 Credenciales del seeder

|Usuario| Password |Rol	|Permisos |
|-------|----------|----|---------|
|admin|	Admin123! |ADMIN |110 recursos |
|operador| Operador123	|OPERADOR	|0 recursos |

### 0.5 Navegador y herramientas

- Abre DevTools (F12) → Console y Network. En cada ISS comprobarás que las peticiones llevan Authorization: Bearer ....
- Instala Angular DevTools (opcional) para inspeccionar componentes y signals.
- Desactiva bloqueadores que intercepten localhost si el login falla sin motivo.

### 0.6 Estructura de trabajo

El proyecto se crea dentro de la carpeta existente:

```
~/ia-lab/dw-2026-alberto-orozco21/projects/app-enlace-express/
```

No se debe crear una subcarpeta adicional. En ISS-01 se explica el comando exacto (`ng new frontend-enlace-express --directory .`) y porque `ng new .` falla en Angular CLI 22.

### Criterios de aceptación (ISS-00)

- [X] node -v ≥ 22 y npm -v ≥ 10.

- [X] npx @angular/cli@22 version muestra Angular CLI 22.x.

- [X] npm run db:seed && npm run dev del backend app-storelab-express-ii deja el puerto 4000 escuchando.

- [X] POST /api/sesion/login con admin / Admin123! devuelve access_token y refresh_token.

- [X] GET /api/permisos con ese token devuelve permissions (58 para admin).

- [X] La carpeta front-storelab-express-ii existe y está vacía (o solo contiene archivos de configuración del repositorio).

### Comprobación final

```bash
# 1. Versiones
node -v && npm -v && ng version

# 2. Backend vivo
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:4000/api/companies

# 3. Login + permisos
TOKEN=$(curl -s -X POST http://localhost:4000/api/sesion/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"alberto","password":"12345678"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

curl -s http://localhost:4000/api/permisos \
  -H "Authorization: Bearer $TOKEN" | head -c 300
```

![alt text](img-angular/comprobacion_iss00.png)

## ISS-01 · Bootstrap Angular 22 con CLI, Tailwind y PrimeNG

**Objetivo**

- Crear el proyecto Angular 22 sin una carpeta adicional, integrar Tailwind CSS 4, instalar PrimeNG 22 y dejar el tema Aura funcionando. Al final, ng serve debe mostrar la pantalla inicial sin errores.

### 1.1 Crear el proyecto en la carpeta actual

Desde la carpeta del proyecto:

```bash
cd ~/ia-lab/dw-2026-alberto-orozco21/projects/app-enlace-express/
npx @angular/cli@22 new frontend-enlace-express \
  --style=tailwind \
  --ssr=false \
  --routing \
  --zoneless \
  --skip-git \
  --package-manager=npm
```

![alt text](img-angular/new_project.png)

### 1.2 Instalar PrimeNG compatible con Angular

**Criterios de este sub-ítem**

- [X] primeng, @primeuix/themes, primeicons y @angular/cdk instalados
- [X] Las versiones instaladas declaran compatibilidad con Angular 22
- [X] package-lock.json actualizado y conservado

El tema moderno no se importa desde `primeng/resources/themes`. El preset Aura vive en `@primeuix/themes`.

Consulta primero las peer dependencies:

```bash
ng version
npm view primeng version peerDependencies --json
npm install primeng @primeuix/themes primeicons @angular/cdk
```

![alt text](img-angular/versiones.png)

Verifica versiones:

```bash
npm ls primeng @primeuix/themes primeicons @angular/cdk --depth=0
```

![alt text](img-angular/versiones2.png)

### 1.3 Estilos globales

**Criterios de este sub-ítem**

- [X] src/styles.css declara @layer theme, base, primeng, utilities;
- [X] Importa tailwindcss
- [X] Importa primeicons/primeicons.css
- [X] No contiene selectores .p-*, ::ng-deep ni clases de aplicación

**Crea/reemplaza src/styles.css:**

```bash
cat > src/styles.css <<'EOF'
@layer theme, base, primeng, utilities;
@import 'tailwindcss';
@import 'primeicons/primeicons.css';
EOF
```

El orden de capas es lo que permite que las utilidades de Tailwind ganen sobre el tema de PrimeNG sin !important. Es la única hoja global del proyecto.

### 1.4 Configurar PrimeNG en app.config.ts

**Criterios de este sub-ítem**

- [X] providePrimeNG registra preset: Aura
- [X] darkModeSelector: '.app-dark'
- [X] cssLayer declara name: 'primeng' y order: 'theme, base, primeng, utilities'
- [X] MessageService y ConfirmationService registrados
- [X] provideRouter incluye withComponentInputBinding() y withInMemoryScrolling

**Reemplaza src/app/app.config.ts:**

```bash
cat > src/app/app.config.ts <<'EOF'
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),

    // PrimeNG 22: tema Aura. El modo oscuro se activa con la clase .app-dark.
    providePrimeNG({
      license: environment.primeUiLicense || undefined,
      ripple: true,
      inputVariant: 'outlined',
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: { name: 'primeng', order: 'theme, base, primeng, utilities' },
        },
      },
    }),

    MessageService,
    ConfirmationService,
  ],
};
EOF
```

En ISS-02 se añade `provideHttpClient()`. Los interceptores se generan e incorporan en ISS-08, cuando sus servicios ya existen.

### 1.4.1 Licencia de PrimeNG 22 (obligatoria para la entrega limpia)

**Criterios de este sub-ítem**

- [X] Se identifica [PrimeUI] No license key configured en la consola como aviso de licencia, no un error de código
- [X] La clave Community se pega en primeUiLicense (environment*.ts, ISS-02 §2.1) y el aviso desaparece
- [X] La clave no se publica en el repositorio si es comercial

Desde la versión 22, PrimeNG es parte de PrimeUI, una familia comercial. El paquete incluye @primeui/license-manager, que verifica la clave sin conexión al arrancar (providePrimeNG). Si no hay clave o no es válida:

|Dónde|	Qué aparece|
|-----|------------|
|Consola|	[PrimeUI] No license key configured for primeui.|
|Consola|	[PrimeUI] PrimeUI license is not configured.|
|Esquina inferior derecha|	Banda roja Invalid PrimeUI License (Shadow DOM, pointer-events: none)|


**La aplicación funciona igual:** los componentes se dibujan y el tema Aura se aplica. El aviso es de licencia, no un fallo de Angular. Para una entrega profesional y para capturas de evidencia limpias hay que registrar la clave.

Cómo obtenerla (gratuita para el laboratorio):

1. Entra a https://primeui.dev/licenses y revisa los requisitos de la Community License: menos de 1 M USD de ingresos anuales, menos de 5 desarrolladores, menos de 10 empleados y menos de 3 M USD de financiación. Los estudiantes y el uso académico califican.

2. Solicítala en https://primeui.dev con tu correo.

3. Recibes la clave por correo. Pégala en src/environments/environment.development.ts (primeUiLicense) para ng serve, y en environment.ts para ng build (misma clave en ambos en el laboratorio).

4. Recarga: el aviso desaparece y la consola no vuelve a registrar el mensaje.

```
// src/environments/environment.development.ts (y el mismo valor en environment.ts)
export const environment = {
  // ...
  primeUiLicense: '', // clave personal; no uses una cadena de ejemplo del manual
};
```

`app.config.ts` ya enlaza la licencia: `license: environment.primeUiLicense || undefined`. Los pasos detallados del campo están en ISS-02 §2.1.

### 1.5 Pantalla de arranque: App compone el componente demo/ejemplo

**Criterios de este sub-ítem**

- [X] src/app/app.ts importa el componente Ejemplo y lo declara en imports
- [X] src/app/app.html contiene <app-ejemplo /> dentro de un <main> con utilidades Tailwind
- [X] src/app/app.css queda vacío: el aspecto viene de Tailwind y del tema Aura
- [X] src/app/app.spec.ts prueba que app-ejemplo se pinta, en lugar del `<h1>` por defecto
- [X] src/app/app.routes.ts sigue vacío: en ISS-01 no hay rutas
- [X] Existe src/app/demo/ejemplo/ con ejemplo.ts, ejemplo.html, ejemplo.css y ejemplo.spec.ts
- [X] Al abrir http://localhost:4000 se ve la tarjeta del producto con su precio y sus botones

La plantilla que genera el CLI es una página de bienvenida de Angular llena de enlaces. Se reemplaza, pero no por una pantalla vacía: el resultado de ISS-01 es una pantalla mínima que se ve y que sirve de ejemplo de todo lo que explica 1.9.

La pantalla vive en un componente aparte, `demo/ejemplo`, para que la explicación no se mezcle con App. App se queda con una sola responsabilidad: poner la etiqueta. No se usa el router todavía: en ISS-01 el objetivo es entender qué es un componente, y eso se ve con una etiqueta en la plantilla. El router aparece en ISS-01B, cuando hay una pantalla de negocio que mostrar.

```
index.html → <app-root> → App (composición) → <app-ejemplo /> → demo/ejemplo
```

La regla mental que queda de esta sección: un componente es una etiqueta HTML que se escribe en la plantilla de otro componente. La etiqueta es el selector de su @Component.

`src/app/app.ts`

```bash
cat > src/app/app.ts <<'EOF'
import { Component } from '@angular/core';
import { Ejemplo } from './demo/ejemplo/ejemplo';

/**
 * Componente principal (`<app-root>`).
 *
 * Es el primero que Angular dibuja. En ISS-01 solo compone el componente de
 * ejemplo, para que se vea en pantalla con una etiqueta. Las rutas llegan en
 * ISS-01B, cuando existe una pantalla de negocio que mostrar.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-root',
  imports: [Ejemplo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
EOF
```

`src/app/app.html`

```bash
cat > src/app/app.html <<'EOF'
<!-- Marco de la aplicación: fondo, ancho máximo y padding con utilidades Tailwind. -->
<main class="min-h-dvh bg-slate-50 p-6 text-slate-900">
  <div class="mx-auto w-full max-w-4xl">
    <!-- Composición: una etiqueta en la plantilla pinta el componente Ejemplo. -->
    <app-ejemplo />
  </div>
</main>
EOF
```

`<app-ejemplo />` es una etiqueta normal de HTML: Angular la reconoce porque Ejemplo declara selector: 'app-ejemplo' y está en el imports de App. No hay nada más. Si quitáramos Ejemplo de imports, la etiqueta no se pintaría.

`src/app/app.routes.ts`

```bash
cat > src/app/app.routes.ts <<'EOF'
import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 *
 * Vacío a propósito: en ISS-01 la pantalla se compone con etiquetas en `app.html`
 * (`<app-ejemplo />`). El router se presenta en ISS-01B, con una pantalla real.
 */
export const routes: Routes = [];
EOF
```

`provideRouter(routes)` ya está en app.config.ts desde que el CLI creó el proyecto; el arreglo vacío es válido y no impide arrancar. No se rellena hasta ISS-01B.

`src/app/app.css`

```bash
cat > src/app/app.css <<'EOF'
/*
 * Estilos propios del componente App.
 *
 * Queda VACÍO a propósito: el aspecto se resuelve con utilidades Tailwind en el
 * HTML y con el tema Aura de PrimeNG (PATRON-VISUAL). Angular mantiene el archivo
 * porque `styleUrl` lo referencia y solo afecta a `<app-root>`.
 */
EOF
```

![alt text](img-angular/archivos_app.png)

**PARCHE** — prueba del componente. La prueba generada por el CLI busca el `<h1>` de la plantilla por defecto y falla después de reemplazar app.html. Reemplázala por pruebas de la composición. El componente `demo/ejemplo` tiene su propia prueba (`ejemplo.spec.ts`), que se explica en 1.9.

```bash
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the example component', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-ejemplo')).toBeTruthy();
  });

  it('should show the product loaded by the example component', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Café molido 500 g');
  });
});
```

### 1.6 Personalizar index.html
Criterios de este sub-ítem

- [X] lang="es"
- [X] `<title>StoreLab Express II · Angular 22</title>`
- [X] `<body class="m-0 bg-slate-100 font-sans text-slate-900">`
- [X] `meta description` presente

```bash
cat > src/index.html <<'EOF'
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>StoreLab Express II · Angular 22</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Frontend Angular 22 con Signals, PrimeNG y Tailwind para StoreLab Express.">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body class="m-0 bg-slate-100 font-sans text-slate-900">
  <app-root></app-root>
</body>
</html>
EOF
```

![alt text](img-angular/index.html.png)

Las clases del `<body>` son utilidades Tailwind: fondo, fuente y color de texto. No se redefinen fuentes ni colores del tema con CSS propio.

### 1.7 Ajustar el presupuesto de build

**Criterios de este sub-ítem**

- [ ] En projects → … → architect → build → configurations → production → budgets, el presupuesto initial es maximumWarning: "750kB" y maximumError: "1MB"

El bundle inicial con PrimeNG supera los 500 kB por defecto. En angular.json, dentro de projects → ... → architect → build → configurations → production → budgets, cambia el primer presupuesto:

```json
{
  "type": "initial",
  "maximumWarning": "750kB",
  "maximumError": "1MB"
}
```

### 1.8 Primera ejecución

**Criterios de este sub-ítem**

- [X] npm start compila sin errores
- [X] http://localhost:4200 responde 200 y muestra el componente de ejemplo
- [X] Se ve la tarjeta del producto con nombre, precio, estado y botones
- [X] Pulsar +1000 cambia el precio y el «Precio final con IVA» sin recargar la página
- [X] Cambiar estado cambia la etiqueta (Activo/Inactivo) y el mensaje inferior
- [X] Escribir en Nombre actualiza el texto «Vista previa»
- [X] Console muestra [ejemplo] … en cada cambio (lo escribe effect())
- [X] Network carga styles.css, main.js y los chunks con estado 200
- [X] El `<title>` de la pestaña es StoreLab Express II · Angular 22

```bash
npm start
```

![alt text](img-angular/start_demo.png)

Abre http://localhost:4200. Debe verse la pantalla de 1.5: la tarjeta Objeto producto, las dos tarjetas de explicación y las utilidades Tailwind que lo centran. Al pulsar +1000 el precio base sube y el valor con IVA se recalcula; Cambiar estado alterna la etiqueta y el aviso; Reiniciar vuelve al objeto inicial.

No hay URL por pantalla: en ISS-01 el router está configurado pero sin rutas, así que cualquier dirección muestra la misma composición.

Sin este ajuste, ng build termina con un warning (no error). En ISS-11 se explica por qué no conviene subirlo más allá de 1 MB.

### 1.9 Anatomía del componente demo/ejemplo y signals

**Criterios de este sub-ítem**

- [X] Explica en qué orden arranca la aplicación y qué archivo hace cada paso
- [X] Identifica los cuatro archivos de un componente y la función de cada uno
- [X] Relaciona cada parte de la pantalla con la línea de ejemplo.ts o ejemplo.html que la produce
- [X] Distingue signal (estado), computed (valor derivado) y effect (efecto secundario)
- [X] Explica cómo se actualiza un objeto guardado en un signal sin mutarlo
- [X] Explica por qué no hace falta Zone.js ni llamar a ChangeDetectorRef
- [X] Explica cómo el selector: 'app-ejemplo' produce la etiqueta `<app-ejemplo />` de app.html

Esta sección explica el mismo código que ya está en pantalla: `src/app/demo/ejemplo/`. Es un componente pequeño y completo: un objeto, cuatro operaciones y tres tarjetas. No hay un ejemplo aparte que borrar después.

```
src/app/demo/ejemplo/
├── ejemplo.ts       ← la clase: estado, derivados, efecto y métodos
├── ejemplo.html     ← la plantilla: tarjetas, campos y botones
├── ejemplo.css      ← la excepción: una clase para explicar el aislamiento
└── ejemplo.spec.ts  ← la prueba: crea el componente y comprueba el cambio de estado
```

### 1.9.1 De index.html a la pantalla

Cuando el navegador carga http://localhost:4200, Angular recorre siempre estos pasos:

```
index.html
   └─ <app-root></app-root>                  ← el HTML solo tiene esta etiqueta
         │
         ├─ src/main.ts                      bootstrapApplication(App, appConfig)
         ├─ src/app/app.config.ts            providers globales (router, PrimeNG, …)
         └─ src/app/app.ts                    clase App + @Component(...)
               ├─ app.html                    plantilla: <main> + <app-ejemplo />
               ├─ app.css                     estilos propios (vacío)
               ├─ app.spec.ts                 pruebas de App
               └─ app.routes.ts               rutas (vacío en ISS-01)
                     │
                     │  <app-ejemplo />  ← la etiqueta de app.html encuentra este componente
                     ▼
               src/app/demo/ejemplo/
                     ├─ ejemplo.ts            clase Ejemplo + @Component(...)
                     ├─ ejemplo.html          plantilla: las tres tarjetas
                     ├─ ejemplo.css           una clase de demostración
                     └─ ejemplo.spec.ts       4 pruebas
```

**La idea central:** index.html solo tiene una etiqueta. Angular la sustituye por App, y App pinta demo/ejemplo porque escribió su etiqueta en la plantilla. El componente de ejemplo declara su estado en ejemplo.ts y lo dibuja con ejemplo.html. Todo lo demás del curso son componentes dentro de componentes.

De selector a etiqueta: por qué `<app-ejemplo />` funciona
app.html contiene una sola referencia al componente:

```html
<main class="min-h-dvh bg-slate-50 p-6 text-slate-900">
  <div class="mx-auto w-full max-w-4xl">
    <app-ejemplo />
  </div>
</main>
```

Si el selector es 'app-ejemplo', la etiqueta es <app-ejemplo>. Si se quita Ejemplo de imports, Angular no reconoce la etiqueta y la deja como un elemento HTML inerte (sin error de compilación, porque el nombre es válido). Ese es el primer error del curso: el componente «no se ve» porque falta el import.

En el DOM, el elemento conserva su etiqueta y recibe las clases de host:

```
div.mx-auto.w-full.max-w-4xl
└── <app-ejemplo class="block" _ngcontent-…>   ← la etiqueta que escribiste en app.html
      └── <div class="flex flex-col gap-6">     ← ejemplo.html
```
Ese `class="block"` no está escrito en app.html: sale de host: { class: 'block' } en la metadata de Ejemplo. Es la forma de dar clases al elemento anfitrión sin envolverlo en otro div.

> El router llega después. Preguntar «¿y si quiero que la URL decida qué componente se pinta?» es correcto, pero es otra lección: ISS-01B introduce RouterOutlet cuando ya hay una pantalla de negocio. En ISS-01 el router está configurado (provideRouter) pero sin rutas.

### 1.9.2 Los cuatro archivos de un componente
Un componente Angular es una clase TypeScript + una plantilla + unos estilos + una prueba:

```
src/app/demo/ejemplo/
├── ejemplo.ts        ← la clase (estado y lógica) + @Component(...)
├── ejemplo.html      ← la plantilla (lo que se ve)
├── ejemplo.css       ← los estilos de ESTE componente
└── ejemplo.spec.ts   ← la prueba
```

La metadata es lo que convierte una clase normal en un componente:

```typescript
@Component({
  host: { class: 'block' },              // clases del elemento anfitrión <app-ejemplo>
  selector: 'app-ejemplo',               // etiqueta HTML que lo representa
  imports: [ButtonModule, CardModule, InputTextModule, MessageModule, TagModule],
  templateUrl: './ejemplo.html',         // vista externa
  styleUrl: './ejemplo.css',             // estilos externos
})
export class Ejemplo {}
```

> Nombres en Angular 22: el CLI ya no genera app.component.ts ni AppComponent. Genera app.ts con la clase App. Ambos estilos funcionan, pero el material usa el actual: el sufijo .component se omite porque la carpeta y el @Component ya lo dicen.

### 1.9.3 Leer ejemplo.ts línea a línea

```typescript
// 1. Se importan solo las piezas que se usan.
import { Component, computed, effect, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

// 2. El objeto que se muestra y se modifica.
export interface Producto {
  nombre: string;
  precio: number;
  activo: boolean;
}

// 3. @Component describe CÓMO se pinta la clase.
@Component({
  host: { class: 'block' },              // <app-ejemplo> se comporta como bloque
  selector: 'app-ejemplo',               // se usa como <app-ejemplo></app-ejemplo>
  imports: [ButtonModule, CardModule, InputTextModule, MessageModule, TagModule],
  templateUrl: './ejemplo.html',
  styleUrl: './ejemplo.css',
})
export class Ejemplo {
  // 4. ESTADO: el signal guarda un objeto completo.
  protected readonly producto = signal<Producto>(productoInicial());

  // 5. DERIVADOS: se calculan desde `producto()`, nunca se asignan.
  protected readonly precioFinal = computed(() =>
    Math.round(this.producto().precio * 1.19),
  );
  protected readonly estadoTexto = computed(() =>
    this.producto().activo ? 'Activo' : 'Inactivo',
  );

  // 6. EFECTO: se ejecuta al crear y en cada cambio del objeto.
  private readonly registro = effect(() => {
    const { nombre, precio, activo } = this.producto();
    console.log(`[ejemplo] ${nombre} · precio ${precio} · ${activo ? 'activo' : 'inactivo'}`);
  });

  // 7. Métodos que la plantilla llama desde los eventos.
  protected cambiarNombre(event: Event): void {
    const nombre = (event.target as HTMLInputElement).value;
    this.producto.update((actual) => ({ ...actual, nombre }));
  }

  protected variarPrecio(delta: number): void {
    this.producto.update((actual) => ({
      ...actual,
      precio: Math.max(0, actual.precio + delta),
    }));
  }

  protected alternarEstado(): void {
    this.producto.update((actual) => ({ ...actual, activo: !actual.activo }));
  }

  protected reiniciar(): void {
    this.producto.set(productoInicial());
  }
}
```

La función auxiliar evita compartir el mismo objeto entre el estado inicial y el reinicio:

```typescript
function productoInicial(): Producto {
  return { nombre: 'Café molido 500 g', precio: 18000, activo: true };
}
```

Las piezas de la plantilla que producen lo que se ve:

```html
<!-- 1. Interpolación: muestra un campo del objeto. -->
<p class="text-2xl font-bold text-slate-900">{{ producto().precio }}</p>

<!-- 2. Property binding + event binding sobre un campo editable. -->
<input pInputText [value]="producto().nombre" (input)="cambiarNombre($event)" />

<!-- 3. Event binding con argumento: el botón llama al método con 1000. -->
<button pButton type="button" (click)="variarPrecio(1000)">
  <span pButtonLabel>+1000</span>
</button>

<!-- 4. Property binding booleano: el tag cambia de color según `activo`. -->
<p-tag [value]="estadoTexto()" [severity]="producto().activo ? 'success' : 'danger'" />
```

`{{ producto().precio }}` no es una función de la plantilla: es la lectura del signal (producto()) y, sobre el objeto, la propiedad (precio). Sin el primer paréntesis Angular mostraría la función en lugar del valor.

> Qué pasa con app.routes.ts. Sigue vacío (export const routes: Routes = [];). provideRouter(routes) está configurado, pero sin rutas no hay navegación: la pantalla se compone con etiquetas. El router se presenta en ISS-01B con una pantalla real.

### 1.9.4 Las cuatro formas de conectar la clase con el HTML

> [(ngModel)] requiere FormsModule y se usa en formularios sencillos. En este curso los formularios de negocio usan Reactive Forms (FormGroup y formControlName), que se presentan en ISS-03. El ejemplo escribe el binding a mano ([value] + (input)) para que se vea de dónde sale el valor nuevo.

Y el flujo de control moderno, que reemplaza a *ngIf y *ngFor. El ejemplo lo usa para elegir el mensaje según el estado del producto:

```typescript
@if (producto().activo) {
  <p-message severity="success" variant="simple">
    Producto activo: la API lo devolvería en <code>GET /api/productos</code>.
  </p-message>
} @else {
  <p-message severity="warn" variant="simple">
    Producto inactivo: el borrado lógico lo oculta de las listas.
  </p-message>
}

<!-- El mismo bloque aplica a una lista del negocio. -->
@if (clients().length === 0) {
  <p>No hay clientes activos.</p>
} @else {
  <ul>
    @for (client of clients(); track client.id) {
      <li>{{ client.name }}</li>
    }
  </ul>
}
```

track le dice a Angular cómo identificar cada elemento de la lista; con él evita volver a dibujar filas que no cambiaron. @for exige track en Angular 22.

### 1.9.5 Signals: el estado que avisa a la vista

Un signal es una caja con un valor que notifica a quien lo lee cuando cambia. Se crea con signal(valorInicial), se lee con () y se modifica con .set() o .update().

Dónde está en Ejemplo. El estado es un objeto Producto; la plantilla lee sus campos y los botones lo cambian:

```typescript
// ejemplo.ts — declaración y cambios del estado
protected readonly producto = signal<Producto>(productoInicial());

protected variarPrecio(delta: number): void {
  this.producto.update((actual) => ({
    ...actual,                              // conserva nombre y activo
    precio: Math.max(0, actual.precio + delta),
  }));
}

protected reiniciar(): void {
  this.producto.set(productoInicial());     // valor nuevo, no depende del anterior
}
```

```html
<!-- ejemplo.html — lectura del signal: siempre con paréntesis -->
<p class="text-2xl font-bold text-slate-900">{{ producto().precio }}</p>
<p class="text-sm text-slate-500">
  Precio final con IVA (19 %): <strong>{{ precioFinal() }}</strong>
</p>
<p-tag [value]="estadoTexto()" [severity]="producto().activo ? 'success' : 'danger'" />
```

**Actualizar un objeto dentro de un signal**

Este es el punto que más se equivoca al empezar. Un signal compara referencias, no campos: si se modifica el objeto en el sitio, el signal sigue apuntando al mismo objeto y la vista no se entera.

```typescript
// MAL: muta el objeto y conserva la misma referencia.
const actual = this.producto();
actual.precio = actual.precio + 1000;   // el signal no notifica: nadie llamó a set/update

// BIEN: crea un objeto nuevo y entrégaselo al signal.
this.producto.update((actual) => ({ ...actual, precio: actual.precio + 1000 }));
```

Al pulsar +1000, el signal cambia, Angular repinta el precio base y el valor con IVA, y la etiqueta de estado sigue igual porque producto().activo no cambió. Nadie llamó a ChangeDetectorRef.

> Comprobado en este workspace: la pantalla arranca con 18000 y IVA 21420; +1000 deja 19000 y 22610, -1000 vuelve a 18000, y Reiniciar restaura el objeto completo. Esas cuatro transiciones están en ejemplo.spec.ts y se ejecutan con npm test -- --watch=false.

Si el número no cambia, revisa que leíste producto() con paréntesis y que el método devuelve un objeto nuevo dentro de .update(), no una mutación.

### 1.9.6 computed y effect: derivar y reaccionar

- computed calcula un valor a partir de otros signals. No guarda estado propio: se recalcula cuando cambia una dependencia y solo se recalcula si alguien lo lee.

- effect ejecuta un efecto secundario (guardar, registrar, enfocar) cuando cambian los signals que lee. No se usa para calcular estado.

```typescript
// ejemplo.ts — dos valores derivados y un efecto secundario
protected readonly precioFinal = computed(() =>
  Math.round(this.producto().precio * 1.19),
);

protected readonly estadoTexto = computed(() =>
  this.producto().activo ? 'Activo' : 'Inactivo',
);

private readonly registro = effect(() => {
  const { nombre, precio, activo } = this.producto();
  console.log(`[ejemplo] ${nombre} · precio ${precio} · ${activo ? 'activo' : 'inactivo'}`);
});
```

```html
<!-- ejemplo.html — los derivados se leen igual que un signal -->
<p class="text-sm text-slate-500">
  Precio final con IVA (19 %): <strong>{{ precioFinal() }}</strong>
</p>
<p-tag [value]="estadoTexto()" [severity]="producto().activo ? 'success' : 'danger'" />
```

**Regla del curso:** si un valor se puede calcular a partir de otros signals, es computed. Si hay que hacer algo cuando cambia, es effect. Guardar en un signal lo que ya se deduce de otro signal crea dos fuentes de verdad que se desincronizan. Aquí precioFinal no existe como signal propio: se deriva de producto().precio. Si se guardara el IVA en el objeto, habría que acordarse de recalcularlo en cada cambio de precio.

### 1.9.7 Zoneless: por qué la vista se actualiza sin Zone.js

Angular 22 arranca sin Zone.js por defecto. Antes, Angular parcheaba todas las APIs asíncronas para saber cuándo revisar la vista; ahora el propio código avisa:

Por eso el estado del curso se declara con signal. Una propiedad public total = 0 funciona al inicio, pero al cambiarla desde una promesa el HTML puede quedarse con el valor viejo. Con signal, el cambio siempre llega a la vista.

### 1.9.8 Estilos globales y estilos del componente

**Regla del curso:** el aspecto de la aplicación se construye con PrimeNG (controles) y Tailwind (espaciado, tipografía, color). No se escribe CSS de negocio. La única excepción es la caja de la tarjeta «Estilos» del ejemplo, porque su propósito es explicar cómo funciona el CSS del componente:

```css
/* src/app/demo/ejemplo/ejemplo.css — únicamente demostrativo. */
.ejemplo-alcance {
  border: 2px dashed #0f766e;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: #f0fdfa;
}
```

```html
<!-- La misma caja, con el resto del contenido en Tailwind. -->
<div class="ejemplo-alcance mt-4 text-sm text-slate-700">…</div>
```

**Qué es el encapsulamiento**: Angular compila el CSS del componente con `ViewEncapsulation.Emulated`: agrega un atributo como `_ngcontent-ng-c4132172110` a los elementos de la plantilla y escribe la regla calificada (`.ejemplo-alcance[_ngcontent-…]`). Por eso una clase definida en ejemplo.css no afecta a otro componente, aunque se llame igual. El atributo se ve al inspeccionar el DOM y es normal.

```html
<div class="ejemplo-alcance mt-4 …" _ngcontent-ng-c4132172110>…</div>
```

**Consecuencia práctica:** si dos componentes necesitan el mismo borde, no se copia la clase en los dos `.css`; se resuelve con una utilidad Tailwind o con un componente compartido. En el curso ganan Tailwind y PrimeNG porque el estilo queda en el HTML, junto a la estructura, y el tema Aura mantiene la coherencia entre controles.

## Verificación del ISS

```bash
# 1. El servidor debe compilar
ng build

# 2. Debe imprimir la configuración de Tailwind/PrimeNG
grep -R "providePrimeNG\|@import 'tailwindcss'" src | head

# 3. Versiones compatibles
npm ls primeng @primeuix/themes primeicons @angular/cdk --depth=0

# 4. Presupuesto y estilos
node -e "const a=require('./angular.json');const p=a.projects[Object.keys(a.projects)[0]];console.log(p.architect.build.configurations.production.budgets[0])"
cat src/styles.css

# 5. La composición y el componente de ejemplo declaran signals
grep -n "imports: \[Ejemplo\]" src/app/app.ts
grep -n "app-ejemplo" src/app/app.html
grep -n "signal(\|computed(\|effect(" src/app/demo/ejemplo/ejemplo.ts
```

```bash
# 6. Pruebas de App y del componente de ejemplo
npm test -- --watch=false
```

![alt text](img-angular/verificacion_iss01A.png)

![alt text](img-angular/demo.png)

## Fase I: Frontend — ISS-01A — Esqueleto Header / Aside / contenido / Footer

**Objetivo:** construir primero la pantalla. Al terminar, http://localhost:4200 muestra Header arriba, Aside a la izquierda del contenido y Footer abajo a todo el ancho, con datos fijos y sin llamadas a la API.

**Bloqueado por:** ISS-01.

**Criterios de aceptación (ISS-01A) — consolidados**

- [X] 1.1 Explica por qué un componente generado no aparece hasta que el padre lo declara en imports y usa su selector
- [X] 1.2 Existen src/app/layout/header/, src/app/layout/aside/ y src/app/layout/footer/, cada una con .ts, .html y .css
- [X] 1.3 header.ts declara title y header.html lo muestra con {{ title }}
- [X] 1.3 Los tres .css de layout/ no contienen reglas: solo un comentario que explica por qué están vacíos
- [X] 1.4 app.ts importa Header, Aside y Footer y los declara en imports
- [X] 1.4 app.html compone las cuatro regiones: `<app-header />`, `<aside>`con `<app-aside />`, `<main>` con el contenido y `<app-footer />`
- [X] 1.4 app.html ya no contiene `<app-ejemplo />`: demo/ejemplo no forma parte de la aplicación
- [X] 1.5 Se ven las cuatro regiones, el Footer queda abajo y no hay desplazamiento horizontal
- [X] 1.5 En Network no aparece ninguna petición /api
- [X] ng build termina con código 0 y las pruebas pasan

> **demo/ejemplo** no se usa en ningún ISS posterior. Fue la introducción a Angular de ISS-01. No está en el menú, no tiene ruta, no se compone en el layout y no se reutiliza. Al reemplazar app.html en 1.4 deja de verse; el componente y su prueba siguen en el proyecto solo como material de consulta de ISS-01.

### 1.1 Qué es un componente y por qué el padre debe importarlo

Un componente reúne una clase TypeScript (datos y lógica), una plantilla HTML (lo que se ve) y un archivo de estilos. `@Component` relaciona esos archivos:

|Campo	|Pregunta que responde	|Ejemplo en este ISS|
|-------|-----------------------|-------------------|
|selector	|¿Con qué etiqueta se usa en otra plantilla?	|selector: 'app-header' → <app-header />|
|imports|	¿Qué usa su plantilla?|	[] en Header de ISS-01A|
|templateUrl	|¿Dónde está el HTML?|	./header.html|
|styleUrl|	¿Dónde están los estilos privados?	|./header.css|
|host|	¿Qué clases lleva el elemento anfitrión?	|host: { class: |'block' }|

**Regla que resuelve el error más común:** un componente generado existe, pero no se ve hasta que otro componente lo declara en su imports y escribe su etiqueta en su plantilla. Son dos pasos, no uno:

```typescript
// app.ts — paso 1: declarar el componente para que la plantilla lo reconozca
imports: [Header, Aside, Footer],
```

```html
<!-- app.html — paso 2: usar su selector como etiqueta -->
<app-header />
```

**PARCHE** — standalone: true ya no hace falta. El CLI de Angular 22 genera componentes standalone por defecto. Escribir standalone: true es válido y no rompe nada, pero la plantilla del proyecto lo omite. Si copias ejemplos antiguos que lo incluyen, no hay conflicto: simplemente es redundante.

Usamos `layout/` para conservar la organización del curso. El Header de la aplicación es distinto de `shared/ui/page-header`, que titula una pantalla de negocio.

### 1.2 Generar las tres piezas de layout/
Criterios de este sub-ítem


```bash
ng generate component layout/header --skip-tests --defaults
ng generate component layout/aside --skip-tests --defaults
ng generate component layout/footer --skip-tests --defaults
```

En una reconstrucción desde cero, el CLI crea además un `header.spec.ts` si no usas `--skip-tests`. En este curso esas pruebas no se necesitan: el comportamiento de la pantalla se comprueba desde `app.spec.ts`.

### 1.3 Contenido de cada componente
Criterios de este sub-ítem


Los tres componentes son de presentación: no inyectan servicios, no consultan la API y no conocen permisos. Esa frontera es la que permite reutilizar el layout en ISS-02 sin duplicarlo.

**Header**

`src/app/layout/header/header.ts`

```typescript
import { Component } from '@angular/core';

/**
 * Barra superior de la aplicación.
 *
 * ISS-01A: solo muestra el nombre. En ISS-01B recibe datos por `input()`, emite
 * `menuRequested` y añade el menú de usuario. No consulta la API.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly title = 'EnlaceExpress';
}
```

`src/app/layout/header/header.html`

```html
<header
  class="flex h-16 items-center border-b border-slate-200 bg-white px-6 font-semibold"
>
  <!-- Interpolación: `title` es una propiedad de la clase Header. -->
  <p class="truncate text-sm font-semibold text-slate-900">{{ title }}</p>
</header>
```

`{{ title }}` es interpolación: Angular lee la propiedad de la clase y escribe su texto. Cambia el valor en header.ts y comprueba que cambia el encabezado sin tocar el HTML. Ese es el primer enlace entre clase y plantilla.

h-16 fija la altura, border-b dibuja la separación y truncate evita que un texto largo rompa la barra. Todo es Tailwind: no hay CSS propio.

**Aside**

`src/app/layout/aside/aside.ts`

```typescript
import { Component } from '@angular/core';

/**
 * Menú lateral de la aplicación.
 *
 * ISS-01A: solo el contenedor. En ISS-01B recibe `items` por `input()` y pinta
 * `p-panelmenu`. No conoce rutas ni permisos: eso llega en ISS-02/ISS-08.
 */
@Component({
  host: { class: 'block h-full' },
  selector: 'app-aside',
  templateUrl: './aside.html',
  styleUrl: './aside.css',
})
export class Aside {}
```

`src/app/layout/aside/aside.html`

```html
<nav aria-label="Navegación principal" class="h-full bg-slate-950 p-6 text-white">
  <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Navegación</p>
  <p class="mt-2 text-sm">Menú de EnlaceExpress</p>
  <p class="mt-4 text-xs text-slate-400">
    En ISS-01B este bloque pasa a ser un <code>p-panelmenu</code>.
  </p>
</nav>
```

`aria-label` no es decorativo: nombra la región de navegación para lectores de pantalla y permite localizarla en las pruebas. El ancho no se decide aquí: lo fija el padre en app.html, porque el Aside debe poder ocultarse en móvil (ISS-01B) sin cambiar el componente.

**Footer**

`src/app/layout/footer/footer.ts`

```typescript
import { Component } from '@angular/core';

/**
 * Pie de página de la aplicación.
 *
 * Presentación pura: no tiene estado ni depende de servicios.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
```

`src/app/layout/footer/footer.html`

```html
<footer
  class="border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500 sm:px-6"
>
  EnlaceExpress · Gestión de clientes, productos y ventas
</footer>
```

**Los tres** `.css`

Cada archivo contiene solo un comentario. No hay reglas:

```
/*
 * Estilos del Header.
 *
 * Vacío a propósito: la apariencia se resuelve con utilidades Tailwind en
 * `header.html` y con el tema Aura de PrimeNG (PATRON-VISUAL).
 */
```

`aside.css` y `footer.css` siguen el mismo criterio. El archivo existe porque styleUrl lo referencia y Angular lo necesita para el encapsulamiento (ISS-01, 1.9.8); si algún día se escribe una regla, solo afectará a ese componente.

### 1.4 Componer las cuatro regiones en App
Criterios de este sub-ítem


`src/app/app.ts`

```typescript
import { Component } from '@angular/core';
import { Header } from './layout/header/header';
import { Aside } from './layout/aside/aside';
import { Footer } from './layout/footer/footer';

/**
 * Componente principal (`<app-root>`).
 *
 * Es el primero que Angular dibuja. Compone las cuatro regiones de la pantalla:
 * Header arriba, Aside a la izquierda, el contenido del centro y Footer abajo.
 * El contenido del centro todavía es fijo; en ISS-01B pasa a cambiar con el menú
 * y en ISS-02 llega el router.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-root',
  imports: [Header, Aside, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** Título de la pantalla inicial. En ISS-01B cambia al elegir el menú. */
  protected readonly title = 'Inicio';
}
```

`src/app/app.html`

```html
<!-- Contenedor de las cuatro regiones: Tailwind para el alto y la dirección. -->
<div class="flex min-h-screen flex-col bg-slate-100">
  <app-header />

  <div class="flex flex-1">
    <!-- Aside fijo de 16rem; en ISS-01B se oculta en pantallas pequeñas. -->
    <aside class="w-64 shrink-0">
      <app-aside />
    </aside>

    <!-- min-w-0 evita que un contenido ancho desborde el flex y cree scroll. -->
    <main id="contenido" class="min-w-0 flex-1 p-6">
      <h1 class="text-2xl font-semibold text-slate-900">{{ title }}</h1>
      <p class="mt-2 text-slate-600">Bienvenido a EnlaceExpress.</p>
    </main>
  </div>

  <app-footer />
</div>
```

**Prueba de la composición**

`src/app/app.spec.ts` no busca el `<h1>` de la plantilla por defecto: comprueba las regiones y el texto inicial.

```typescript
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  async function crearApp() {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should compose the three layout regions', async () => {
    const compilado = await crearApp();
    expect(compilado.querySelector('app-header')).toBeTruthy();
    expect(compilado.querySelector('aside app-aside')).toBeTruthy();
    expect(compilado.querySelector('app-footer')).toBeTruthy();
  });

  it('should render the application name in the header', async () => {
    const compilado = await crearApp();
    const header = compilado.querySelector('app-header') as HTMLElement;
    expect(header.textContent).toContain('EnlaceExpress');
  });

  it('should render the initial title in the content', async () => {
    const compilado = await crearApp();
    const main = compilado.querySelector('main') as HTMLElement;
    expect(main.textContent).toContain('Inicio');
    expect(main.textContent).toContain('Bienvenido a EnlaceExpress.');
  });
});
```

La consulta `aside app-aside` verifica dos cosas a la vez: que el Aside está dentro del elemento que fija su ancho y que el componente se pintó.

### 1.5 Comprobar antes de avanzar
Criterios de este sub-ítem


```bash
npm start
```

Abre http://localhost:4200 y comprueba:

|Comprobación visual |Resultado esperado|
|--------------------|------------------|
|Header|	Barra blanca de 64 px con StoreLab Express II|
|Aside|	Columna oscura de 256 px con Menú de StoreLab|
|Contenido|	Inicio y Bienvenido a StoreLab.|
|Footer	|Franja inferior a todo el ancho con StoreLab · Gestión de clientes, productos y ventas|
|Con poco contenido	|El Footer queda pegado al borde inferior de la ventana|
|Con mucho contenido|	El Footer baja; aparece scroll vertical, nunca horizontal|
|Network	|Sin peticiones /api: aún no hay servicios|

Para provocar el caso de contenido largo, añade párrafos dentro de `<main>` y observa que solo el Footer se desplaza: el Header y el Aside no se mueven porque están en el flujo normal del `flex` vertical.

![alt text](img-angular/start_iss01A.png)

## Fase I: Frontend — ISS-01B — Menú PrimeNG y primera interacción

**Objetivo:** pasar de una maqueta a una pantalla que responde. Al terminar: PanelMenu en el Aside, botón de menú en el Header, Drawer en pantalla pequeña y selección que cambia el contenido local. Sin rutas de negocio y sin API.

**Bloqueado por:** ISS-01A.

**Criterios de aceptación (ISS-01B) — consolidados**

- [X] 1.1 Explica la diferencia entre input() (dato del padre al hijo), output() (aviso del hijo al padre) y signal() (estado propio)
- [X] 1.2 aside.ts declara `items = input<MenuItem[]>([])` y aside.html lo pinta con `<p-panelmenu [model]="items()" [multiple]="true" />`
- [X] 1.2 aside.css sigue sin reglas: la apariencia es de Aura y Tailwind
- [X] 1.3 El Header emite menuRequested y su botón está siempre visible: por debajo de lg abre el Drawer, desde lg alterna el Aside fijo
- [X] 1.4 Existe src/app/features/construir/ con construir.ts, construir.html, construir.css y construir.spec.ts
- [X] 1.4 mobileOpen, sidebarCollapsed y title son signal; elegir una opción cambia el título y cierra el Drawer
- [X] 1.4 El layout se compone una sola vez en construir.html y se reutiliza en el Drawer
- [X] 1.5 app.ts importa RouterOutlet y app.html contiene solo `<router-outlet />`
- [X] 1.5 app.routes.ts declara construir con loadComponent, redirige '' y ** a construir
- [X] 1.6 A 1280 px se ve Inicio, 11 opciones de Operación y 6 de Administración; a 390 px se oculta y el botón abre el Drawer
- [X] 1.6 A 1280 px el botón de menú se ve y oculta/muestra el Aside sin abrir el Drawer
- [X] 1.6 La URL no cambia al elegir una opción y Network no registra llamadas /api
- [X] ng build termina con código 0, construir se empaqueta como chunk diferido y las pruebas pasan

> demo/ejemplo no participa. La introducción a Angular quedó en ISS-01. No tiene ruta, no está en el menú y no se compone en este ISS.

### 1.1 Los conceptos que se agregan, uno por vez

`Criterios de este sub-ítem`

- [X] Distingue los tres canales de datos: entrada, salida y estado
- [X] Reconoce `MenuItem[]` como el contrato del menú de PrimeNG
- [X] Explica `[(visible)]` como ida y vuelta en un solo atributo

|Concepto	|Qué resuelve	|Dónde se ve en este ISS|
|--------|-------------|-----------------------|
|input()	|Dato que el padre entrega al hijo; el hijo no lo modifica|	items en Aside, appName en Header|
|output()	|Aviso del hijo al padre; el hijo no navega ni cierra nada por su cuenta	|menuRequested, |navigated
|signal()|	Estado propio del componente, observado por la plantilla|	title, mobileOpen en Construir|
|[propiedad]|	Enlace de la clase a la plantilla|	[model]="items()" en PanelMenu|
|(evento)|	Acción al recibir un aviso	|(menuRequested)="mobileOpen.set(true)"|
|[(visible)]|	Ida y vuelta: el Drawer abre y también actualiza el estado al cerrarse|	[(visible)]|="mobileOpen"
|MenuItem[]	|Forma tipada del menú de PrimeNG: label, icon, command|	items en Construir|

**La frontera del ISS**. Los tres componentes de `layout/` son presentación: reciben datos y avisan. El único con estado es Construir. Esa separación es la que permite reutilizar el layout en `ISS-02` sin duplicar `Header`, `Aside` ni `Footer`, y la que evita inyectar servicios de autenticación en componentes visuales.

**PARCHE** — standalone: true sobra. Angular 22 genera componentes standalone por defecto. Los ejemplos de material antiguo lo incluyen; es válido, pero redundante. Este curso no lo escribe.

### 1.2 El Aside recibe el menú con input()
Criterios de este sub-ítem

- [X] Aside declara `items = input<MenuItem[]>([])`
- [X] La plantilla usa `[model]="items()":` se lee el signal con paréntesis
- [X] El Aside no construye el menú ni conoce rutas: solo lo pinta
- [X] aside.css no contiene reglas

`src/app/layout/aside/aside.ts`

```typescript
import { Component, input, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';

/**
 * Menú lateral de la aplicación.
 *
 * Presentación pura: recibe el menú ya construido por `input()` y avisa de la
 * navegación con `output()`. No conoce rutas, permisos ni la API.
 */
@Component({
  host: { class: 'block h-full' },
  selector: 'app-aside',
  imports: [ButtonModule, PanelMenuModule],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
})
export class Aside {
  readonly appName = input('EnlaceExpress');

  /** Opciones del menú, en el formato `MenuItem` de PrimeNG. */
  readonly items = input<MenuItem[]>([]);

  /** Datos de sesión con valores por defecto: ISS-08 los completa. */
  readonly showSession = input(false);
  readonly username = input('');
  readonly roleLabel = input('Sin rol');
  readonly permissionCount = input(0);

  /** Aviso al padre: se seleccionó una opción (lo usa el Drawer en móvil). */
  readonly navigated = output<void>();

  /** Aviso al padre: se pidió cerrar sesión. */
  readonly logoutRequested = output<void>();

  /**
   * Un clic dentro del menú puede caer en el propio ítem o en un hijo suyo.
   * `closest` resuelve ambos casos con un solo listener en el `<nav>`.
   */
  onNavigationClick(event: Event): void {
    const target = event.target;
    if (target instanceof Element && target.closest('.p-panelmenu-item-link')) {
      this.navigated.emit();
    }
  }
}
```

`src/app/layout/aside/aside.html`

```html
<div class="flex h-full flex-col border-r border-slate-200 bg-white text-slate-900">
  <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
    <i class="pi pi-link text-lg text-teal-700" aria-hidden="true"></i>
    <div class="min-w-0">
      <p class="truncate text-sm font-semibold text-slate-900">{{ appName() }}</p>
      <p class="text-[11px] uppercase tracking-wider text-slate-400">
        Panel administrativo
      </p>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto p-3">
    <nav aria-label="Navegación principal" (click)="onNavigationClick($event)">
      <p-panelmenu [model]="items()" [multiple]="true" />
    </nav>
  </div>

  @if (showSession()) {
    <div class="border-t border-slate-200 p-4">
      <p class="text-sm font-medium text-slate-900">{{ username() || 'Invitado' }}</p>
      <p class="text-xs text-slate-400">{{ roleLabel() }}</p>
      <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{{ permissionCount() }} permisos</span>
        <button
          pButton
          type="button"
          text
          rounded
          aria-label="Cerrar sesión"
          (click)="logoutRequested.emit()"
        >
          <i pButtonIcon class="pi pi-sign-out"></i>
        </button>
      </div>
    </div>
  }
</div>
```

### 1.3 El Header avisa al padre con output()
Criterios de este sub-ítem

- [X] El botón de menú lleva `aria-label="Mostrar u ocultar el menú"` y no lleva `lg:hidden`
- [X] Al pulsarlo emite menuRequested; el Header no abre nada ni consulta el ancho
- [X] showSession sigue en false: no hay datos de sesión hasta ISS-08
- [X] header.css no contiene reglas

`src/app/layout/header/header.ts`

```typescript
import { Component, input, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';

/**
 * Barra superior de la aplicación.
 *
 * Es presentación pura: recibe los datos por `input()` y avisa al padre con
 * `output()`. No inyecta servicios, no consulta la API y no conoce permisos.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-header',
  imports: [AvatarModule, ButtonModule, MenuModule, TagModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  /** Nombre visible de la aplicación. */
  readonly appName = input('EnlaceExpress');

  /** Datos de sesión con valores por defecto: ISS-08 los completa. */
  readonly username = input('');
  readonly initials = input('IN');
  readonly roleLabel = input('Sin rol');
  readonly authEnabled = input(true);
  readonly showSession = input(false);
  readonly userItems = input<MenuItem[]>([]);

  /** Aviso al padre: el botón de menú se pulsó (solo visible en móvil). */
  readonly menuRequested = output<void>();
}
```

`src/app/layout/header/header.html`

```html
<header
  class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6"
>
  <!-- Botón de menú: siempre visible; el padre decide qué hacer (aside fijo o Drawer). -->
  <button
    pButton
    type="button"
    text
    rounded
    aria-label="Mostrar u ocultar el menú"
    (click)="menuRequested.emit()"
  >
    <i pButtonIcon class="pi pi-bars"></i>
  </button>

  <div class="min-w-0 flex-1">
    <p class="truncate text-sm font-semibold text-slate-900">{{ appName() }}</p>
    <p class="truncate text-xs text-slate-500">
      Gestión logística de envíos
    </p>
  </div>

  @if (showSession() && !authEnabled()) {
    <p-tag value="Fase I · sin auth" severity="warn" [rounded]="true" />
  }
  @if (username()) {
    <p-tag
      [value]="roleLabel()"
      severity="info"
      [rounded]="true"
      class="hidden sm:inline-flex"
    />
  }

  @if (showSession()) {
    <button
      pButton
      type="button"
      severity="secondary"
      outlined
      (click)="userMenuPanel.toggle($event)"
      aria-label="Menú de usuario"
    >
      <p-avatar [label]="initials()" shape="circle" size="normal" />
      <span class="hidden max-w-32 truncate text-sm font-medium text-slate-700 sm:block">
        {{ username() }}
      </span>
      <i class="pi pi-chevron-down pr-1 text-[10px] text-slate-400"></i>
    </button>
    <p-menu #userMenuPanel [model]="userItems()" [popup]="true" appendTo="body" />
  }
</header>
```

**Por qué el hijo no abre el Drawer**. El Drawer vive en Construir. Si el Header lo abriera, tendría que conocer el estado de otra pantalla. Con `output()` el Header solo dice «se pulsó el botón»; quien decide qué hacer es el padre:

```html
<app-header (menuRequested)="onMenuToggle()" />
```

Esa es la diferencia entre un componente reutilizable y uno acoplado.

> **PARCHE** — `<class="lg:hidden">` era un error de diseño. La primera versión ocultaba el botón con `lg:hidden`, así que desaparecía justo desde 1024 px, que es donde el Aside fijo ya se ve. Resultado: en escritorio el menú no se podía ocultar y en pantallas anchas el usuario no encontraba el botón. El botón debe estar siempre; lo que cambia es qué hace según el ancho. El Header no consulta el ancho (sigue siendo presentación pura): quien decide es el padre, con `onMenuToggle()`.

`sticky top-0 z-30` mantiene la barra visible al hacer scroll y por encima del contenido. El `@if (showSession())` deja el bloque de usuario fuera del DOM hasta ISS-08: no se pinta un avatar vacío que luego haya que ocultar.

### 1.4 features/construir: estado local y Drawer móvil
Criterios de este sub-ítem

- [X] mobileOpen, sidebarCollapsed y title son signal, no propiedades normales
- [X] Todas las opciones seleccionables del menú llaman a un único método seleccionar
- [X] seleccionar cambia el título y cierra el Drawer
- [X] onMenuToggle alterna el Aside fijo en escritorio y abre el Drawer en móvil
- [X] El Aside aparece una vez en el layout de escritorio y otra en el Drawer, con el mismo items
- [X] construir.css no contiene reglas

```bash
ng generate component features/construir --skip-tests --defaults
```

El `--skip-tests` no es para evitar pruebas: la prueba de esta pantalla se escribe completa en este ISS (más abajo) y sustituye a la plantilla vacía del CLI.

`src/app/features/construir/construir.ts`

```typescript
import { Component, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';
import { watchMediaQuery } from '../../core/utils/media-query';
import { Aside } from '../../layout/aside/aside';
import { Footer } from '../../layout/footer/footer';
import { Header } from '../../layout/header/header';

/**
 * Pantalla del prototipo.
 *
 * Es el único componente con estado en ISS-01B: guarda el título elegido y el
 * estado del menú. El layout solo recibe datos por `input()`; así en ISS-02 se
 * puede reutilizar sin duplicar Header, Aside ni Footer.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-construir',
  imports: [Aside, ButtonModule, CardModule, DrawerModule, Footer, Header],
  templateUrl: './construir.html',
  styleUrl: './construir.css',
})
export class Construir {
  /** `lg` de Tailwind: desde aquí el Aside es fijo y el botón lo alterna. */
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  /** Escritorio: el Aside fijo se oculta y el contenido se ensancha. */
  readonly sidebarCollapsed = signal(false);

  /** Móvil: el Drawer se abre desde el botón y se cierra al elegir una opción. */
  readonly mobileOpen = signal(false);

  /** Título del contenido. Cambia al elegir una opción del menú, sin HTTP. */
  readonly title = signal('Inicio');

  /**
   * Menú en el formato `MenuItem` de PrimeNG.
   *
   * `command` ejecuta una función al elegir la opción. Todavía no navega: solo
   * cambia el título. En ISS-02 cada comando apuntará a una ruta real.
   */
  readonly items: MenuItem[] = [
    {
      label: 'Operación',
      icon: 'pi pi-truck',
      items: [
        { label: 'Empresas', icon: 'pi pi-building', command: () => this.seleccionar('Empresas') },
        { label: 'Contactos', icon: 'pi pi-id-card', command: () => this.seleccionar('Contactos') },
        { label: 'Direcciones', icon: 'pi pi-map-marker', command: () => this.seleccionar('Direcciones') },
        { label: 'Mensajeros', icon: 'pi pi-send', command: () => this.seleccionar('Mensajeros') },
        { label: 'Tarifas', icon: 'pi pi-dollar', command: () => this.seleccionar('Tarifas') },
        { label: 'Rutas', icon: 'pi pi-map', command: () => this.seleccionar('Rutas') },
        { label: 'Envíos', icon: 'pi pi-box', command: () => this.seleccionar('Envíos') },
        { label: 'Paquetes', icon: 'pi pi-inbox', command: () => this.seleccionar('Paquetes') },
        {
          label: 'Eventos de seguimiento',
          icon: 'pi pi-history',
          command: () => this.seleccionar('Eventos de seguimiento'),
        },
        {
          label: 'Comprobantes de entrega',
          icon: 'pi pi-check-square',
          command: () => this.seleccionar('Comprobantes de entrega'),
        },
        { label: 'Facturas', icon: 'pi pi-file', command: () => this.seleccionar('Facturas') },
      ],
    },
    {
      label: 'Administración',
      icon: 'pi pi-shield',
      items: [
        { label: 'Usuarios', icon: 'pi pi-users', command: () => this.seleccionar('Usuarios') },
        { label: 'Roles', icon: 'pi pi-key', command: () => this.seleccionar('Roles') },
        { label: 'Recursos', icon: 'pi pi-list', command: () => this.seleccionar('Recursos') },
        {
          label: 'Asignaciones de rol',
          icon: 'pi pi-user-plus',
          command: () => this.seleccionar('Asignaciones de rol'),
        },
        {
          label: 'Concesiones de recursos',
          icon: 'pi pi-lock',
          command: () => this.seleccionar('Concesiones de recursos'),
        },
        { label: 'Sesiones', icon: 'pi pi-history', command: () => this.seleccionar('Sesiones') },
      ],
    },
  ];

  /**
   * Un solo botón, dos disposiciones: en escritorio alterna el Aside fijo; por
   * debajo de `lg` abre el Drawer (donde el Aside fijo no cabe).
   */
  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }

  /** Una sola puerta de entrada al estado: la usan las opciones seleccionables. */
  protected seleccionar(titulo: string): void {
    this.title.set(titulo);
    this.mobileOpen.set(false);
  }
}
```

**El helper que decide el ancho**

`src/app/core/utils/media-query.ts`

```typescript
import { DestroyRef, Signal, inject, signal } from '@angular/core';

/**
 * Observa una media query CSS y la expone como signal de solo lectura.
 */
export function watchMediaQuery(query: string): Signal<boolean> {
  const destroyRef = inject(DestroyRef);

  const media =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query)
      : null;

  const matches = signal(media?.matches ?? false);

  if (media) {
    const listener = (event: MediaQueryListEvent): void => matches.set(event.matches);
    media.addEventListener('change', listener);
    destroyRef.onDestroy(() => media.removeEventListener('change', listener));
  }

  return matches.asReadonly();
}
```

`src/app/features/construir/construir.html`

```html
<div class="flex min-h-screen flex-col bg-slate-100">
  <app-header (menuRequested)="onMenuToggle()" />

  <div class="flex flex-1">
    <!--
      Escritorio: Aside fijo que el botón del Header puede ocultar.
      Por debajo de lg no se pinta: el menú vive en el Drawer.
    -->
    @if (!sidebarCollapsed()) {
      <aside class="hidden w-72 shrink-0 lg:block">
        <app-aside [items]="items" (navigated)="mobileOpen.set(false)" />
      </aside>
    }

    <main id="contenido" class="min-w-0 flex-1 p-4 sm:p-6">
      <p-card class="block">
        <h1 class="text-2xl font-semibold text-slate-900">{{ title() }}</h1>
        <p class="mt-3 text-slate-600">
          Bienvenido a EnlaceExpress. Elige una opción del menú para explorar la estructura.
        </p>
        <p class="mt-2 text-sm text-slate-500">
          Esta primera pantalla usa datos locales. Los formularios y la conexión con
          Express se incorporan después.
        </p>
      </p-card>
    </main>
  </div>

  <app-footer />
</div>

<!-- Móvil: el mismo Aside, otra disposición. -->
<p-drawer [(visible)]="mobileOpen" header="Menú" position="left" styleClass="w-72">
  <app-aside [items]="items" (navigated)="mobileOpen.set(false)" />
</p-drawer>
```

**El flujo de un clic, de principio a fin**

```
clic en «Envíos» (dentro del Aside)
  ├─ PanelMenu ejecuta item.command()
  │     └─ seleccionar('Envíos') → title.set('Envíos') y mobileOpen.set(false)
  └─ el clic burbujea al <nav>, que emite navigated
        └─ Construir: (navigated)="mobileOpen.set(false)"   ← idempotente
```

Dos caminos que terminan en el mismo estado. No es redundancia inútil: el `command` funciona también con teclado, y `navigated` cubre el caso en que el Aside se reutilice con enlaces reales en ISS-02. Ambos llaman a .`set(false)`, así que no puede quedar desincronizado.

**El flujo del botón de menú, según el ancho**

        └─ Construir: (navigated)="mobileOpen.set(false)"   ← idempotente
```
clic en el botón del Header
  ├─ Header: (click)="menuRequested.emit()"        ← no sabe dónde está
  └─ Construir: onMenuToggle()
        ├─ ancho ≥ 1024px  → sidebarCollapsed.update(v => !v)   ← aside fijo
        └─ ancho < 1024px  → mobileOpen.set(true)               ← Drawer
        └─ Construir: (navigated)="mobileOpen.set(false)"   ← idempotente
```

`@if (!sidebarCollapsed())` envuelve el `<aside>:` en escritorio desaparece del DOM, no se oculta con una clase. Así el contenido recupera el ancho real y no queda un hueco de 288 px.

**Prueba de la pantalla**

`src/app/features/construir/construir.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { Construir } from './construir';

/**
 * jsdom no implementa `matchMedia`, así que `watchMediaQuery` devuelve `false`
 * y el componente se comporta como móvil. El caso de escritorio se prueba aquí
 * sustituyendo la función antes de crear el componente.
 */
function stubDesktopMedia(matches: boolean): () => void {
  const original = window.matchMedia;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) =>
      ({
        matches,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList,
  });

  return () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: original,
    });
  };
}

describe('Construir', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Construir],
    }).compileComponents();
  });

  async function crearPantalla() {
    const fixture = TestBed.createComponent(Construir);
    await fixture.whenStable();
    return { fixture, compilado: fixture.nativeElement as HTMLElement };
  }

  function botonMenu(compilado: HTMLElement): HTMLButtonElement {
    const boton = compilado.querySelector(
      'app-header button[aria-label="Mostrar u ocultar el menú"]',
    );
    expect(boton).toBeTruthy();
    return boton as HTMLButtonElement;
  }

  function opcionDelMenu(compilado: HTMLElement, etiqueta: string): HTMLElement {
    const opcion = [...compilado.querySelectorAll('a, button')].find(
      (elemento) => elemento.textContent?.trim() === etiqueta,
    );
    expect(opcion).toBeTruthy();
    return opcion as HTMLElement;
  }

  it('should compose the layout and start on Inicio', async () => {
    const { compilado } = await crearPantalla();

    expect(compilado.querySelector('app-header')).toBeTruthy();
    expect(compilado.querySelector('aside app-aside')).toBeTruthy();
    expect(compilado.querySelector('app-footer')).toBeTruthy();
    expect(compilado.querySelector('main h1')?.textContent).toContain('Inicio');
  });

  it('should render backend entity options in their menu groups', async () => {
    const { fixture, compilado } = await crearPantalla();

    for (const etiqueta of ['Inicio', 'Operación', 'Administración']) {
      expect(compilado.textContent).toContain(etiqueta);
    }

    opcionDelMenu(compilado, 'Operación').click();
    fixture.detectChanges();
    await fixture.whenStable();
    for (const etiqueta of [
      'Empresas',
      'Contactos',
      'Direcciones',
      'Mensajeros',
      'Tarifas',
      'Rutas',
      'Envíos',
      'Paquetes',
      'Eventos de seguimiento',
      'Comprobantes de entrega',
      'Facturas',
    ]) {
      expect(compilado.textContent).toContain(etiqueta);
    }

    opcionDelMenu(compilado, 'Administración').click();
    fixture.detectChanges();
    await fixture.whenStable();
    for (const etiqueta of [
      'Usuarios',
      'Roles',
      'Recursos',
      'Asignaciones de rol',
      'Concesiones de recursos',
      'Sesiones',
    ]) {
      expect(compilado.textContent).toContain(etiqueta);
    }
  });

  it('should always show the menu button, not only on small screens', async () => {
    const { compilado } = await crearPantalla();

    // `lg:hidden` ocultaba el botón justo cuando el Aside ya era visible.
    expect(botonMenu(compilado).classList.contains('lg:hidden')).toBe(false);
  });

  it('should change the title without navigating when an option is chosen', async () => {
    const { fixture, compilado } = await crearPantalla();

    opcionDelMenu(compilado, 'Operación').click();
    fixture.detectChanges();
    await fixture.whenStable();
    opcionDelMenu(compilado, 'Empresas').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compilado.querySelector('main h1')?.textContent).toContain('Empresas');
    // Sigue en la misma pantalla: no hay recarga ni petición HTTP.
    expect(compilado.querySelector('app-construir, main')).toBeTruthy();
  });

  it('should open the mobile drawer when the header requests it', async () => {
    const { fixture, compilado } = await crearPantalla();
    const componente = fixture.componentInstance as unknown as {
      mobileOpen: () => boolean;
    };

    expect(componente.mobileOpen()).toBe(false);

    const botonMenu = compilado.querySelector(
      'app-header button[aria-label="Mostrar u ocultar el menú"]',
    ) as HTMLButtonElement;
    expect(botonMenu).toBeTruthy();

    botonMenu.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(componente.mobileOpen()).toBe(true);
  });

  it('should hide the fixed aside on desktop instead of opening the drawer', async () => {
    const restaurar = stubDesktopMedia(true);

    try {
      const { fixture, compilado } = await crearPantalla();
      expect(compilado.querySelector('aside app-aside')).toBeTruthy();

      botonMenu(compilado).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.sidebarCollapsed()).toBe(true);
      expect(compilado.querySelector('aside')).toBeNull();
      expect(fixture.componentInstance.mobileOpen()).toBe(false);
    } finally {
      restaurar();
    }
  });

  it('should close the drawer after choosing an option', async () => {
    const { fixture, compilado } = await crearPantalla();
    const componente = fixture.componentInstance as unknown as {
      mobileOpen: () => boolean;
    };

    const botonMenu = compilado.querySelector(
      'app-header button[aria-label="Mostrar u ocultar el menú"]',
    ) as HTMLButtonElement;
    botonMenu.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(componente.mobileOpen()).toBe(true);

    opcionDelMenu(compilado, 'Operación').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(componente.mobileOpen()).toBe(true);

    opcionDelMenu(compilado, 'Envíos').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(componente.mobileOpen()).toBe(false);
    expect(compilado.querySelector('main h1')?.textContent).toContain('Envíos');
  });
});
```

La prueba del Drawer lee el signal desde la instancia (mobileOpen()), no del DOM: el Drawer de PrimeNG se monta en un overlay y comprobar su visibilidad con selectores es frágil. Se verifica el estado, que es lo que el componente controla.

La prueba de escritorio sustituye window.matchMedia antes de crear el componente, porque watchMediaQuery lee la media query al construirse. Así se comprueban las dos ramas del mismo botón: Drawer en móvil, Aside alternado en escritorio.

### 1.5 App pasa a ser punto de entrada con router-outlet

**Criterios de este sub-ítem**

- [X] app.ts importa solo RouterOutlet
- [X] app.html contiene únicamente <router-outlet />
- [X] app.routes.ts usa loadComponent para construir
- [X] '' y ** redirigen a construir

Este es el momento de presentar RouterOutlet, no ISS-01: ahora existe una pantalla real que mostrar por URL. La idea en una frase: `<router-outlet />` es un ancla; el router inserta a su lado el componente de la ruta activa.

`src/app/app.ts`

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente principal (`<app-root>`).
 *
 * Desde ISS-01B es solo el punto de entrada: el router elige qué componente se
 * dibuja dentro de `<router-outlet />` según la URL.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

`src/app/app.html`

```html
<!-- El router dibuja aquí el componente de la ruta activa (app.routes.ts). -->
<router-outlet />
```

`src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 *
 * ISS-01B presenta el router con una pantalla real. `loadComponent` descarga
 * `Construir` solo cuando se visita su URL: el bundle inicial no lo incluye.
 */
export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  { path: '', pathMatch: 'full', redirectTo: 'construir' },
  { path: '**', redirectTo: 'construir' },
];
```

El enlace a `/login` todavía no existe. La pantalla de login es ISS-08. Este ISS no importa RouterLink ni escribe `<a routerLink="/login">:` el prototipo no ofrece una ruta que llevaría a un 404. El texto de bienvenida lo anuncia («los formularios y la conexión con Express se incorporan después»).

**Prueba del punto de entrada**

`src/app/app.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // Sin rutas: esta prueba comprueba el punto de entrada, no las pantallas.
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compilado = fixture.nativeElement as HTMLElement;
    expect(compilado.querySelector('router-outlet')).toBeTruthy();
  });
});
```

### 1.6 Comprobar antes de avanzar

**Criterios de este sub-ítem**

- [X] A 1280 px se ven las entidades agrupadas de Operación y Administración y no hay scroll horizontal
- [X] A 1280 px el botón de menú se ve y al pulsarlo oculta el Aside (sin abrir el Drawer)
- [X] A 390 px el Aside no se ve y el botón del Header abre el Drawer
- [X] Elegir una opción cambia el título y cierra el Drawer
- [X] La URL no cambia y Network no registra /api
- [X] Con teclado se recorre el menú y se activa con Enter
- [X] ng build termina con código 0

```
npm start
```

![alt text](img-angular/start_iss01B.png)

## Fase I: Frontend — ISS-02 — Núcleo: environment, modelos, servicios y layout

**Objetivo:** dejar lista la capa de infraestructura del frontend antes de tocar pantallas de negocio:

1. environment con la URL del backend y el interruptor de autenticación.
2. Interfaces TypeScript que reflejan el contrato REST de Express.
3. Servicios HTTP que devuelven Observable<T> ya desenvuelto.
4. Utilidades transversales (toApiMessage, NotificationService).
5. Componentes de UI reutilizables y el layout Shell.

**Bloqueado por:** ISS-01B.

**Criterios de aceptación (ISS-02) — consolidados**

- [X] 2.1 environment.apiUrl === 'http://localhost:4000/api', sin slash final
- [X] 2.1 environment y environment.development.ts existen y angular.json aplica fileReplacements
- [X] 2.2 Los 16 modelos de entidades coinciden con los modelos y rutas de `api-backend.md`
- [X] 2.2 Money acepta number | string y toNumber() normaliza DECIMAL
- [X] 2.2 Se distinguen `is_active`, `status` de RBAC y los enums de `estado` del dominio
- [X] 2.3 Cada servicio usa this.base construido desde environment.apiUrl
- [X] 2.3 list()/get()/create() devuelven la entidad, no la envoltura del JSON
- [X] 2.3 Cada servicio desenvuelve las claves reales del controlador; pivotes: { assignments } y { grants }
- [X] 2.4 toApiMessage distingue status === 0 (backend caído) de un 403
- [X] 2.4 NotificationService traduce a MessageService con duraciones por severidad
- [X] 2.5 PageHeader, EmptyState y StatusTag compilan como standalone y no añaden CSS
- [X] 2.5 StatusTag se repinta al cambiar el input gracias a computed
- [X] 2.6 Shell compone Header/aside/router-outlet/Footer una sola vez; el botón del Header alterna el Aside en escritorio y abre el Drawer en móvil
- [X] 2.6 app.routes.ts carga Shell con loadComponent y conserva el prototipo
- [X] 2.7 provideHttpClient() está registrado y no hay interceptores de sesión
- [X] 2.8 ng build termina con código 0 y shell aparece como chunk diferido
- [X] 2.8 Las pruebas pasan: 8 archivos, 33 casos

> demo/ejemplo sigue fuera. La introducción a Angular quedó en ISS-01: no tiene ruta, no está en el menú y no se compone aquí.

### 2.1 environment: una sola URL para todo el frente

**Criterios de este sub-ítem**

- [X] apiUrl termina en /api, nunca en /
- [X] Existen environment.ts (build) y environment.development.ts (ng serve)
- [X] angular.json sustituye el archivo en la configuración development
- [X] primeUiLicense está documentado en ambos archivos (clave Community PrimeUI; ISS-01 §1.4.1)

```bash
ng generate environments
```

Crea los dos archivos y registra el reemplazo. Si ya existen, edítalos sin repetir el generador.

`src/environments/environment.ts` — lo usa ng build, es el base:

```typescript
 /**
 * Entorno de producción (`ng build`).
 *
 * `apiUrl` termina en `/api` SIN slash final: con uno, las llamadas saldrían
 * como `//companies` y Express las trataría como otra ruta.
 *
 * `requireAuth`: mitad frontal del interruptor de fases. Nadie lo lee hasta
 * ISS-08 (Fase II). Se empareja con `AUTH_ENABLED` del backend: mover una sola
 * mitad produce `401 Missing Bearer token` (ISS-11 §11.1).
 *
 * `primeUiLicense`: clave **Community** de PrimeUI (PrimeNG 22). Solicítala en
 * https://primeui.dev · requisitos en https://primeui.dev/licenses. Déjala en `''`
 * si aún no la tienes (aviso en consola; la app funciona). No subas claves
 * comerciales al repo.
 */
export const environment = {
  production: true,
  appName: 'EnlaceExpress',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense: '',
};
```

`src/environments/environment.development.ts` — lo usa ng serve y npm test:

```typescript
/**
 * En el día a día del laboratorio es **este** archivo el que importa Angular
 * (vía `fileReplacements`). Pega aquí la misma `primeUiLicense` que en producción.
 */
export const environment = {
  production: false,
  appName: 'EnlaceExpress',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense: '',
};
```

### 2.1.1 Licencia PrimeUI (primeUiLicense)

Tras ISS-01, `app.config.ts` registra PrimeNG así:

```typescript
providePrimeNG({
  license: environment.primeUiLicense || undefined,
  // ...
});
```

Pasos:

1. Solicita la Community License (gratuita para estudiantes) en https://primeui.dev.
2. Copia la clave del correo (cadena larga, suele empezar por eyJ…).
3. Pégala en primeUiLicense de environment.development.ts (para ng serve).
4. Repite el mismo valor en environment.ts (para ng build / entrega).
5. Reinicia ng serve y recarga el navegador: desaparecen [PrimeUI] No license key configured y la banda Invalid PrimeUI License.

Si trabajas sin clave, mantén primeUiLicense: '' y documenta el aviso en la evidencia (ISS-01 §1.4.1).

`angular.json` → `projects.<proyecto>.architect.build.configurations.development:`

```json
"development": {
  "optimization": false,
  "extractLicenses": false,
  "sourceMap": true,
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.development.ts"
    }
  ]
}
```

### 2.2 Modelos: reflejar el backend, no inventarlo
Criterios de este sub-ítem

- [X] Cada entidad tiene su interfaz y su Payload de escritura
- [X] Los modelos de lectura no exponen password
- [X] Money cubre number | string; toNumber() normaliza
- [X] Los campos son los del backend, en snake_case

```bash
ng generate interface core/models/api --type=model --defaults
ng generate interface core/models/company --type=model --defaults
ng generate interface core/models/contact --type=model --defaults
ng generate interface core/models/address --type=model --defaults
ng generate interface core/models/messenger --type=model --defaults
ng generate interface core/models/rate --type=model --defaults
ng generate interface core/models/route --type=model --defaults
ng generate interface core/models/shipment --type=model --defaults
ng generate interface core/models/package --type=model --defaults
ng generate interface core/models/tracking-event --type=model --defaults
ng generate interface core/models/delivery-proof --type=model --defaults
ng generate interface core/models/invoice --type=model --defaults
ng generate interface core/models/user --type=model --defaults
ng generate interface core/models/role --type=model --defaults
ng generate interface core/models/resource --type=model --defaults
ng generate interface core/models/role-user --type=model --defaults
ng generate interface core/models/resource-role --type=model --defaults
ng generate interface core/models/auth --type=model --defaults
```

Cada comando crea un `*.model.ts` con una interfaz vacía. Se declaran 11 entidades de operación y 5 de usuarios/RBAC. `auth.model.ts` contiene los contratos de autenticación; las sesiones internas no exponen el hash del refresh token. El dashboard se deriva en ISS-07 de envíos, rutas, facturas y permisos disponibles; no se inventan estadísticas sin contrato.

`api.model.ts`— los tipos que comparten todos

```typescript
/** Solo para entidades de usuarios/RBAC que usan el campo `status`. */
export type Status = 'active' | 'inactive';
export type Money = number | string;

export interface ApiError {
  error: string;
  detail?: string;
}

/** Firma mínima de los objetos Sequelize que devuelve el backend. */
export interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface ActiveRecord extends Timestamps {
  id: number;
  is_active: boolean;
}

export function toNumber(value: Money | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
```

**Por qué Money es una unión**. Sequelize define `valor_base`, `peso_total_kg`, `costo_calculado`, `subtotal` y `total` como DECIMAL. Según el motor y el driver, esos valores pueden llegar como number o string ("12.50"). `toNumber()` los normaliza antes de cálculos o formato; no sumes valores de respuesta sin convertirlos.


### Las entidades

`src/app/core/models/company.model.ts`, `contact.model.ts` y `address.model.ts`

```typescript
import { ActiveRecord, Money } from './api.model';

/** Tabla `companies` — GET /api/companies devuelve { companies }. */
export interface Company extends ActiveRecord {
  nit: string;
  razon_social: string;
  contacto_principal_id: number | null;
  direccion_facturacion_id: number | null;
}

export interface CompanyPayload {
  nit: string;
  razon_social: string;
  contacto_principal_id?: number | null;
  direccion_facturacion_id?: number | null;
  is_active?: boolean;
}

export interface Contact extends ActiveRecord {
  empresa_id: number;
  nombre: string;
  cargo: string | null;
  telefono: string | null;
  email: string | null;
  is_principal: boolean;
}

export interface ContactPayload {
  empresa_id: number;
  nombre: string;
  cargo?: string | null;
  telefono?: string | null;
  email?: string | null;
  is_principal?: boolean;
  is_active?: boolean;
}

export type AddressType = 'recogida' | 'entrega' | 'mixta';

export interface Address extends ActiveRecord {
  empresa_id: number;
  alias: string;
  linea1: string;
  linea2: string | null;
  ciudad: string;
  departamento: string | null;
  pais: string | null;
  codigo_postal: string | null;
  latitud: Money | null;
  longitud: Money | null;
  tipo: AddressType;
}

export interface AddressPayload {
  empresa_id: number;
  alias: string;
  linea1: string;
  linea2?: string | null;
  ciudad: string;
  departamento?: string | null;
  pais?: string | null;
  codigo_postal?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  tipo: AddressType;
  is_active?: boolean;
}
```

La relación es logística: un `Company` agrupa `Contact` y `Address`. Los campos opcionales del DTO se envían solo cuando se editan; las respuestas reflejan nullable del modelo.

`messenger.model.ts`, `rate.model.ts`, `route.model.ts`, `package.model.ts` y `tracking-event.model.ts`

```typescript
import { ActiveRecord, Money } from './api.model';

export type VehicleType = 'moto' | 'carro' | 'bicicleta' | 'a_pie';
export interface Messenger extends ActiveRecord {
  nombre: string;
  documento_identidad: string;
  telefono: string | null;
  tipo_vehiculo: VehicleType;
  placa_vehiculo: string | null;
  zona_asignada: string | null;
}
export interface MessengerPayload {
  nombre: string;
  documento_identidad: string;
  telefono?: string | null;
  tipo_vehiculo: VehicleType;
  placa_vehiculo?: string | null;
  zona_asignada?: string | null;
  is_active?: boolean;
}

export type CalculationRule = 'por_peso' | 'por_zona' | 'plana';
export interface Rate extends ActiveRecord {
  nombre: string;
  zona: string;
  regla_calculo: CalculationRule;
  valor_base: Money;
  valor_por_kg_adicional: Money | null;
  recargo_urgente_pct: Money | null;
  vigencia_desde: string;
  vigencia_hasta: string | null;
}
export interface RatePayload {
  nombre: string;
  zona: string;
  regla_calculo: CalculationRule;
  valor_base: number;
  valor_por_kg_adicional?: number | null;
  recargo_urgente_pct?: number | null;
  vigencia_desde: string;
  vigencia_hasta?: string | null;
  is_active?: boolean;
}

export type RouteStatus = 'planificada' | 'en_curso' | 'finalizada';
export interface Route extends ActiveRecord {
  nombre: string;
  mensajero_id: number;
  zona_cobertura: string | null;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  estado: RouteStatus;
}
export interface RoutePayload {
  nombre: string;
  mensajero_id: number;
  zona_cobertura?: string | null;
  fecha: string;
  hora_inicio?: string | null;
  hora_fin?: string | null;
  estado: RouteStatus;
  is_active?: boolean;
}

export interface Package extends ActiveRecord {
  envio_id: number;
  descripcion_contenido: string | null;
  peso_kg: Money;
  alto_cm: Money | null;
  ancho_cm: Money | null;
  largo_cm: Money | null;
  valor_declarado: Money | null;
  es_fragil: boolean;
}
export interface PackagePayload {
  envio_id: number;
  descripcion_contenido?: string | null;
  peso_kg: number;
  alto_cm?: number | null;
  ancho_cm?: number | null;
  largo_cm?: number | null;
  valor_declarado?: number | null;
  es_fragil?: boolean;
  is_active?: boolean;
}

export type TrackingEventType =
  | 'recogido'
  | 'en_transito'
  | 'en_reparto'
  | 'novedad'
  | 'entregado'
  | 'devuelto';
export type TrackingEventStatus = 'informativo' | 'novedad_leve' | 'novedad_critica';
export interface TrackingEvent extends ActiveRecord {
  envio_id: number;
  tipo: TrackingEventType;
  fecha: string;
  ubicacion: string | null;
  observaciones: string | null;
  estado: TrackingEventStatus;
  registrado_por_id: number | null;
}
export interface TrackingEventPayload {
  envio_id: number;
  tipo: TrackingEventType;
  fecha: string;
  ubicacion?: string | null;
  observaciones?: string | null;
  estado: TrackingEventStatus;
  registrado_por_id?: number | null;
  is_active?: boolean;
}
```

`shipment.model.ts`, `delivery-proof.model.ts` e `invoice.model.ts`

```typescript
import { ActiveRecord, Money } from './api.model';

export type ShipmentPriority = 'normal' | 'urgente' | 'express';
export type ShipmentStatus =
  | 'creado'
  | 'cotizado'
  | 'asignado'
  | 'en_ruta'
  | 'entregado'
  | 'con_novedad'
  | 'cancelado';

export interface Shipment extends ActiveRecord {
  numero_guia: string;
  empresa_id: number;
  contacto_origen_id: number;
  direccion_origen_id: number;
  contacto_destino_id: number;
  direccion_destino_id: number;
  mensajero_id: number | null;
  ruta_id: number | null;
  tarifa_id: number;
  factura_id: number | null;
  prioridad: ShipmentPriority;
  peso_total_kg: Money;
  valor_declarado: Money | null;
  costo_calculado: Money | null;
  estado: ShipmentStatus;
  fecha_solicitud: string;
  fecha_entrega_estimada: string | null;
  fecha_entrega_real: string | null;
}
export interface ShipmentPayload {
  numero_guia: string;
  empresa_id: number;
  contacto_origen_id: number;
  direccion_origen_id: number;
  contacto_destino_id: number;
  direccion_destino_id: number;
  mensajero_id?: number | null;
  ruta_id?: number | null;
  tarifa_id: number;
  factura_id?: number | null;
  prioridad: ShipmentPriority;
  peso_total_kg: number;
  valor_declarado?: number | null;
  costo_calculado?: number | null;
  estado: ShipmentStatus;
  fecha_solicitud: string;
  fecha_entrega_estimada?: string | null;
  fecha_entrega_real?: string | null;
  is_active?: boolean;
}

export type DeliveryProofStatus = 'valida' | 'observada' | 'rechazada';
export interface DeliveryProof extends ActiveRecord {
  envio_id: number;
  fecha_hora: string;
  receptor_nombre: string;
  receptor_documento: string | null;
  firma_url: string | null;
  foto_url: string | null;
  geolocalizacion_lat: Money | null;
  geolocalizacion_lng: Money | null;
  observaciones: string | null;
  estado: DeliveryProofStatus;
}
export interface DeliveryProofPayload {
  envio_id: number;
  fecha_hora: string;
  receptor_nombre: string;
  receptor_documento?: string | null;
  firma_url?: string | null;
  foto_url?: string | null;
  geolocalizacion_lat?: number | null;
  geolocalizacion_lng?: number | null;
  observaciones?: string | null;
  estado: DeliveryProofStatus;
  is_active?: boolean;
}

export type InvoiceStatus = 'pendiente' | 'pagada' | 'vencida' | 'anulada';
export interface Invoice extends ActiveRecord {
  numero: string;
  empresa_id: number;
  periodo_desde: string;
  periodo_hasta: string;
  fecha: string;
  subtotal: Money;
  impuestos: Money | null;
  total: Money;
  estado: InvoiceStatus;
  fecha_pago: string | null;
}
export interface InvoicePayload {
  numero: string;
  empresa_id: number;
  periodo_desde: string;
  periodo_hasta: string;
  fecha: string;
  subtotal: number;
  impuestos?: number | null;
  total: number;
  estado: InvoiceStatus;
  fecha_pago?: string | null;
  is_active?: boolean;
}
```

`Shipment`, `DeliveryProof` e `Invoice` son entidades distintas: los costos y estados siguen el ciclo logístico y de facturación del backend; no existe un flujo de carrito. Antes de fijar cada `Payload`, contrástalo con el DTO/controlador de esa ruta; `api-backend.md` resume campos de dominio, no sustituye los contratos de escritura.

`user.model.ts, role.model.ts, resource.model.ts.`

```typescript
import { Status, Timestamps } from './api.model';

/** Tabla `users` — /api/usuarios. Nunca incluye `password`. */
export interface User extends Timestamps {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: Status;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  status?: Status;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  avatar?: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface Role extends Timestamps {
  id: number;
  name: string;          // el backend lo normaliza a MAYÚSCULAS
  description: string | null;
  status: Status;
}

export interface RolePayload {
  name: string;
  description?: string | null;
  status?: Status;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/** Tabla `resources` — /api/recursos (catálogo de 58 pares method+path). */
export interface Resource extends Timestamps {
  id: number;
  path: string;
  method: HttpMethod;
  description: string | null;
  status: Status;
}

export interface ResourcePayload {
  path: string;
  method: HttpMethod;
  description?: string | null;
  status?: Status;
}
```

`role-user.model.ts` y `resource-role.model.ts` — los dos pivotes RBAC.

```typescript
import { Status, Timestamps } from './api.model';

/** Pivote `role_users` — /api/asignaciones-rol */
export interface RoleUser extends Timestamps {
  id: number;
  user_id: number;
  role_id: number;
  status: Status;
}
export type RoleUserPayload = Pick<RoleUser, 'user_id' | 'role_id'>;

/** Pivote `resource_roles` — /api/concesiones-rol. Cada fila ES un permiso. */
export interface ResourceRole extends Timestamps {
  id: number;
  resource_id: number;
  role_id: number;
  status: Status;
}
export type ResourceRolePayload = Pick<ResourceRole, 'role_id' | 'resource_id'>;
```

`auth.model.ts` — los tokens y permisos efectivos. No se modela el RefreshToken interno: `token_hash` nunca debe entrar al frontend.

```typescript
import { HttpMethod } from './resource.model';

export interface SessionTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface EffectivePermission {
  resource_id: number;
  method: HttpMethod;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}

/** Respuesta segura de /api/sesiones; el DTO excluye token_hash y añade is_expired. */
export interface UserSession extends Timestamps {
  id: number;
  user_id: number;
  family_id: string;
  device_info: string | null;
  expires_at: string;
  status: Status;
  is_expired: boolean;
}
```

No se declara `DashboardData`: `api-backend.md` no documenta un endpoint de dashboard. ISS-07 deberá derivarlo de endpoints existentes y permisos disponibles o esperar un contrato agregado del backend.

`is_active` es el indicador lógico de las entidades de operación y usa `PATCH /:id/deactivate`. `status` pertenece a usuarios/RBAC; `estado` representa el flujo de negocio de rutas, envíos, eventos, comprobantes y facturas. No intercambies esos tres campos ni asumas que comparten enum.

### 2.3 Servicios HTTP por feature: desenvolver la respuesta
Criterios de este sub-ítem

- [X] Cada servicio es `@Injectable({ providedIn: 'root' })` y usa `inject(HttpClient)`
- [X] base se construye una vez desde `environment.apiUrl`
- [X] Los métodos devuelven `Observable<Entidad>`, no Observable<{ entidad }>
- [X] Ninguna URL se escribe completa dentro de un método

```bash
ng generate service features/companies/company-api --skip-tests --defaults
ng generate service features/contacts/contact-api --skip-tests --defaults
ng generate service features/addresses/address-api --skip-tests --defaults
ng generate service features/messengers/messenger-api --skip-tests --defaults
ng generate service features/rates/rate-api --skip-tests --defaults
ng generate service features/routes/route-api --skip-tests --defaults
ng generate service features/shipments/shipment-api --skip-tests --defaults
ng generate service features/packages/package-api --skip-tests --defaults
ng generate service features/tracking-events/tracking-event-api --skip-tests --defaults
ng generate service features/delivery-proofs/delivery-proof-api --skip-tests --defaults
ng generate service features/invoices/invoice-api --skip-tests --defaults
ng generate service features/admin/users/user-api --skip-tests --defaults
ng generate service features/admin/roles/role-api --skip-tests --defaults
ng generate service features/admin/resources/resource-api --skip-tests --defaults
ng generate service features/admin/role-users/role-user-api --skip-tests --defaults
ng generate service features/admin/resource-roles/resource-role-api --skip-tests --defaults
ng generate service features/auth/session-api --skip-tests --defaults
ng generate service core/services/notification --skip-tests --defaults
```

Los paths no se deducen del nombre español de la entidad. Se usan exactamente como están montados en Express:

| Entidad | Recurso bajo `environment.apiUrl` |
| --- | --- |
| Company | `/companies` |
| Contact | `/contacts` |
| Address | `/address` |
| Messenger | `/messengers` |
| Rate | `/rates` |
| Route | `/routes` |
| Shipment | `/shipments` |
| Package | `/packages` |
| TrackingEvent | `/tracking_events` |
| DeliveryProof | `/delivery_proofs` |
| Invoice | `/invoices` |
| User | `/usuarios` |
| Role | `/roles` |
| Resource | `/recursos` |
| RoleUser | `/asignaciones-rol` |
| ResourceRole | `/concesiones-rol` |
| Sesiones propias | `/sesiones` |

`SessionApi` cubre además `POST /sesion/login`, `POST /sesion/refresh`, `POST /sesion/logout`, `GET /sesion/perfil` y `GET /permisos`. No enviar `token_hash` al cliente. Salvo login/refresh, las rutas de negocio y RBAC requieren autenticación y permiso; se probarán con `HttpTestingController` hasta ISS-08.

`--skip-tests` aquí sí es deliberado: los servicios se prueban con `HttpTestingController`, agrupados por contrato y dominio, no con stubs vacíos por archivo. Los endpoints de negocio y RBAC requieren token y permiso según `api-backend.md`; las pruebas los simulan y no necesitan el backend levantado.

**El contrato real del backend**

`company-api.ts — el patrón completo`

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, CompanyPayload } from '../../core/models/company.model';

/** Contrato de `features/business/companies` en Express. */
@Injectable({ providedIn: 'root' })
export class CompanyApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/companies`;

  list(): Observable<Company[]> {
    return this.http
      .get<{ companies: Company[] }>(this.base)
      .pipe(map((response) => response.companies));
  }

  get(id: number): Observable<Company> {
    return this.http
      .get<{ companies: Company }>(`${this.base}/${id}`)
      .pipe(map((response) => response.companies));
  }

  create(payload: CompanyPayload): Observable<Company> {
    return this.http
      .post<{ companies: Company }>(this.base, payload)
      .pipe(map((response) => response.companies));
  }

  update(id: number, payload: Partial<CompanyPayload>): Observable<Company> {
    return this.http
      .patch<{ companies: Company }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.companies));
  }

  replace(id: number, payload: CompanyPayload): Observable<Company> {
    return this.http
      .put<{ companies: Company }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.companies));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
```

Dónde se desenvuelve. En el `.pipe(map(...))` del servicio, no en el componente:

```
GET /api/companies
  → Express responde  { "companies": [ {...}, {...} ] }
  → CompanyApi.map     devuelve [ {...}, {...} ]        ← Observable<Company[]>
  → el componente      recibe Company[] y lo pinta
```

`CompaniesController` usa `companies` también para get/create/update de un registro; el nombre plural es parte del contrato actual. No infieras las claves de respuesta desde el nombre del modelo: confirma cada una en su controlador. La UI recibe entidades ya desenvueltas; las envolturas pivote son `{ assignments }` y `{ grants }`.

Los otros servicios, en una línea cada uno

```typescript
// address-api.ts — el recurso de Address es singular en la URL
private readonly base = `${environment.apiUrl}/address`;
list(): Observable<Address[]> {
  return this.http.get<{ addresses: Address[] }>(this.base)
    .pipe(map((response) => response.addresses));
}

// shipment-api.ts — las respuestas de detalle usan { shipment }
private readonly base = `${environment.apiUrl}/shipments`;
get(id: number): Observable<Shipment> {
  return this.http.get<{ shipment: Shipment }>(`${this.base}/${id}`)
    .pipe(map((response) => response.shipment));
}

// role-user-api.ts — envoltura { assignments }, no { role_users }
list(): Observable<RoleUser[]> {
  return this.http.get<{ assignments: RoleUser[] }>(this.base)
    .pipe(map((r) => r.assignments));
}

// resource-role-api.ts — filtros por query y envoltura { grants }
list(filters?: { role_id?: number; resource_id?: number }): Observable<ResourceRole[]> {
  let params = new HttpParams();
  if (filters?.role_id) { params = params.set('role_id', filters.role_id); }
  if (filters?.resource_id) { params = params.set('resource_id', filters.resource_id); }
  return this.http.get<{ grants: ResourceRole[] }>(this.base, { params })
    .pipe(map((r) => r.grants));
}
```

**Prueba del servicio con** `HttpTestingController`

`src/app/features/companies/company-api.spec.ts`

```typescript
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Company } from '../../core/models/company.model';
import { CompanyApi } from './company-api';

const BASE = `${environment.apiUrl}/companies`;
const COMPANY: Company = {
  id: 1,
  nit: '900123456',
  razon_social: 'Empresa de prueba',
  contacto_principal_id: null,
  direccion_facturacion_id: null,
  is_active: true,
};

describe('CompanyApi', () => {
  let api: CompanyApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(CompanyApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { companies } into Company[]', () => {
    let resultado: Company[] | undefined;
    api.list().subscribe((companies) => (resultado = companies));

    const peticion = http.expectOne(BASE);
    expect(peticion.request.method).toBe('GET');
    peticion.flush({ companies: [COMPANY] });

    expect(resultado).toEqual([COMPANY]);
  });

  it('should build URLs from environment.apiUrl (no trailing slash)', () => {
    expect(environment.apiUrl.endsWith('/api')).toBe(true);
    api.list().subscribe();
    http.expectOne('http://localhost:4000/api/companies').flush({ companies: [] });
  });
});
```

`HttpTestingController` no necesita el backend levantado: simula la respuesta y permite afirmar dos cosas: la URL construida y que la envoltura desaparece. `http.verify()` falla si quedó una petición sin responder, así que también detecta llamadas de más.

### 2.4 Utilidades transversales: toApiMessage y NotificationService
Criterios de este sub-ítem

- [X] Un único lugar traduce el error HTTP a texto legible
- [X] status === 0 se explica como backend caído
- [X] NotificationService fija la duración por severidad

`src/app/core/utils/api-error.ts`

```typescript
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Traduce el error HTTP del backend a un texto para el usuario.
 * Express responde `{ error, detail? }`; los 403 de RBAC son opacos a propósito.
 */
export function toApiMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: string; detail?: string } | string | null;

    if (error.status === 0) {
      return 'No se pudo conectar con el backend. Verifica que esté en http://localhost:4000.';
    }
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object' && body.error) {
      return body.detail ? `${body.error} — ${body.detail}` : body.error;
    }
    return error.message;
  }
  return error instanceof Error ? error.message : 'Error inesperado';
}
```

**Los cuatro casos que importan:**

|Situación|	status	|Mensaje|
|----------|-------|-------|
|Backend apagado o CORS rechazado|	0|	«No se pudo conectar con el backend…»|
|Error JSON de Express|	4xx/5xx|	Mostrar `error` y, si existe, `detail` del endpoint real|
|Token ausente o inválido	|401	|Error de autenticación del backend|
|Permiso denegado por RBAC	|403	|No revelar detalles del permiso requerido|
|Cuerpo de texto plano|	cualquiera	|El texto tal cual|


`src/app/core/services/notification.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/** Azúcar sintáctica sobre MessageService para no repetir `severity/life`. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = inject(MessageService);

  success(summary: string, detail?: string): void {
    this.messages.add({ severity: 'success', summary, detail, life: 3000 });
  }

  info(summary: string, detail?: string): void {
    this.messages.add({ severity: 'info', summary, detail, life: 3500 });
  }

  warn(summary: string, detail?: string): void {
    this.messages.add({ severity: 'warn', summary, detail, life: 4500 });
  }

  error(summary: string, detail?: string): void {
    this.messages.add({ severity: 'error', summary, detail, life: 6000 });
  }
}
```

`NotificationService` no reemplaza a `MessageService:` lo envuelve. La diferencia es que la duración deja de ser una decisión repetida en cada componente —un error debe leerse más tiempo que un «guardado»— y queda en un solo archivo.

### 2.5 Componentes compartidos: PageHeader, EmptyState, StatusTag

**Criterios de este sub-ítem**

- [X] Los tres son standalone y usan input() con valor por defecto o input.required
- [X] PageHeader y EmptyState proyectan contenido con <ng-content />
- [X] StatusTag deriva texto y color con computed
- [X] Los tres .css quedan vacíos

```bash
ng generate component shared/ui/page-header --skip-tests --defaults
ng generate component shared/ui/empty-state --skip-tests --defaults
ng generate component shared/ui/status-tag --skip-tests --defaults
```

`src/app/shared/ui/page-header/page-header.ts`

```typescript
import { Component, input } from '@angular/core';

@Component({
  host: { class: 'block' },
  selector: 'app-page-header',
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
```

```html
<header class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-slate-900">{{ title() }}</h1>
    @if (subtitle()) {
      <p class="mt-1 max-w-2xl text-sm text-slate-500">{{ subtitle() }}</p>
    }
  </div>
  <div class="flex flex-wrap items-center gap-2">
    <ng-content />
  </div>
</header>
```

**Uso desde una pantalla de negocio:**

```html
<app-page-header title="Envíos" subtitle="Creación, seguimiento y gestión logística.">
  <button pButton label="Nuevo"></button>
</app-page-header>
```

> `input.required` es la decisión importante: una pantalla sin título no se puede identificar, así que el compilador debe impedirla. subtitle sí es opcional, y el @if evita dejar un `<p>` vacío con margen.

`src/app/shared/ui/empty-state/empty-state.ts`

```typescript
@Component({
  host: { class: 'block' },
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  readonly icon = input<string>('pi pi-inbox');
  readonly title = input<string>('Sin registros');
  readonly message = input<string>('Todavía no hay datos para mostrar.');
}
```

```html
<div class="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
    <i [class]="icon()" class="text-xl"></i>
  </div>
  <p class="mt-2 text-sm font-semibold text-slate-700">{{ title() }}</p>
  <p class="max-w-sm text-sm text-slate-500">{{ message() }}</p>
  <div class="mt-3"><ng-content /></div>
</div>
```

src/app/shared/ui/status-tag/status-tag.ts

```typescript
import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  host: { class: 'inline-block' },
  selector: 'app-status-tag',
  imports: [TagModule],
  templateUrl: './status-tag.html',
  styleUrl: './status-tag.css',
})
export class StatusTag {
  readonly isActive = input.required<boolean>();

  readonly label = computed(() => (this.isActive() ? 'Activo' : 'Inactivo'));
  readonly severity = computed<'success' | 'danger'>(() =>
    this.isActive() ? 'success' : 'danger',
  );
}
```

```html
<p-tag [value]="label()" [severity]="severity()" [rounded]="true" />
```

Por qué `computed` y no un método. Un método se reevaluaría en cada ciclo de detección; un `computed` guarda el resultado y solo se recalcula cuando `isActive()` cambia. Este tag representa `is_active`; no debe reutilizarse para `estado` de envíos ni para el `status` de RBAC.

`src/app/shared/ui/status-tag/status-tag.spec.ts`

```typescript
it('should react when is_active changes to false', async () => {
  const fixture = TestBed.createComponent(StatusTag);
  fixture.componentRef.setInput('isActive', true);
  await fixture.whenStable();

  fixture.componentRef.setInput('isActive', false);
  await fixture.whenStable();

  expect(fixture.componentInstance.label()).toBe('Inactivo');
  expect(fixture.componentInstance.severity()).toBe('danger');
});
```

### 2.6 Shell: conservar el esqueleto al navegar

**Criterios de este sub-ítem**

- [X] Shell monta Header, Aside, router-outlet y Footer
- [X] Solo el contenido central cambia al navegar
- [X] El Drawer móvil reutiliza el mismo Aside y la misma lista items
- [X] El botón de menú está siempre visible y alterna el Aside en escritorio (misma lógica que ISS-01B)
- [X] <p-toast /> y <p-confirmdialog /> viven en el Shell, una sola vez
- [X] En Fase I no inyecta AuthService ni SessionStore

```
 ng generate component layout/shell --skip-tests --defaults
```

`src/app/layout/shell/shell.ts`

```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { watchMediaQuery } from '../../core/utils/media-query';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

/**
 * Layout persistente de la aplicación.
 *
 * El Header, el Aside y el Footer se montan **una sola vez**; solo la región
 * central cambia con `<router-outlet />`. Reutilizar el layout evita
 * remontar el menú (y perder el scroll o el foco) al navegar.
 *
 * Fase I: sin `AuthService` ni `SessionStore`. Las rutas de negocio se agregan
 * como hijas de `Shell` desde ISS-03; la sesión, en ISS-08.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Aside, Footer, ConfirmDialogModule, DrawerModule, ToastModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  /** `lg` de Tailwind: desde aquí el Aside es fijo y el botón lo alterna. */
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  /** Escritorio: Aside fijo visible u oculto. */
  readonly sidebarCollapsed = signal(false);

  /** Móvil: Drawer abierto. */
  readonly mobileOpen = signal(false);

  /** En ISS-02 solo se enlaza la pantalla logística disponible; ISS-03 agrega las demás rutas de negocio. */
  readonly items: MenuItem[] = [
    { label: 'Envíos', icon: 'pi pi-send', routerLink: '/envios' },
    { label: 'Prototipo', icon: 'pi pi-desktop', routerLink: '/construir' },
  ];

  /**
   * Un solo botón, dos disposiciones: en escritorio alterna el Aside fijo; por
   * debajo de `lg` abre el Drawer.
   */
  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }
}
```

`src/app/layout/shell/shell.html`

```html
<div class="flex min-h-screen flex-col bg-slate-100">
  <app-header (menuRequested)="onMenuToggle()" />

  <div class="flex flex-1">
    <!--
      Escritorio: Aside fijo que el botón del Header puede ocultar.
      Por debajo de lg no se pinta: el menú vive en el Drawer.
    -->
    @if (!sidebarCollapsed()) {
      <aside class="hidden w-72 shrink-0 lg:block">
        <app-aside [items]="items" (navigated)="mobileOpen.set(false)" />
      </aside>
    }

    <main id="contenido" class="min-w-0 flex-1 p-4 sm:p-6">
      <div class="mx-auto w-full max-w-7xl">
        <router-outlet />
      </div>
    </main>
  </div>

  <app-footer />
</div>

<!-- Móvil: el mismo Aside, otra disposición. -->
<p-drawer [(visible)]="mobileOpen" header="Menú" position="left" styleClass="w-72">
  <app-aside [items]="items" (navigated)="mobileOpen.set(false)" />
</p-drawer>

<!-- Anfitriones de las notificaciones y confirmaciones del CRUD (ISS-03). -->
<p-toast position="top-right" />
<p-confirmdialog />
```

**Rutas**

`src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      // La primera pantalla de negocio es la redirección por defecto.
      // ISS-07 añadirá aquí un resumen logístico derivado de datos permitidos.
      { path: '', pathMatch: 'full', redirectTo: 'envios' },
      {
        path: 'envios',
        title: 'Envíos · EnlaceExpress',
        loadComponent: () =>
          import('./features/shipments/shipment-list/shipment-list').then((m) => m.ShipmentList),
      },
    ],
  },
  { path: '**', redirectTo: 'construir' },
];
```

`src/app/layout/shell/shell.spec.ts`

```typescript
it('should compose header, aside, main, footer and the router outlet', async () => {
  const { compilado } = await crearShell();

  expect(compilado.querySelector('app-header')).toBeTruthy();
  expect(compilado.querySelector('aside app-aside')).toBeTruthy();
  expect(compilado.querySelector('main#contenido router-outlet')).toBeTruthy();
  expect(compilado.querySelector('app-footer')).toBeTruthy();
});

it('should open the mobile drawer from the header button', async () => {
  const { fixture, compilado } = await crearShell();

  const boton = compilado.querySelector(
    'app-header button[aria-label="Mostrar u ocultar el menú"]',
  ) as HTMLButtonElement;
  boton.click();
  fixture.detectChanges();
  await fixture.whenStable();

  expect(fixture.componentInstance.mobileOpen()).toBe(true);
});
```

La prueba necesita `provideRouter([])` (`por <router-outlet />`) y los proveedores de PrimeNG (`MessageService`, `ConfirmationService`) que consumen `<p-toast />` y `<p-confirmdialog />`. Como `jsdom` no implementa `matchMedia`, `watchMediaQuery` devuelve false y la prueba ejercita la rama móvil; la rama de escritorio se cubre en `construir.spec.ts` sustituyendo `window.matchMedia`.

### 2.7 Registrar HttpClient sin interceptores de sesión
 
**Criterios de este sub-ítem**

- [X] provideHttpClient() está en app.config.ts
- [X] No hay withInterceptors(...) todavía
- [X] MessageService y ConfirmationService siguen registrados (los usan los hosts del Shell)

`src/app/app.config.ts` — debajo de los imports y antes de MessageService:

```typescript
import { provideHttpClient } from '@angular/common/http';

// ...

    // Habilita la inyección de HttpClient en los servicios `*Api`.
    // Sin interceptores de sesión: el authInterceptor llega en ISS-08.
    provideHttpClient(),

    MessageService,
    ConfirmationService,
```

`provideHttpClient()` habilita la inyección de HttpClient; no configura autenticación. El authInterceptor (adjuntar el Bearer, refrescar el token en 401) es ISS-08. Añadirlo ahora significaría escribir un interceptor que lee un SessionStore que aún no existe.

### 2.8 Comprobar antes de avanzar

**Criterios de este sub-ítem**

- [X] ng build termina con código 0 y sin ✘ [ERROR]
- [X] shell aparece como chunk diferido
- [X] npm test pasa completo
- [X] / redirige a /envios; /construir sigue disponible como prototipo local
- [X] Network no registra llamadas /api en ninguna pantalla

```bash
ng build
npm test -- --watch=false
npm start
```

## Verificación del ISS

```bash
# 1. Compila y separa los chunks diferidos
ng build

# 2. La URL del backend existe una sola vez
grep -n "apiUrl" src/environments/environment.ts src/environments/environment.development.ts

# 3. Los modelos existen y coinciden con el backend
ls src/app/core/models/*.model.ts

# 4. Los servicios desenvuelven con map
grep -rn "\.pipe(map" src/app/features src/app/core | wc -l

# 5. HttpClient registrado, sin interceptores
grep -n "provideHttpClient" src/app/app.config.ts
grep -rn "withInterceptors" src/app/app.config.ts || echo "sin interceptores: correcto"

# 6. Las envolturas especiales están bien escritas
grep -n "assignments\|grants" src/app/features/admin/*/*-api.ts

# 7. Los CSS compartidos no tienen reglas
for f in src/app/shared/ui/*/*.css src/app/layout/shell/shell.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 8. Pruebas
npm test -- --watch=false
```

![alt text](<img-angular/verificar iss-02.png>)

## ISS-03 · CRUD de Companies con Signals

**Fase: I · Bloqueado por: ISS-02 · Habilita: ISS-07 (dashboard) y Fase II (ISS-08 sesión, ISS-09 protección)**

**Dos decisiones propias de EnlaceExpress**, ausentes en la guía de ejemplo y necesarias aquí:

1. **Fechas con inputs nativos** (`type="date"`, `"time"`, `"datetime-local"`) en lugar de `p-datepicker`: entregan un `string` que el backend ya espera y evitan los desfases de zona horaria de `Date`. Las conversiones viven en `core/utils/form-values.ts` (3.2).

2. **Selects dependientes de la empresa.** El backend relaciona contactos y direcciones con una empresa, así que el formulario de Empresa ofrece solo *sus* contactos/direcciones y el de Envío filtra el origen por la empresa elegida.

### 3.1 Verificar el contrato del backend

`api-backend.md` fija rutas y campos, pero no el nombre de la clave con la que Express envuelve cada respuesta (`{ companies }`, `{ shipment }`…). La bitácora (ISS-02) confirma `companies` para empresas, `addresses` en la lista de direcciones y `shipment` en el detalle de envíos; el resto sigue la misma convención y **hay que confirmarlo**. Con el backend corriendo:

```bash
for r in companies contacts address messengers rates routes shipments packages tracking_events delivery_proofs invoices; do
  echo -n "/api/$r → "
  curl -s "http://localhost:4000/api/$r" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log(Object.keys(JSON.parse(s)).join(', '))}catch{console.log('respuesta no JSON')}})"
done
```

Compara cada línea con esta tabla. Si alguna clave difiere, **solo cambia el nombre en el servicio de esa entidad** (`list()`, `get()`, `create()`…): ningún componente conoce la envoltura, esa es la razón de desenvolver en el `.pipe(map(...))`.

| Recurso | Clave de la lista (`list()`) | Clave de un registro (`get/create/update`) |
|---|---|---|
| `/companies` | `companies` ✔ (bitácora) | `companies` ✔ (bitácora) |
| `/contacts` | `contacts` | `contact` |
| `/address` | `addresses` ✔ (bitácora) | `address` |
| `/messengers` | `messengers` | `messenger` |
| `/rates` | `rates` | `rate` |
| `/routes` | `routes` | `route` |
| `/shipments` | `shipments` | `shipment` ✔ (bitácora) |
| `/packages` | `packages` | `package` |
| `/tracking_events` | `tracking_events` | `tracking_event` |
| `/delivery_proofs` | `delivery_proofs` | `delivery_proof` |
| `/invoices` | `invoices` | `invoice` |

### 3.2 Utilidades compartidas (se crean una sola vez)

Tres archivos en `src/app/core/utils/`, junto a `api-error.ts` y `media-query.ts`. Son funciones puras: se prueban sin montar nada.

`src/app/core/utils/filter-rows.ts` — idéntico al de la guía de ejemplo (PrimeNG 22 eliminó `globalFilter`):

```typescript
/**
 * Filtro local reutilizable para tablas PrimeNG 22.
 *
 * PrimeNG 22 eliminó el input `globalFilter` de `p-table`, así que filtramos el
 * arreglo **antes** de entregarlo a `[value]`. Es una función pura: no depende
 * del DOM, de la tabla ni de Angular, y por eso se prueba sin montar nada.
 */
export function filterRows<T>(
  rows: readonly T[],
  query: string,
  pick: (row: T) => Array<string | number | null | undefined>,
): T[] {
  const term = query.trim().toLowerCase();

  // Sin término se devuelve una copia: el llamador puede mutar el resultado sin
  // tocar el arreglo original que vive en el signal.
  if (!term) {
    return [...rows];
  }

  return rows.filter((row) =>
    pick(row).some((value) => (value ?? '').toString().toLowerCase().includes(term)),
  );
}
```

`src/app/core/utils/form-values.ts` — puente entre el modelo (DECIMAL como `number | string`, fechas como `string`) y los controles del formulario:

```typescript
import { Money } from '../models/api.model';

/** DECIMAL llega como `number` o `string`; `p-inputnumber` necesita `number | null`. */
export function toNumberOrNull(value: Money | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** `2026-10-31` o `2026-10-31T00:00:00Z` → `2026-10-31` (valor de `<input type="date">`). */
export function toDateInput(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : '';
}

/** `08:30:00` → `08:30` (valor de `<input type="time">`). */
export function toTimeInput(value: string | null | undefined): string {
  return value ? value.slice(0, 5) : '';
}

/** ISO → `2026-10-31T15:30` en hora local (valor de `<input type="datetime-local">`). */
export function toDateTimeInput(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (n: number): string => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/** Hora local del input → ISO UTC para el backend. Vacío → `null`. */
export function fromDateTimeInput(value: string): string | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
```

`src/app/core/utils/labels.ts` — los enums del backend llegan como `en_ruta`, `con_novedad`…; la UI los muestra legibles:

```typescript
/** `con_novedad` → `Con novedad`. */
export function humanize(value: string | null | undefined): string {
  const text = (value ?? '').replaceAll('_', ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
```

Pruebas de las dos primeras:

`src/app/core/utils/filter-rows.spec.ts`

```typescript
import { filterRows } from './filter-rows';

interface Row {
  name: string;
  note: string | null;
}
const ROWS: Row[] = [
  { name: 'Alfa', note: 'Primera' },
  { name: 'Beta', note: null },
];
const pick = (row: Row) => [row.name, row.note];

describe('filterRows', () => {
  it('should return a copy when there is no term', () => {
    const result = filterRows(ROWS, '   ', pick);
    expect(result).toEqual(ROWS);
    expect(result).not.toBe(ROWS);
  });

  it('should match ignoring case', () => {
    expect(filterRows(ROWS, 'ALFA', pick)).toEqual([ROWS[0]]);
  });

  it('should tolerate null values', () => {
    expect(filterRows(ROWS, 'prim', pick)).toEqual([ROWS[0]]);
  });

  it('should return an empty array when nothing matches', () => {
    expect(filterRows(ROWS, 'zzz', pick)).toEqual([]);
  });

  it('should trim the term', () => {
    expect(filterRows(ROWS, '  beta ', pick)).toEqual([ROWS[1]]);
  });
});
```

`src/app/core/utils/form-values.spec.ts`

```typescript
import {
  fromDateTimeInput,
  toDateInput,
  toDateTimeInput,
  toNumberOrNull,
  toTimeInput,
} from './form-values';

describe('form-values', () => {
  it('should normalize DECIMAL strings and nulls', () => {
    expect(toNumberOrNull('12.50')).toBe(12.5);
    expect(toNumberOrNull(7)).toBe(7);
    expect(toNumberOrNull(null)).toBeNull();
    expect(toNumberOrNull('')).toBeNull();
  });

  it('should cut dates and times for native inputs', () => {
    expect(toDateInput('2026-10-31T00:00:00.000Z')).toBe('2026-10-31');
    expect(toDateInput(null)).toBe('');
    expect(toTimeInput('08:30:00')).toBe('08:30');
  });

  it('should round-trip a date-time through the local input', () => {
    const iso = '2026-10-31T15:30:00.000Z';
    expect(fromDateTimeInput(toDateTimeInput(iso))).toBe(iso);
    expect(fromDateTimeInput('')).toBeNull();
  });
});
```

### 3.3 El patrón, una vez

Cada entidad se compone de **cinco archivos** (más el `.css` vacío de cada componente), con la misma responsabilidad que en la guía de ejemplo:

```
features/<recurso>/
├── <recurso>-api.ts          # contrato HTTP: desenvuelve la respuesta
├── <recurso>-form/
│   ├── <recurso>-form.ts     # Reactive Forms; NO llama a la API; emite `saved`
│   ├── <recurso>-form.html
│   └── <recurso>-form.css    # sin reglas
└── <recurso>-list/
    ├── <recurso>-list.ts     # estado en signals + llamadas a la API
    ├── <recurso>-list.html   # p-table + p-dialog con el formulario
    └── <recurso>-list.css    # sin reglas
```

### 3.4 Empresas — `/api/companies`

**Es la entidad de referencia.** Léela completa: el resto repite la misma estructura. Todo lo que se explica aquí vale para las diez siguientes.

**Particularidades**

- `contacto_principal_id` y `direccion_facturacion_id` apuntan a `Contact` y `Address`, que a su vez necesitan una empresa. Por eso esos dos selects **solo se habilitan al editar** (la empresa ya existe) y solo ofrecen contactos/direcciones de *esa* empresa (`contactOptions`, `addressOptions`). Al crear se deshabilitan y no viajan en el payload.
- El orden natural de trabajo es: crear la empresa → crear su contacto y su dirección → volver a editar la empresa para fijar el principal y la facturación.
- `is_active` se elige solo al crear. En edición el control queda deshabilitado: el cambio de estado se hace con la baja lógica.

**Archivos de esta pantalla**

```bash
ng generate component features/companies/company-list --skip-tests --defaults
ng generate component features/companies/company-form --skip-tests --defaults
```

El CLI crea además `company-list.spec.ts` y `company-form.spec.ts` si no usas `--skip-tests`; las pruebas se tratan en 3.17.

`src/app/features/companies/company-api.ts`

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, CompanyPayload } from '../../core/models/company.model';

/** /companies — la lista llega en `{ companies }` y el detalle en `{ companies }`. */
@Injectable({ providedIn: 'root' })
export class CompanyApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/companies`;

  list(): Observable<Company[]> {
    return this.http
      .get<{ companies: Company[] }>(this.base)
      .pipe(map((response) => response.companies));
  }

  get(id: number): Observable<Company> {
    return this.http
      .get<{ companies: Company }>(`${this.base}/${id}`)
      .pipe(map((response) => response.companies));
  }

  create(payload: CompanyPayload): Observable<Company> {
    return this.http
      .post<{ companies: Company }>(this.base, payload)
      .pipe(map((response) => response.companies));
  }

  update(id: number, payload: Partial<CompanyPayload>): Observable<Company> {
    return this.http
      .patch<{ companies: Company }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.companies));
  }

  replace(id: number, payload: CompanyPayload): Observable<Company> {
    return this.http
      .put<{ companies: Company }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.companies));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
```

`src/app/features/companies/company-form/company-form.ts`

```typescript
import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Company, CompanyPayload } from '../../../core/models/company.model';
import { Contact } from '../../../core/models/contact.model';
import { Address } from '../../../core/models/address.model';

/**
 * Formulario de empresa, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `company` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-company-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './company-form.html',
  styleUrl: './company-form.css',
})
export class CompanyForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly company = input<Company | null>(null);

  readonly contacts = input<Contact[]>([]);
  readonly addresses = input<Address[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<CompanyPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    nit: ['', [Validators.required, Validators.maxLength(30)]],
    razon_social: ['', [Validators.required, Validators.maxLength(150)]],
    contacto_principal_id: [null as number | null],
    direccion_facturacion_id: [null as number | null],
    is_active: [true],
  });

  /** Contactos de ESTA empresa: el backend exige que el principal le pertenezca. */
  readonly contactOptions = computed(() => {
    const current = this.company();
    return current ? this.contacts().filter((contact) => contact.empresa_id === current.id) : [];
  });

  /** Direcciones de ESTA empresa, para la dirección de facturación. */
  readonly addressOptions = computed(() => {
    const current = this.company();
    return current ? this.addresses().filter((address) => address.empresa_id === current.id) : [];
  });

  constructor() {
    effect(() => {
      const current = this.company();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        nit: current?.nit ?? '',
        razon_social: current?.razon_social ?? '',
        contacto_principal_id: current?.contacto_principal_id ?? null,
        direccion_facturacion_id: current?.direccion_facturacion_id ?? null,
        is_active: current?.is_active ?? true,
      });

      // `is_active` solo cambia con PATCH /deactivate: al editar no se ofrece.
      if (current) {
        this.form.controls.is_active.disable();
        this.form.controls.contacto_principal_id.enable();
        this.form.controls.direccion_facturacion_id.enable();
      } else {
        this.form.controls.is_active.enable();
        this.form.controls.contacto_principal_id.disable();
        this.form.controls.direccion_facturacion_id.disable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: CompanyPayload = {
      nit: value.nit.trim(),
      razon_social: value.razon_social.trim(),
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    const current = this.company();
    this.saved.emit(
      current
        ? { ...payload, contacto_principal_id: value.contacto_principal_id, direccion_facturacion_id: value.direccion_facturacion_id }
        : { ...payload, is_active: value.is_active },
    );
  }
}
```

`src/app/features/companies/company-form/company-form.html`

```html
<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <label for="company-nit" class="mb-1 block text-sm font-medium text-slate-700">
        NIT <span class="text-red-500">*</span>
      </label>
      <input
        id="company-nit"
        pInputText
        formControlName="nit"
        placeholder="900123456-7"
        class="w-full"
      />
      @if (form.controls.nit.touched && form.controls.nit.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 30 caracteres).
        </p-message>
      }
    </div>

    <div>
      <label for="company-razon-social" class="mb-1 block text-sm font-medium text-slate-700">
        Razón social <span class="text-red-500">*</span>
      </label>
      <input
        id="company-razon-social"
        pInputText
        formControlName="razon_social"
        placeholder="Distribuidora La Costa S.A.S."
        class="w-full"
      />
      @if (form.controls.razon_social.touched && form.controls.razon_social.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 150 caracteres).
        </p-message>
      }
    </div>

    <div>
      <label for="company-contacto-principal-id" class="mb-1 block text-sm font-medium text-slate-700">
        Contacto principal
      </label>
      <p-select
        [fluid]="true"
        inputId="company-contacto-principal-id"
        formControlName="contacto_principal_id"
        [options]="contactOptions()"
        optionLabel="nombre"
        optionValue="id"
        placeholder="Sin asignar"
        [filter]="true"
        [showClear]="true"
      />
      <p class="mt-1 text-xs text-slate-500">Solo al editar: el contacto debe pertenecer a esta empresa.</p>
    </div>

    <div>
      <label for="company-direccion-facturacion-id" class="mb-1 block text-sm font-medium text-slate-700">
        Dirección de facturación
      </label>
      <p-select
        [fluid]="true"
        inputId="company-direccion-facturacion-id"
        formControlName="direccion_facturacion_id"
        [options]="addressOptions()"
        optionLabel="alias"
        optionValue="id"
        placeholder="Sin asignar"
        [filter]="true"
        [showClear]="true"
      />
      <p class="mt-1 text-xs text-slate-500">Solo al editar: la dirección debe pertenecer a esta empresa.</p>
    </div>

    <div class="sm:col-span-2">
      <label for="company-is-active" class="mb-1 block text-sm font-medium text-slate-700">
        Estado
      </label>
      <p-select
        [fluid]="true"
        inputId="company-is-active"
        formControlName="is_active"
        [options]="activeOptions"
        optionLabel="label"
        optionValue="value"
      />
      @if (company()) {
        <p class="mt-1 text-xs text-slate-500">
          El estado de un registro existente solo cambia con la baja lógica.
        </p>
      }
    </div>
  </div>

  <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
    <button pButton type="button" severity="secondary" outlined (click)="cancelled.emit()">
      <span pButtonLabel>Cancelar</span>
    </button>
    <button pButton type="submit" [loading]="saving()">
      <i pButtonIcon class="pi pi-check"></i>
      <span pButtonLabel>Guardar</span>
    </button>
  </div>
</form>
```

`src/app/features/companies/company-list/company-list.ts`

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Company, CompanyPayload } from '../../../core/models/company.model';
import { Contact } from '../../../core/models/contact.model';
import { Address } from '../../../core/models/address.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ContactApi } from '../../contacts/contact-api';
import { AddressApi } from '../../addresses/address-api';
import { CompanyApi } from '../company-api';
import { CompanyForm } from '../company-form/company-form';

/**
 * Lista de empresas con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-company-list',
  imports: [ButtonModule, CompanyForm, DialogModule, EmptyState, InputTextModule, MessageModule, PageHeader, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css',
})
export class CompanyList {
  private readonly api = inject(CompanyApi);
  private readonly contactApi = inject(ContactApi);
  private readonly addressApi = inject(AddressApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/companies`). */
  readonly rows = signal<Company[]>([]);
  readonly contacts = signal<Contact[]>([]);
  readonly addresses = signal<Address[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.nit,
      row.razon_social,
      this.contactName()(row.contacto_principal_id),
      this.addressName()(row.direccion_facturacion_id),
    ]),
  );

  /** `id → nombre` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly contactName = computed(() => {
    const names = new Map<number, string>(this.contacts().map((item) => [item.id, String(item.nombre)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  /** `id → alias` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly addressName = computed(() => {
    const names = new Map<number, string>(this.addresses().map((item) => [item.id, String(item.alias)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<Company | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar empresa' : 'Nueva empresa'));

  constructor() {
    this.load();
  }

  /** `GET /api/companies`: recarga la tabla y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      rows: this.api.list(),
      contacts: this.contactApi.list(),
      addresses: this.addressApi.list(),
    }).subscribe({
      next: ({ rows, contacts, addresses }) => {
        this.rows.set(rows);
        this.contacts.set(contacts);
        this.addresses.set(addresses);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: Company): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   */
  save(payload: CompanyPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Empresa actualizada' : 'Empresa creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(row: Company): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${row.razon_social}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Empresa desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(row: Company): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${row.razon_social} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Empresa eliminada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
```

`src/app/features/companies/company-list/company-list.html`

```html
<app-page-header
  title="Empresas"
  subtitle="Clientes de la operación logística: NIT, razón social, contacto principal y dirección de facturación."
>
  <p-tag [value]="rows().length + ' registros'" severity="info" [rounded]="true" />
  <button pButton type="button" (click)="openCreate()">
    <i pButtonIcon class="pi pi-plus"></i>
    <span pButtonLabel>Nueva empresa</span>
  </button>
</app-page-header>

@if (error()) {
  <p-message severity="error" styleClass="mb-4 w-full">
    {{ error() }}
  </p-message>
}

<div class="rounded-xl border border-slate-200 bg-white">
  <p-table
    [value]="visibleRows()"
    [loading]="loading()"
    [paginator]="visibleRows().length > 10"
    [rows]="10"
    dataKey="id"
    tableStyleClass="min-w-3xl"
  >
    <ng-template #caption>
      <div class="flex items-center gap-2">
        <i class="pi pi-search text-slate-400"></i>
        <input
          pInputText
          type="search"
          aria-label="Buscar empresas"
          placeholder="Buscar por razón social, NIT o contacto…"
          [value]="filter()"
          (input)="filter.set($any($event.target).value)"
          class="w-full"
        />
      </div>
      @if (filter()) {
        <p class="mt-2 text-xs text-slate-500">
          {{ visibleRows().length }} de {{ rows().length }} coinciden con «{{ filter() }}».
        </p>
      }
    </ng-template>

    <ng-template #header>
      <tr>
        <th pSortableColumn="razon_social">
          <div class="flex items-center gap-1">Razón social <p-sort-icon field="razon_social" /></div>
        </th>
        <th>Contacto principal</th>
        <th>Dirección de facturación</th>
        <th>Estado</th>
        <th class="w-40 text-right">Acciones</th>
      </tr>
    </ng-template>

    <ng-template #body let-row>
      <tr>
        <td>
          <p class="font-medium text-slate-800">{{ row.razon_social }}</p>
          <p class="text-xs text-slate-400">#{{ row.id }} · NIT {{ row.nit }}</p>
        </td>
        <td>
          <span class="text-sm text-slate-600">{{ contactName()(row.contacto_principal_id) }}</span>
        </td>
        <td>
          <span class="text-sm text-slate-600">{{ addressName()(row.direccion_facturacion_id) }}</span>
        </td>
        <td>
          <app-status-tag [isActive]="row.is_active" />
        </td>
        <td>
          <div class="flex justify-end gap-1">
            <button
              pButton
              type="button"
              text
              rounded
              severity="secondary"
              icon="pi pi-pencil"
              aria-label="Editar empresa"
              pTooltip="Editar"
              (click)="openEdit(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="warn"
              icon="pi pi-ban"
              aria-label="Dar de baja"
              pTooltip="Baja lógica"
              (click)="deactivate(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="danger"
              icon="pi pi-trash"
              aria-label="Eliminar empresa"
              pTooltip="Eliminar"
              (click)="remove(row)"
            ></button>
          </div>
        </td>
      </tr>
    </ng-template>

    <ng-template #emptymessage>
      <tr>
        <td colspan="5">
          @if (filter()) {
            <app-empty-state
              icon="pi pi-search"
              title="Sin coincidencias"
              message="Ningún registro coincide con la búsqueda. Borra el filtro para ver todos."
            />
          } @else {
            <app-empty-state
              icon="pi pi-building"
              title="Sin registros"
              message="Crea el primero con el botón «Nueva empresa» o ejecuta el seeder del backend."
            />
          }
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<p-dialog
  [visible]="dialogVisible()"
  (visibleChange)="dialogVisible.set($event)"
  [header]="title()"
  [modal]="true"
  [draggable]="false"
  [resizable]="false"
  [dismissableMask]="true"
  styleClass="w-full max-w-2xl mx-4"
>
  <app-company-form
    [company]="editing()"
    [contacts]="contacts()"
    [addresses]="addresses()"
    [saving]="saving()"
    [resetKey]="resetKey()"
    (saved)="save($event)"
    (cancelled)="dialogVisible.set(false)"
  />
</p-dialog>
```

Los dos `.css` (`company-form.css`, `company-list.css`) quedan sin reglas, como los de `layout/` y `shared/ui/`.

![alt text](img-express/crud_companies.png)

## ISS-04 · CRUD de Contacts con relaciones

**Particularidades**

- `empresa_id` es obligatorio: el select lista todas las empresas (la lista carga `CompanyApi`).
- `is_principal` es un `p-checkbox` binario. El backend decide cómo reconciliar el principal con `Company.contacto_principal_id`; la UI solo envía el booleano.

**Archivos de esta pantalla**

```bash
ng generate component features/contacts/contact-list --skip-tests --defaults
ng generate component features/contacts/contact-form --skip-tests --defaults
```

El CLI crea además `contact-list.spec.ts` y `contact-form.spec.ts` si no usas `--skip-tests`; las pruebas se tratan en 3.17.

`src/app/features/contacts/contact-api.ts`

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contact, ContactPayload } from '../../core/models/contact.model';

/** /contacts — la lista llega en `{ contacts }` y el detalle en `{ contact }`. */
@Injectable({ providedIn: 'root' })
export class ContactApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/contacts`;

  list(): Observable<Contact[]> {
    return this.http
      .get<{ contacts: Contact[] }>(this.base)
      .pipe(map((response) => response.contacts));
  }

  get(id: number): Observable<Contact> {
    return this.http
      .get<{ contact: Contact }>(`${this.base}/${id}`)
      .pipe(map((response) => response.contact));
  }

  create(payload: ContactPayload): Observable<Contact> {
    return this.http
      .post<{ contact: Contact }>(this.base, payload)
      .pipe(map((response) => response.contact));
  }

  update(id: number, payload: Partial<ContactPayload>): Observable<Contact> {
    return this.http
      .patch<{ contact: Contact }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.contact));
  }

  replace(id: number, payload: ContactPayload): Observable<Contact> {
    return this.http
      .put<{ contact: Contact }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.contact));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
```

`src/app/features/contacts/contact-form/contact-form.ts`

```typescript
import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Contact, ContactPayload } from '../../../core/models/contact.model';
import { Company } from '../../../core/models/company.model';

/**
 * Formulario de contacto, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `contact` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-contact-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, CheckboxModule, SelectModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly contact = input<Contact | null>(null);

  readonly companies = input<Company[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<ContactPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    empresa_id: [null as number | null, [Validators.required]],
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    cargo: ['', [Validators.maxLength(100)]],
    telefono: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.maxLength(150)]],
    is_principal: [false],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.contact();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        empresa_id: current?.empresa_id ?? null,
        nombre: current?.nombre ?? '',
        cargo: current?.cargo ?? '',
        telefono: current?.telefono ?? '',
        email: current?.email ?? '',
        is_principal: current?.is_principal ?? false,
        is_active: current?.is_active ?? true,
      });

      // `is_active` solo cambia con PATCH /deactivate: al editar no se ofrece.
      if (current) {
        this.form.controls.is_active.disable();
      } else {
        this.form.controls.is_active.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ContactPayload = {
      empresa_id: Number(value.empresa_id),
      nombre: value.nombre.trim(),
      cargo: value.cargo.trim() || null,
      telefono: value.telefono.trim() || null,
      email: value.email.trim() || null,
      is_principal: value.is_principal,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.contact() ? payload : { ...payload, is_active: value.is_active });
  }
}
```

`src/app/features/contacts/contact-form/contact-form.html`

```html
<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="sm:col-span-2">
      <label for="contact-empresa-id" class="mb-1 block text-sm font-medium text-slate-700">
        Empresa <span class="text-red-500">*</span>
      </label>
      <p-select
        [fluid]="true"
        inputId="contact-empresa-id"
        formControlName="empresa_id"
        [options]="companies()"
        optionLabel="razon_social"
        optionValue="id"
        placeholder="Selecciona…"
        [filter]="true"
      />
      @if (form.controls.empresa_id.touched && form.controls.empresa_id.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio.
        </p-message>
      }
    </div>

    <div>
      <label for="contact-nombre" class="mb-1 block text-sm font-medium text-slate-700">
        Nombre <span class="text-red-500">*</span>
      </label>
      <input
        id="contact-nombre"
        pInputText
        formControlName="nombre"
        placeholder="María Fernanda Ríos"
        class="w-full"
      />
      @if (form.controls.nombre.touched && form.controls.nombre.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 120 caracteres).
        </p-message>
      }
    </div>

    <div>
      <label for="contact-cargo" class="mb-1 block text-sm font-medium text-slate-700">
        Cargo
      </label>
      <input
        id="contact-cargo"
        pInputText
        formControlName="cargo"
        placeholder="Coordinadora de logística"
        class="w-full"
      />
      @if (form.controls.cargo.touched && form.controls.cargo.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 100 caracteres.
        </p-message>
      }
    </div>

    <div>
      <label for="contact-telefono" class="mb-1 block text-sm font-medium text-slate-700">
        Teléfono
      </label>
      <input
        id="contact-telefono" type="tel"
        pInputText
        formControlName="telefono"
        placeholder="300 000 0000"
        class="w-full"
      />
      @if (form.controls.telefono.touched && form.controls.telefono.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 30 caracteres.
        </p-message>
      }
    </div>

    <div>
      <label for="contact-email" class="mb-1 block text-sm font-medium text-slate-700">
        Email
      </label>
      <input
        id="contact-email" type="email"
        pInputText
        formControlName="email"
        placeholder="contacto@empresa.com"
        class="w-full"
      />
      @if (form.controls.email.touched && form.controls.email.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Formato de email inválido.
        </p-message>
      }
    </div>

    <div class="flex items-center gap-2 sm:col-span-2">
      <p-checkbox inputId="contact-is-principal" formControlName="is_principal" [binary]="true" />
      <label for="contact-is-principal" class="text-sm text-slate-700">Es el contacto principal de la empresa</label>
    </div>

    <div class="sm:col-span-2">
      <label for="contact-is-active" class="mb-1 block text-sm font-medium text-slate-700">
        Estado
      </label>
      <p-select
        [fluid]="true"
        inputId="contact-is-active"
        formControlName="is_active"
        [options]="activeOptions"
        optionLabel="label"
        optionValue="value"
      />
      @if (contact()) {
        <p class="mt-1 text-xs text-slate-500">
          El estado de un registro existente solo cambia con la baja lógica.
        </p>
      }
    </div>
  </div>

  <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
    <button pButton type="button" severity="secondary" outlined (click)="cancelled.emit()">
      <span pButtonLabel>Cancelar</span>
    </button>
    <button pButton type="submit" [loading]="saving()">
      <i pButtonIcon class="pi pi-check"></i>
      <span pButtonLabel>Guardar</span>
    </button>
  </div>
</form>
```

`src/app/features/contacts/contact-list/contact-list.ts`

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Contact, ContactPayload } from '../../../core/models/contact.model';
import { Company } from '../../../core/models/company.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { CompanyApi } from '../../companies/company-api';
import { ContactApi } from '../contact-api';
import { ContactForm } from '../contact-form/contact-form';

/**
 * Lista de contactos con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-contact-list',
  imports: [ButtonModule, ContactForm, DialogModule, EmptyState, InputTextModule, MessageModule, PageHeader, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList {
  private readonly api = inject(ContactApi);
  private readonly companyApi = inject(CompanyApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/contacts`). */
  readonly rows = signal<Contact[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.nombre,
      row.cargo,
      row.email,
      row.telefono,
      this.companyName()(row.empresa_id),
    ]),
  );

  /** `id → razon_social` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly companyName = computed(() => {
    const names = new Map<number, string>(this.companies().map((item) => [item.id, String(item.razon_social)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<Contact | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar contacto' : 'Nuevo contacto'));

  constructor() {
    this.load();
  }

  /** `GET /api/contacts`: recarga la tabla y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      rows: this.api.list(),
      companies: this.companyApi.list(),
    }).subscribe({
      next: ({ rows, companies }) => {
        this.rows.set(rows);
        this.companies.set(companies);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: Contact): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   */
  save(payload: ContactPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Contacto actualizado' : 'Contacto creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(row: Contact): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${row.nombre}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Contacto desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(row: Contact): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${row.nombre} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Contacto eliminado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
```

`src/app/features/contacts/contact-list/contact-list.html`

```html
<app-page-header
  title="Contactos"
  subtitle="Personas asociadas a una empresa. Una empresa puede tener un contacto principal."
>
  <p-tag [value]="rows().length + ' registros'" severity="info" [rounded]="true" />
  <button pButton type="button" (click)="openCreate()">
    <i pButtonIcon class="pi pi-plus"></i>
    <span pButtonLabel>Nuevo contacto</span>
  </button>
</app-page-header>

@if (error()) {
  <p-message severity="error" styleClass="mb-4 w-full">
    {{ error() }}
  </p-message>
}

<div class="rounded-xl border border-slate-200 bg-white">
  <p-table
    [value]="visibleRows()"
    [loading]="loading()"
    [paginator]="visibleRows().length > 10"
    [rows]="10"
    dataKey="id"
    tableStyleClass="min-w-3xl"
  >
    <ng-template #caption>
      <div class="flex items-center gap-2">
        <i class="pi pi-search text-slate-400"></i>
        <input
          pInputText
          type="search"
          aria-label="Buscar contactos"
          placeholder="Buscar por nombre, cargo, email, teléfono o empresa…"
          [value]="filter()"
          (input)="filter.set($any($event.target).value)"
          class="w-full"
        />
      </div>
      @if (filter()) {
        <p class="mt-2 text-xs text-slate-500">
          {{ visibleRows().length }} de {{ rows().length }} coinciden con «{{ filter() }}».
        </p>
      }
    </ng-template>

    <ng-template #header>
      <tr>
        <th pSortableColumn="nombre">
          <div class="flex items-center gap-1">Nombre <p-sort-icon field="nombre" /></div>
        </th>
        <th>Empresa</th>
        <th>Contacto</th>
        <th>Principal</th>
        <th>Estado</th>
        <th class="w-40 text-right">Acciones</th>
      </tr>
    </ng-template>

    <ng-template #body let-row>
      <tr>
        <td>
          <p class="font-medium text-slate-800">{{ row.nombre }}</p>
          <p class="text-xs text-slate-400">{{ row.cargo || 'Sin cargo' }}</p>
        </td>
        <td>
          <span class="text-sm text-slate-700">{{ companyName()(row.empresa_id) }}</span>
        </td>
        <td>
          <p class="text-sm text-slate-700">{{ row.email || '—' }}</p>
          <p class="text-xs text-slate-400">{{ row.telefono || 'Sin teléfono' }}</p>
        </td>
        <td>
          @if (row.is_principal) {
            <p-tag value="Principal" severity="info" [rounded]="true" />
          } @else {
            <span class="text-slate-400">—</span>
          }
        </td>
        <td>
          <app-status-tag [isActive]="row.is_active" />
        </td>
        <td>
          <div class="flex justify-end gap-1">
            <button
              pButton
              type="button"
              text
              rounded
              severity="secondary"
              icon="pi pi-pencil"
              aria-label="Editar contacto"
              pTooltip="Editar"
              (click)="openEdit(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="warn"
              icon="pi pi-ban"
              aria-label="Dar de baja"
              pTooltip="Baja lógica"
              (click)="deactivate(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="danger"
              icon="pi pi-trash"
              aria-label="Eliminar contacto"
              pTooltip="Eliminar"
              (click)="remove(row)"
            ></button>
          </div>
        </td>
      </tr>
    </ng-template>

    <ng-template #emptymessage>
      <tr>
        <td colspan="6">
          @if (filter()) {
            <app-empty-state
              icon="pi pi-search"
              title="Sin coincidencias"
              message="Ningún registro coincide con la búsqueda. Borra el filtro para ver todos."
            />
          } @else {
            <app-empty-state
              icon="pi pi-id-card"
              title="Sin registros"
              message="Crea el primero con el botón «Nuevo contacto» o ejecuta el seeder del backend."
            />
          }
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<p-dialog
  [visible]="dialogVisible()"
  (visibleChange)="dialogVisible.set($event)"
  [header]="title()"
  [modal]="true"
  [draggable]="false"
  [resizable]="false"
  [dismissableMask]="true"
  styleClass="w-full max-w-2xl mx-4"
>
  <app-contact-form
    [contact]="editing()"
    [companies]="companies()"
    [saving]="saving()"
    [resetKey]="resetKey()"
    (saved)="save($event)"
    (cancelled)="dialogVisible.set(false)"
  />
</p-dialog>
```

Los dos `.css` (`contact-form.css`, `contact-list.css`) quedan sin reglas, como los de `layout/` y `shared/ui/`.

![alt text](img-express/crud_contactos.png)

## ISS-05 · CRUD de Address

**Particularidades**

- El recurso está en **singular** (`/api/address`) y la lista llega en `addresses` (confirmado en la bitácora).
- `tipo` (`recogida`, `entrega`, `mixta`) es un select con los tres valores del backend.
- `latitud` y `longitud` usan `p-inputnumber` con 7 decimales y sin separador de miles; son opcionales y viajan como `number | null`.

**Archivos de esta pantalla**

```bash
ng generate component features/addresses/address-list --skip-tests --defaults
ng generate component features/addresses/address-form --skip-tests --defaults
```

El CLI crea además `address-list.spec.ts` y `address-form.spec.ts` si no usas `--skip-tests`; las pruebas se tratan en 3.17.

`src/app/features/addresses/address-api.ts`

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address, AddressPayload } from '../../core/models/address.model';

/** /address — la lista llega en `{ addresses }` y el detalle en `{ address }`. */
@Injectable({ providedIn: 'root' })
export class AddressApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/address`;

  list(): Observable<Address[]> {
    return this.http
      .get<{ addresses: Address[] }>(this.base)
      .pipe(map((response) => response.addresses));
  }

  get(id: number): Observable<Address> {
    return this.http
      .get<{ address: Address }>(`${this.base}/${id}`)
      .pipe(map((response) => response.address));
  }

  create(payload: AddressPayload): Observable<Address> {
    return this.http
      .post<{ address: Address }>(this.base, payload)
      .pipe(map((response) => response.address));
  }

  update(id: number, payload: Partial<AddressPayload>): Observable<Address> {
    return this.http
      .patch<{ address: Address }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.address));
  }

  replace(id: number, payload: AddressPayload): Observable<Address> {
    return this.http
      .put<{ address: Address }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.address));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
```

`src/app/features/addresses/address-form/address-form.ts`

```typescript
import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Address, AddressPayload, AddressType } from '../../../core/models/address.model';
import { Company } from '../../../core/models/company.model';
import { toNumberOrNull } from '../../../core/utils/form-values';

/**
 * Formulario de dirección, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `address` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-address-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule],
  templateUrl: './address-form.html',
  styleUrl: './address-form.css',
})
export class AddressForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly address = input<Address | null>(null);

  readonly companies = input<Company[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<AddressPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly tipoOptions: { label: string; value: AddressType }[] = [
    { label: 'Recogida', value: 'recogida' },
    { label: 'Entrega', value: 'entrega' },
    { label: 'Mixta', value: 'mixta' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    empresa_id: [null as number | null, [Validators.required]],
    tipo: ['recogida' as AddressType, [Validators.required]],
    alias: ['', [Validators.required, Validators.maxLength(80)]],
    linea1: ['', [Validators.required, Validators.maxLength(200)]],
    linea2: ['', [Validators.maxLength(200)]],
    ciudad: ['', [Validators.required, Validators.maxLength(100)]],
    departamento: ['', [Validators.maxLength(100)]],
    pais: ['', [Validators.maxLength(100)]],
    codigo_postal: ['', [Validators.maxLength(20)]],
    latitud: [null as number | null, [Validators.min(-90), Validators.max(90)]],
    longitud: [null as number | null, [Validators.min(-180), Validators.max(180)]],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.address();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        empresa_id: current?.empresa_id ?? null,
        tipo: current?.tipo ?? 'recogida',
        alias: current?.alias ?? '',
        linea1: current?.linea1 ?? '',
        linea2: current?.linea2 ?? '',
        ciudad: current?.ciudad ?? '',
        departamento: current?.departamento ?? '',
        pais: current?.pais ?? '',
        codigo_postal: current?.codigo_postal ?? '',
        latitud: toNumberOrNull(current?.latitud),
        longitud: toNumberOrNull(current?.longitud),
        is_active: current?.is_active ?? true,
      });

      // `is_active` solo cambia con PATCH /deactivate: al editar no se ofrece.
      if (current) {
        this.form.controls.is_active.disable();
      } else {
        this.form.controls.is_active.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: AddressPayload = {
      empresa_id: Number(value.empresa_id),
      tipo: value.tipo,
      alias: value.alias.trim(),
      linea1: value.linea1.trim(),
      linea2: value.linea2.trim() || null,
      ciudad: value.ciudad.trim(),
      departamento: value.departamento.trim() || null,
      pais: value.pais.trim() || null,
      codigo_postal: value.codigo_postal.trim() || null,
      latitud: value.latitud,
      longitud: value.longitud,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.address() ? payload : { ...payload, is_active: value.is_active });
  }
}
```

`src/app/features/addresses/address-form/address-form.html`

```html
<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <label for="address-empresa-id" class="mb-1 block text-sm font-medium text-slate-700">
        Empresa <span class="text-red-500">*</span>
      </label>
      <p-select
        [fluid]="true"
        inputId="address-empresa-id"
        formControlName="empresa_id"
        [options]="companies()"
        optionLabel="razon_social"
        optionValue="id"
        placeholder="Selecciona…"
        [filter]="true"
      />
      @if (form.controls.empresa_id.touched && form.controls.empresa_id.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio.
        </p-message>
      }
    </div>

    <div>
      <label for="address-tipo" class="mb-1 block text-sm font-medium text-slate-700">
        Tipo <span class="text-red-500">*</span>
      </label>
      <p-select
        [fluid]="true"
        inputId="address-tipo"
        formControlName="tipo"
        [options]="tipoOptions"
        optionLabel="label"
        optionValue="value"
      />
      @if (form.controls.tipo.touched && form.controls.tipo.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio.
        </p-message>
      }
    </div>

    <div class="sm:col-span-2">
      <label for="address-alias" class="mb-1 block text-sm font-medium text-slate-700">
        Alias <span class="text-red-500">*</span>
      </label>
      <input
        id="address-alias"
        pInputText
        formControlName="alias"
        placeholder="Bodega principal"
        class="w-full"
      />
      @if (form.controls.alias.touched && form.controls.alias.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 80 caracteres).
        </p-message>
      }
    </div>

    <div class="sm:col-span-2">
      <label for="address-linea1" class="mb-1 block text-sm font-medium text-slate-700">
        Línea 1 <span class="text-red-500">*</span>
      </label>
      <input
        id="address-linea1"
        pInputText
        formControlName="linea1"
        placeholder="Calle 72 # 45-10"
        class="w-full"
      />
      @if (form.controls.linea1.touched && form.controls.linea1.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 200 caracteres).
        </p-message>
      }
    </div>

    <div class="sm:col-span-2">
      <label for="address-linea2" class="mb-1 block text-sm font-medium text-slate-700">
        Línea 2
      </label>
      <input
        id="address-linea2"
        pInputText
        formControlName="linea2"
        placeholder="Bodega 3"
        class="w-full"
      />
      @if (form.controls.linea2.touched && form.controls.linea2.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 200 caracteres.
        </p-message>
      }
    </div>

    <div>
      <label for="address-ciudad" class="mb-1 block text-sm font-medium text-slate-700">
        Ciudad <span class="text-red-500">*</span>
      </label>
      <input
        id="address-ciudad"
        pInputText
        formControlName="ciudad"
        placeholder="Barranquilla"
        class="w-full"
      />
      @if (form.controls.ciudad.touched && form.controls.ciudad.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 100 caracteres).
        </p-message>
      }
    </div>

    <div>
      <label for="address-departamento" class="mb-1 block text-sm font-medium text-slate-700">
        Departamento
      </label>
      <input
        id="address-departamento"
        pInputText
        formControlName="departamento"
        placeholder="Atlántico"
        class="w-full"
      />
      @if (form.controls.departamento.touched && form.controls.departamento.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 100 caracteres.
        </p-message>
      }
    </div>

    <div>
      <label for="address-pais" class="mb-1 block text-sm font-medium text-slate-700">
        País
      </label>
      <input
        id="address-pais"
        pInputText
        formControlName="pais"
        placeholder="Colombia"
        class="w-full"
      />
      @if (form.controls.pais.touched && form.controls.pais.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 100 caracteres.
        </p-message>
      }
    </div>

    <div>
      <label for="address-codigo-postal" class="mb-1 block text-sm font-medium text-slate-700">
        Código postal
      </label>
      <input
        id="address-codigo-postal"
        pInputText
        formControlName="codigo_postal"
        placeholder="080001"
        class="w-full"
      />
      @if (form.controls.codigo_postal.touched && form.controls.codigo_postal.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 20 caracteres.
        </p-message>
      }
    </div>

    <div>
      <label for="address-latitud" class="mb-1 block text-sm font-medium text-slate-700">
        Latitud
      </label>
      <p-inputnumber
        [fluid]="true"
        inputId="address-latitud"
        formControlName="latitud"
        mode="decimal"
        [min]="-90"
        [max]="90"
        [useGrouping]="false"
        [minFractionDigits]="0"
        [maxFractionDigits]="7"
      />
      @if (form.controls.latitud.touched && form.controls.latitud.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Valor fuera de rango (mínimo -90, máximo 90).
        </p-message>
      }
    </div>

    <div>
      <label for="address-longitud" class="mb-1 block text-sm font-medium text-slate-700">
        Longitud
      </label>
      <p-inputnumber
        [fluid]="true"
        inputId="address-longitud"
        formControlName="longitud"
        mode="decimal"
        [min]="-180"
        [max]="180"
        [useGrouping]="false"
        [minFractionDigits]="0"
        [maxFractionDigits]="7"
      />
      @if (form.controls.longitud.touched && form.controls.longitud.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Valor fuera de rango (mínimo -180, máximo 180).
        </p-message>
      }
    </div>

    <div class="sm:col-span-2">
      <label for="address-is-active" class="mb-1 block text-sm font-medium text-slate-700">
        Estado
      </label>
      <p-select
        [fluid]="true"
        inputId="address-is-active"
        formControlName="is_active"
        [options]="activeOptions"
        optionLabel="label"
        optionValue="value"
      />
      @if (address()) {
        <p class="mt-1 text-xs text-slate-500">
          El estado de un registro existente solo cambia con la baja lógica.
        </p>
      }
    </div>
  </div>

  <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
    <button pButton type="button" severity="secondary" outlined (click)="cancelled.emit()">
      <span pButtonLabel>Cancelar</span>
    </button>
    <button pButton type="submit" [loading]="saving()">
      <i pButtonIcon class="pi pi-check"></i>
      <span pButtonLabel>Guardar</span>
    </button>
  </div>
</form>
```

`src/app/features/addresses/address-list/address-list.ts`

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Address, AddressPayload } from '../../../core/models/address.model';
import { Company } from '../../../core/models/company.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { humanize } from '../../../core/utils/labels';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { CompanyApi } from '../../companies/company-api';
import { AddressApi } from '../address-api';
import { AddressForm } from '../address-form/address-form';

/**
 * Lista de direcciones con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-address-list',
  imports: [AddressForm, ButtonModule, DialogModule, EmptyState, InputTextModule, MessageModule, PageHeader, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './address-list.html',
  styleUrl: './address-list.css',
})
export class AddressList {
  private readonly api = inject(AddressApi);
  private readonly companyApi = inject(CompanyApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/address`). */
  readonly rows = signal<Address[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.alias,
      row.linea1,
      row.linea2,
      row.ciudad,
      row.departamento,
      row.tipo,
      this.companyName()(row.empresa_id),
    ]),
  );

  /** `id → razon_social` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly companyName = computed(() => {
    const names = new Map<number, string>(this.companies().map((item) => [item.id, String(item.razon_social)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<Address | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar dirección' : 'Nueva dirección'));

  protected readonly humanize = humanize;

  constructor() {
    this.load();
  }

  /** `GET /api/address`: recarga la tabla y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      rows: this.api.list(),
      companies: this.companyApi.list(),
    }).subscribe({
      next: ({ rows, companies }) => {
        this.rows.set(rows);
        this.companies.set(companies);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: Address): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   */
  save(payload: AddressPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Dirección actualizada' : 'Dirección creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(row: Address): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${row.alias}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Dirección desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(row: Address): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${row.alias} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Dirección eliminada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
```

`src/app/features/addresses/address-list/address-list.html`

```html
<app-page-header
  title="Direcciones"
  subtitle="Direcciones de recogida, entrega o mixtas de cada empresa."
>
  <p-tag [value]="rows().length + ' registros'" severity="info" [rounded]="true" />
  <button pButton type="button" (click)="openCreate()">
    <i pButtonIcon class="pi pi-plus"></i>
    <span pButtonLabel>Nueva dirección</span>
  </button>
</app-page-header>

@if (error()) {
  <p-message severity="error" styleClass="mb-4 w-full">
    {{ error() }}
  </p-message>
}

<div class="rounded-xl border border-slate-200 bg-white">
  <p-table
    [value]="visibleRows()"
    [loading]="loading()"
    [paginator]="visibleRows().length > 10"
    [rows]="10"
    dataKey="id"
    tableStyleClass="min-w-3xl"
  >
    <ng-template #caption>
      <div class="flex items-center gap-2">
        <i class="pi pi-search text-slate-400"></i>
        <input
          pInputText
          type="search"
          aria-label="Buscar direcciones"
          placeholder="Buscar por alias, dirección, ciudad o empresa…"
          [value]="filter()"
          (input)="filter.set($any($event.target).value)"
          class="w-full"
        />
      </div>
      @if (filter()) {
        <p class="mt-2 text-xs text-slate-500">
          {{ visibleRows().length }} de {{ rows().length }} coinciden con «{{ filter() }}».
        </p>
      }
    </ng-template>

    <ng-template #header>
      <tr>
        <th pSortableColumn="alias">
          <div class="flex items-center gap-1">Alias <p-sort-icon field="alias" /></div>
        </th>
        <th>Empresa</th>
        <th>Dirección</th>
        <th>Tipo</th>
        <th>Estado</th>
        <th class="w-40 text-right">Acciones</th>
      </tr>
    </ng-template>

    <ng-template #body let-row>
      <tr>
        <td>
          <p class="font-medium text-slate-800">{{ row.alias }}</p>
          <p class="text-xs text-slate-400">#{{ row.id }}</p>
        </td>
        <td>
          <span class="text-sm text-slate-700">{{ companyName()(row.empresa_id) }}</span>
        </td>
        <td>
          <p class="text-sm text-slate-700">{{ row.linea1 }}</p>
          <p class="text-xs text-slate-400">{{ row.ciudad }}{{ row.departamento ? ', ' + row.departamento : '' }}</p>
        </td>
        <td>
          <p-tag [value]="humanize(row.tipo)" severity="secondary" [rounded]="true" />
        </td>
        <td>
          <app-status-tag [isActive]="row.is_active" />
        </td>
        <td>
          <div class="flex justify-end gap-1">
            <button
              pButton
              type="button"
              text
              rounded
              severity="secondary"
              icon="pi pi-pencil"
              aria-label="Editar dirección"
              pTooltip="Editar"
              (click)="openEdit(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="warn"
              icon="pi pi-ban"
              aria-label="Dar de baja"
              pTooltip="Baja lógica"
              (click)="deactivate(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="danger"
              icon="pi pi-trash"
              aria-label="Eliminar dirección"
              pTooltip="Eliminar"
              (click)="remove(row)"
            ></button>
          </div>
        </td>
      </tr>
    </ng-template>

    <ng-template #emptymessage>
      <tr>
        <td colspan="6">
          @if (filter()) {
            <app-empty-state
              icon="pi pi-search"
              title="Sin coincidencias"
              message="Ningún registro coincide con la búsqueda. Borra el filtro para ver todos."
            />
          } @else {
            <app-empty-state
              icon="pi pi-map-marker"
              title="Sin registros"
              message="Crea el primero con el botón «Nueva dirección» o ejecuta el seeder del backend."
            />
          }
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<p-dialog
  [visible]="dialogVisible()"
  (visibleChange)="dialogVisible.set($event)"
  [header]="title()"
  [modal]="true"
  [draggable]="false"
  [resizable]="false"
  [dismissableMask]="true"
  styleClass="w-full max-w-3xl mx-4"
>
  <app-address-form
    [address]="editing()"
    [companies]="companies()"
    [saving]="saving()"
    [resetKey]="resetKey()"
    (saved)="save($event)"
    (cancelled)="dialogVisible.set(false)"
  />
</p-dialog>
```

Los dos `.css` (`address-form.css`, `address-list.css`) quedan sin reglas, como los de `layout/` y `shared/ui/`.

![alt text](img-express/crud_direcciones.png)

## ISS-06 · CRUD de Messenger

**Particularidades**

- Sin claves foráneas: es la pantalla más simple después de Tarifas, buena para comprobar el patrón.
- `tipo_vehiculo` es el enum `moto | carro | bicicleta | a_pie`. La placa es opcional (un mensajero `a_pie` o en `bicicleta` no la tiene).

**Archivos de esta pantalla**

```bash
ng generate component features/messengers/messenger-list --skip-tests --defaults
ng generate component features/messengers/messenger-form --skip-tests --defaults
```

El CLI crea además `messenger-list.spec.ts` y `messenger-form.spec.ts` si no usas `--skip-tests`; las pruebas se tratan en 3.17.

`src/app/features/messengers/messenger-api.ts`

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Messenger, MessengerPayload } from '../../core/models/messenger.model';

/** /messengers — la lista llega en `{ messengers }` y el detalle en `{ messenger }`. */
@Injectable({ providedIn: 'root' })
export class MessengerApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/messengers`;

  list(): Observable<Messenger[]> {
    return this.http
      .get<{ messengers: Messenger[] }>(this.base)
      .pipe(map((response) => response.messengers));
  }

  get(id: number): Observable<Messenger> {
    return this.http
      .get<{ messenger: Messenger }>(`${this.base}/${id}`)
      .pipe(map((response) => response.messenger));
  }

  create(payload: MessengerPayload): Observable<Messenger> {
    return this.http
      .post<{ messenger: Messenger }>(this.base, payload)
      .pipe(map((response) => response.messenger));
  }

  update(id: number, payload: Partial<MessengerPayload>): Observable<Messenger> {
    return this.http
      .patch<{ messenger: Messenger }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.messenger));
  }

  replace(id: number, payload: MessengerPayload): Observable<Messenger> {
    return this.http
      .put<{ messenger: Messenger }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.messenger));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
```

`src/app/features/messengers/messenger-form/messenger-form.ts`

```typescript
import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Messenger, MessengerPayload, VehicleType } from '../../../core/models/messenger.model';

/**
 * Formulario de mensajero, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `messenger` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-messenger-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './messenger-form.html',
  styleUrl: './messenger-form.css',
})
export class MessengerForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly messenger = input<Messenger | null>(null);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<MessengerPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly tipoVehiculoOptions: { label: string; value: VehicleType }[] = [
    { label: 'Moto', value: 'moto' },
    { label: 'Carro', value: 'carro' },
    { label: 'Bicicleta', value: 'bicicleta' },
    { label: 'A pie', value: 'a_pie' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    documento_identidad: ['', [Validators.required, Validators.maxLength(30)]],
    telefono: ['', [Validators.maxLength(30)]],
    tipo_vehiculo: ['moto' as VehicleType, [Validators.required]],
    placa_vehiculo: ['', [Validators.maxLength(15)]],
    zona_asignada: ['', [Validators.maxLength(100)]],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.messenger();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        nombre: current?.nombre ?? '',
        documento_identidad: current?.documento_identidad ?? '',
        telefono: current?.telefono ?? '',
        tipo_vehiculo: current?.tipo_vehiculo ?? 'moto',
        placa_vehiculo: current?.placa_vehiculo ?? '',
        zona_asignada: current?.zona_asignada ?? '',
        is_active: current?.is_active ?? true,
      });

      // `is_active` solo cambia con PATCH /deactivate: al editar no se ofrece.
      if (current) {
        this.form.controls.is_active.disable();
      } else {
        this.form.controls.is_active.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: MessengerPayload = {
      nombre: value.nombre.trim(),
      documento_identidad: value.documento_identidad.trim(),
      telefono: value.telefono.trim() || null,
      tipo_vehiculo: value.tipo_vehiculo,
      placa_vehiculo: value.placa_vehiculo.trim() || null,
      zona_asignada: value.zona_asignada.trim() || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.messenger() ? payload : { ...payload, is_active: value.is_active });
  }
}
```

`src/app/features/messengers/messenger-form/messenger-form.html`

```html
<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <label for="messenger-nombre" class="mb-1 block text-sm font-medium text-slate-700">
        Nombre <span class="text-red-500">*</span>
      </label>
      <input
        id="messenger-nombre"
        pInputText
        formControlName="nombre"
        placeholder="Carlos Pérez"
        class="w-full"
      />
      @if (form.controls.nombre.touched && form.controls.nombre.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 120 caracteres).
        </p-message>
      }
    </div>

    <div>
      <label for="messenger-documento-identidad" class="mb-1 block text-sm font-medium text-slate-700">
        Documento de identidad <span class="text-red-500">*</span>
      </label>
      <input
        id="messenger-documento-identidad"
        pInputText
        formControlName="documento_identidad"
        placeholder="1234567890"
        class="w-full"
      />
      @if (form.controls.documento_identidad.touched && form.controls.documento_identidad.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 30 caracteres).
        </p-message>
      }
    </div>

    <div>
      <label for="messenger-telefono" class="mb-1 block text-sm font-medium text-slate-700">
        Teléfono
      </label>
      <input
        id="messenger-telefono" type="tel"
        pInputText
        formControlName="telefono"
        placeholder="300 000 0000"
        class="w-full"
      />
      @if (form.controls.telefono.touched && form.controls.telefono.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 30 caracteres.
        </p-message>
      }
    </div>

    <div>
      <label for="messenger-tipo-vehiculo" class="mb-1 block text-sm font-medium text-slate-700">
        Tipo de vehículo <span class="text-red-500">*</span>
      </label>
      <p-select
        [fluid]="true"
        inputId="messenger-tipo-vehiculo"
        formControlName="tipo_vehiculo"
        [options]="tipoVehiculoOptions"
        optionLabel="label"
        optionValue="value"
      />
      @if (form.controls.tipo_vehiculo.touched && form.controls.tipo_vehiculo.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio.
        </p-message>
      }
    </div>

    <div>
      <label for="messenger-placa-vehiculo" class="mb-1 block text-sm font-medium text-slate-700">
        Placa del vehículo
      </label>
      <input
        id="messenger-placa-vehiculo"
        pInputText
        formControlName="placa_vehiculo"
        placeholder="ABC123"
        class="w-full"
      />
      @if (form.controls.placa_vehiculo.touched && form.controls.placa_vehiculo.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 15 caracteres.
        </p-message>
      }
    </div>

    <div>
      <label for="messenger-zona-asignada" class="mb-1 block text-sm font-medium text-slate-700">
        Zona asignada
      </label>
      <input
        id="messenger-zona-asignada"
        pInputText
        formControlName="zona_asignada"
        placeholder="Norte"
        class="w-full"
      />
      @if (form.controls.zona_asignada.touched && form.controls.zona_asignada.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Máximo 100 caracteres.
        </p-message>
      }
    </div>

    <div class="sm:col-span-2">
      <label for="messenger-is-active" class="mb-1 block text-sm font-medium text-slate-700">
        Estado
      </label>
      <p-select
        [fluid]="true"
        inputId="messenger-is-active"
        formControlName="is_active"
        [options]="activeOptions"
        optionLabel="label"
        optionValue="value"
      />
      @if (messenger()) {
        <p class="mt-1 text-xs text-slate-500">
          El estado de un registro existente solo cambia con la baja lógica.
        </p>
      }
    </div>
  </div>

  <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
    <button pButton type="button" severity="secondary" outlined (click)="cancelled.emit()">
      <span pButtonLabel>Cancelar</span>
    </button>
    <button pButton type="submit" [loading]="saving()">
      <i pButtonIcon class="pi pi-check"></i>
      <span pButtonLabel>Guardar</span>
    </button>
  </div>
</form>
```

`src/app/features/messengers/messenger-list/messenger-list.ts`

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Messenger, MessengerPayload } from '../../../core/models/messenger.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { humanize } from '../../../core/utils/labels';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { MessengerApi } from '../messenger-api';
import { MessengerForm } from '../messenger-form/messenger-form';

/**
 * Lista de mensajeros con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-messenger-list',
  imports: [ButtonModule, DialogModule, EmptyState, InputTextModule, MessageModule, MessengerForm, PageHeader, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './messenger-list.html',
  styleUrl: './messenger-list.css',
})
export class MessengerList {
  private readonly api = inject(MessengerApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/messengers`). */
  readonly rows = signal<Messenger[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.nombre,
      row.documento_identidad,
      row.telefono,
      row.placa_vehiculo,
      row.zona_asignada,
      row.tipo_vehiculo,
    ]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Messenger | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar mensajero' : 'Nuevo mensajero'));

  protected readonly humanize = humanize;

  constructor() {
    this.load();
  }

  /** `GET /api/messengers`: recarga la tabla y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: Messenger): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   */
  save(payload: MessengerPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Mensajero actualizado' : 'Mensajero creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(row: Messenger): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${row.nombre}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Mensajero desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(row: Messenger): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${row.nombre} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Mensajero eliminado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
```

`src/app/features/messengers/messenger-list/messenger-list.html`

```html
<app-page-header
  title="Mensajeros"
  subtitle="Personas encargadas de las entregas, con su vehículo y zona asignada."
>
  <p-tag [value]="rows().length + ' registros'" severity="info" [rounded]="true" />
  <button pButton type="button" (click)="openCreate()">
    <i pButtonIcon class="pi pi-plus"></i>
    <span pButtonLabel>Nuevo mensajero</span>
  </button>
</app-page-header>

@if (error()) {
  <p-message severity="error" styleClass="mb-4 w-full">
    {{ error() }}
  </p-message>
}

<div class="rounded-xl border border-slate-200 bg-white">
  <p-table
    [value]="visibleRows()"
    [loading]="loading()"
    [paginator]="visibleRows().length > 10"
    [rows]="10"
    dataKey="id"
    tableStyleClass="min-w-3xl"
  >
    <ng-template #caption>
      <div class="flex items-center gap-2">
        <i class="pi pi-search text-slate-400"></i>
        <input
          pInputText
          type="search"
          aria-label="Buscar mensajeros"
          placeholder="Buscar por nombre, documento, placa o zona…"
          [value]="filter()"
          (input)="filter.set($any($event.target).value)"
          class="w-full"
        />
      </div>
      @if (filter()) {
        <p class="mt-2 text-xs text-slate-500">
          {{ visibleRows().length }} de {{ rows().length }} coinciden con «{{ filter() }}».
        </p>
      }
    </ng-template>

    <ng-template #header>
      <tr>
        <th pSortableColumn="nombre">
          <div class="flex items-center gap-1">Nombre <p-sort-icon field="nombre" /></div>
        </th>
        <th>Contacto</th>
        <th>Vehículo</th>
        <th>Zona</th>
        <th>Estado</th>
        <th class="w-40 text-right">Acciones</th>
      </tr>
    </ng-template>

    <ng-template #body let-row>
      <tr>
        <td>
          <p class="font-medium text-slate-800">{{ row.nombre }}</p>
          <p class="text-xs text-slate-400">Doc. {{ row.documento_identidad }}</p>
        </td>
        <td>
          <span class="text-sm text-slate-700">{{ row.telefono || '—' }}</span>
        </td>
        <td>
          <p class="text-sm text-slate-700">{{ humanize(row.tipo_vehiculo) }}</p>
          <p class="text-xs text-slate-400">{{ row.placa_vehiculo || 'Sin placa' }}</p>
        </td>
        <td>
          <span class="text-sm text-slate-600">{{ row.zona_asignada || '—' }}</span>
        </td>
        <td>
          <app-status-tag [isActive]="row.is_active" />
        </td>
        <td>
          <div class="flex justify-end gap-1">
            <button
              pButton
              type="button"
              text
              rounded
              severity="secondary"
              icon="pi pi-pencil"
              aria-label="Editar mensajero"
              pTooltip="Editar"
              (click)="openEdit(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="warn"
              icon="pi pi-ban"
              aria-label="Dar de baja"
              pTooltip="Baja lógica"
              (click)="deactivate(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="danger"
              icon="pi pi-trash"
              aria-label="Eliminar mensajero"
              pTooltip="Eliminar"
              (click)="remove(row)"
            ></button>
          </div>
        </td>
      </tr>
    </ng-template>

    <ng-template #emptymessage>
      <tr>
        <td colspan="6">
          @if (filter()) {
            <app-empty-state
              icon="pi pi-search"
              title="Sin coincidencias"
              message="Ningún registro coincide con la búsqueda. Borra el filtro para ver todos."
            />
          } @else {
            <app-empty-state
              icon="pi pi-send"
              title="Sin registros"
              message="Crea el primero con el botón «Nuevo mensajero» o ejecuta el seeder del backend."
            />
          }
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<p-dialog
  [visible]="dialogVisible()"
  (visibleChange)="dialogVisible.set($event)"
  [header]="title()"
  [modal]="true"
  [draggable]="false"
  [resizable]="false"
  [dismissableMask]="true"
  styleClass="w-full max-w-2xl mx-4"
>
  <app-messenger-form
    [messenger]="editing()"
    [saving]="saving()"
    [resetKey]="resetKey()"
    (saved)="save($event)"
    (cancelled)="dialogVisible.set(false)"
  />
</p-dialog>
```

Los dos `.css` (`messenger-form.css`, `messenger-list.css`) quedan sin reglas, como los de `layout/` y `shared/ui/`.

![alt text](img-express/crud_mensajeros.png)

## ISS-07 · CRUD de Rates

**Particularidades**

- `valor_base`, `valor_por_kg_adicional` y `recargo_urgente_pct` son DECIMAL: la lista los lee como `number | string` y el formulario los normaliza con `toNumberOrNull`. En la tabla, `currency` formatea valores numéricos o cadenas numéricas.
- `vigencia_desde` y `vigencia_hasta` usan `<input type="date">`: `vigencia_hasta` vacío significa «indefinida» y viaja como `null`.

**Archivos de esta pantalla**

```bash
ng generate component features/rates/rate-list --skip-tests --defaults
ng generate component features/rates/rate-form --skip-tests --defaults
```

El CLI crea además `rate-list.spec.ts` y `rate-form.spec.ts` si no usas `--skip-tests`; las pruebas se tratan en 3.17.

`src/app/features/rates/rate-api.ts`

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rate, RatePayload } from '../../core/models/rate.model';

/** /rates — la lista llega en `{ rates }` y el detalle en `{ rate }`. */
@Injectable({ providedIn: 'root' })
export class RateApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/rates`;

  list(): Observable<Rate[]> {
    return this.http
      .get<{ rates: Rate[] }>(this.base)
      .pipe(map((response) => response.rates));
  }

  get(id: number): Observable<Rate> {
    return this.http
      .get<{ rate: Rate }>(`${this.base}/${id}`)
      .pipe(map((response) => response.rate));
  }

  create(payload: RatePayload): Observable<Rate> {
    return this.http
      .post<{ rate: Rate }>(this.base, payload)
      .pipe(map((response) => response.rate));
  }

  update(id: number, payload: Partial<RatePayload>): Observable<Rate> {
    return this.http
      .patch<{ rate: Rate }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.rate));
  }

  replace(id: number, payload: RatePayload): Observable<Rate> {
    return this.http
      .put<{ rate: Rate }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.rate));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
```

`src/app/features/rates/rate-form/rate-form.ts`

```typescript
import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Rate, RatePayload, CalculationRule } from '../../../core/models/rate.model';

import { toDateInput, toNumberOrNull } from '../../../core/utils/form-values';

/**
 * Formulario de tarifa, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `rate` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-rate-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule],
  templateUrl: './rate-form.html',
  styleUrl: './rate-form.css',
})
export class RateForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly rate = input<Rate | null>(null);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<RatePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly reglaCalculoOptions: { label: string; value: CalculationRule }[] = [
    { label: 'Por peso', value: 'por_peso' },
    { label: 'Por zona', value: 'por_zona' },
    { label: 'Plana', value: 'plana' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    zona: ['', [Validators.required, Validators.maxLength(100)]],
    regla_calculo: ['por_peso' as CalculationRule, [Validators.required]],
    valor_base: [null as number | null, [Validators.required, Validators.min(0)]],
    valor_por_kg_adicional: [null as number | null, [Validators.min(0)]],
    recargo_urgente_pct: [null as number | null, [Validators.min(0), Validators.max(100)]],
    vigencia_desde: ['', [Validators.required]],
    vigencia_hasta: [''],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.rate();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        nombre: current?.nombre ?? '',
        zona: current?.zona ?? '',
        regla_calculo: current?.regla_calculo ?? 'por_peso',
        valor_base: toNumberOrNull(current?.valor_base),
        valor_por_kg_adicional: toNumberOrNull(current?.valor_por_kg_adicional),
        recargo_urgente_pct: toNumberOrNull(current?.recargo_urgente_pct),
        vigencia_desde: toDateInput(current?.vigencia_desde),
        vigencia_hasta: toDateInput(current?.vigencia_hasta),
        is_active: current?.is_active ?? true,
      });

      // `is_active` solo cambia con PATCH /deactivate: al editar no se ofrece.
      if (current) {
        this.form.controls.is_active.disable();
      } else {
        this.form.controls.is_active.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: RatePayload = {
      nombre: value.nombre.trim(),
      zona: value.zona.trim(),
      regla_calculo: value.regla_calculo,
      valor_base: Number(value.valor_base),
      valor_por_kg_adicional: value.valor_por_kg_adicional,
      recargo_urgente_pct: value.recargo_urgente_pct,
      vigencia_desde: value.vigencia_desde,
      vigencia_hasta: value.vigencia_hasta || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.rate() ? payload : { ...payload, is_active: value.is_active });
  }
}
```

`src/app/features/rates/rate-form/rate-form.html`

```html
<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <label for="rate-nombre" class="mb-1 block text-sm font-medium text-slate-700">
        Nombre <span class="text-red-500">*</span>
      </label>
      <input
        id="rate-nombre"
        pInputText
        formControlName="nombre"
        placeholder="Urbana estándar"
        class="w-full"
      />
      @if (form.controls.nombre.touched && form.controls.nombre.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 120 caracteres).
        </p-message>
      }
    </div>

    <div>
      <label for="rate-zona" class="mb-1 block text-sm font-medium text-slate-700">
        Zona <span class="text-red-500">*</span>
      </label>
      <input
        id="rate-zona"
        pInputText
        formControlName="zona"
        placeholder="Barranquilla"
        class="w-full"
      />
      @if (form.controls.zona.touched && form.controls.zona.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio (máximo 100 caracteres).
        </p-message>
      }
    </div>

    <div class="sm:col-span-2">
      <label for="rate-regla-calculo" class="mb-1 block text-sm font-medium text-slate-700">
        Regla de cálculo <span class="text-red-500">*</span>
      </label>
      <p-select
        [fluid]="true"
        inputId="rate-regla-calculo"
        formControlName="regla_calculo"
        [options]="reglaCalculoOptions"
        optionLabel="label"
        optionValue="value"
      />
      @if (form.controls.regla_calculo.touched && form.controls.regla_calculo.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio.
        </p-message>
      }
    </div>

    <div>
      <label for="rate-valor-base" class="mb-1 block text-sm font-medium text-slate-700">
        Valor base <span class="text-red-500">*</span>
      </label>
      <p-inputnumber
        [fluid]="true"
        inputId="rate-valor-base"
        formControlName="valor_base"
        mode="decimal"
        [min]="0"
        [minFractionDigits]="0"
        [maxFractionDigits]="2"
      />
      @if (form.controls.valor_base.touched && form.controls.valor_base.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Obligatorio (valor mínimo 0).
        </p-message>
      }
    </div>

    <div>
      <label for="rate-valor-por-kg-adicional" class="mb-1 block text-sm font-medium text-slate-700">
        Valor por kg adicional
      </label>
      <p-inputnumber
        [fluid]="true"
        inputId="rate-valor-por-kg-adicional"
        formControlName="valor_por_kg_adicional"
        mode="decimal"
        [min]="0"
        [minFractionDigits]="0"
        [maxFractionDigits]="2"
      />
      @if (form.controls.valor_por_kg_adicional.touched && form.controls.valor_por_kg_adicional.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Valor fuera de rango (mínimo 0).
        </p-message>
      }
    </div>

    <div>
      <label for="rate-recargo-urgente-pct" class="mb-1 block text-sm font-medium text-slate-700">
        Recargo urgente
      </label>
      <p-inputnumber
        [fluid]="true"
        inputId="rate-recargo-urgente-pct"
        formControlName="recargo_urgente_pct"
        mode="decimal"
        [min]="0"
        [max]="100"
        suffix=" %"
        [minFractionDigits]="0"
        [maxFractionDigits]="2"
      />
      @if (form.controls.recargo_urgente_pct.touched && form.controls.recargo_urgente_pct.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Valor fuera de rango (mínimo 0, máximo 100).
        </p-message>
      }
    </div>

    <div>
      <label for="rate-vigencia-desde" class="mb-1 block text-sm font-medium text-slate-700">
        Vigente desde <span class="text-red-500">*</span>
      </label>
      <input id="rate-vigencia-desde" type="date" pInputText formControlName="vigencia_desde" class="w-full" />
      @if (form.controls.vigencia_desde.touched && form.controls.vigencia_desde.invalid) {
        <p-message severity="error" size="small" variant="simple" styleClass="mt-1">
          Este campo es obligatorio.
        </p-message>
      }
    </div>

    <div>
      <label for="rate-vigencia-hasta" class="mb-1 block text-sm font-medium text-slate-700">
        Vigente hasta
      </label>
      <input id="rate-vigencia-hasta" type="date" pInputText formControlName="vigencia_hasta" class="w-full" />
    </div>

    <div class="sm:col-span-2">
      <label for="rate-is-active" class="mb-1 block text-sm font-medium text-slate-700">
        Estado
      </label>
      <p-select
        [fluid]="true"
        inputId="rate-is-active"
        formControlName="is_active"
        [options]="activeOptions"
        optionLabel="label"
        optionValue="value"
      />
      @if (rate()) {
        <p class="mt-1 text-xs text-slate-500">
          El estado de un registro existente solo cambia con la baja lógica.
        </p>
      }
    </div>
  </div>

  <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
    <button pButton type="button" severity="secondary" outlined (click)="cancelled.emit()">
      <span pButtonLabel>Cancelar</span>
    </button>
    <button pButton type="submit" [loading]="saving()">
      <i pButtonIcon class="pi pi-check"></i>
      <span pButtonLabel>Guardar</span>
    </button>
  </div>
</form>
```

`src/app/features/rates/rate-list/rate-list.ts`

```typescript
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Rate, RatePayload } from '../../../core/models/rate.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { humanize } from '../../../core/utils/labels';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { RateApi } from '../rate-api';
import { RateForm } from '../rate-form/rate-form';

/**
 * Lista de tarifas con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-rate-list',
  imports: [ButtonModule, CurrencyPipe, DatePipe, DialogModule, EmptyState, InputTextModule, MessageModule, PageHeader, RateForm, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './rate-list.html',
  styleUrl: './rate-list.css',
})
export class RateList {
  private readonly api = inject(RateApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/rates`). */
  readonly rows = signal<Rate[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.nombre,
      row.zona,
      row.regla_calculo,
    ]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Rate | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar tarifa' : 'Nueva tarifa'));

  protected readonly humanize = humanize;

  constructor() {
    this.load();
  }

  /** `GET /api/rates`: recarga la tabla y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: Rate): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   */
  save(payload: RatePayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Tarifa actualizada' : 'Tarifa creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(row: Rate): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${row.nombre}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Tarifa desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(row: Rate): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${row.nombre} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Tarifa eliminada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
```

`src/app/features/rates/rate-list/rate-list.html`

```html
<app-page-header
  title="Tarifas"
  subtitle="Reglas de cálculo de costos por zona y vigencia."
>
  <p-tag [value]="rows().length + ' registros'" severity="info" [rounded]="true" />
  <button pButton type="button" (click)="openCreate()">
    <i pButtonIcon class="pi pi-plus"></i>
    <span pButtonLabel>Nueva tarifa</span>
  </button>
</app-page-header>

@if (error()) {
  <p-message severity="error" styleClass="mb-4 w-full">
    {{ error() }}
  </p-message>
}

<div class="rounded-xl border border-slate-200 bg-white">
  <p-table
    [value]="visibleRows()"
    [loading]="loading()"
    [paginator]="visibleRows().length > 10"
    [rows]="10"
    dataKey="id"
    tableStyleClass="min-w-3xl"
  >
    <ng-template #caption>
      <div class="flex items-center gap-2">
        <i class="pi pi-search text-slate-400"></i>
        <input
          pInputText
          type="search"
          aria-label="Buscar tarifas"
          placeholder="Buscar por nombre, zona o regla…"
          [value]="filter()"
          (input)="filter.set($any($event.target).value)"
          class="w-full"
        />
      </div>
      @if (filter()) {
        <p class="mt-2 text-xs text-slate-500">
          {{ visibleRows().length }} de {{ rows().length }} coinciden con «{{ filter() }}».
        </p>
      }
    </ng-template>

    <ng-template #header>
      <tr>
        <th pSortableColumn="nombre">
          <div class="flex items-center gap-1">Nombre <p-sort-icon field="nombre" /></div>
        </th>
        <th>Regla</th>
        <th pSortableColumn="valor_base">
          <div class="flex items-center gap-1">Valor base <p-sort-icon field="valor_base" /></div>
        </th>
        <th>Vigencia</th>
        <th>Estado</th>
        <th class="w-40 text-right">Acciones</th>
      </tr>
    </ng-template>

    <ng-template #body let-row>
      <tr>
        <td>
          <p class="font-medium text-slate-800">{{ row.nombre }}</p>
          <p class="text-xs text-slate-400">{{ row.zona }}</p>
        </td>
        <td>
          <p-tag [value]="humanize(row.regla_calculo)" severity="secondary" [rounded]="true" />
        </td>
        <td>
          {{ row.valor_base | currency: 'COP' : 'symbol' : '1.0-0' }}
        </td>
        <td>
          <span class="text-sm text-slate-600">{{ row.vigencia_desde | date: 'dd/MM/yyyy' }} →
            {{ row.vigencia_hasta ? (row.vigencia_hasta | date: 'dd/MM/yyyy') : 'Indefinida' }}</span>
        </td>
        <td>
          <app-status-tag [isActive]="row.is_active" />
        </td>
        <td>
          <div class="flex justify-end gap-1">
            <button
              pButton
              type="button"
              text
              rounded
              severity="secondary"
              icon="pi pi-pencil"
              aria-label="Editar tarifa"
              pTooltip="Editar"
              (click)="openEdit(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="warn"
              icon="pi pi-ban"
              aria-label="Dar de baja"
              pTooltip="Baja lógica"
              (click)="deactivate(row)"
            ></button>
            <button
              pButton
              type="button"
              text
              rounded
              severity="danger"
              icon="pi pi-trash"
              aria-label="Eliminar tarifa"
              pTooltip="Eliminar"
              (click)="remove(row)"
            ></button>
          </div>
        </td>
      </tr>
    </ng-template>

    <ng-template #emptymessage>
      <tr>
        <td colspan="6">
          @if (filter()) {
            <app-empty-state
              icon="pi pi-search"
              title="Sin coincidencias"
              message="Ningún registro coincide con la búsqueda. Borra el filtro para ver todos."
            />
          } @else {
            <app-empty-state
              icon="pi pi-dollar"
              title="Sin registros"
              message="Crea el primero con el botón «Nueva tarifa» o ejecuta el seeder del backend."
            />
          }
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<p-dialog
  [visible]="dialogVisible()"
  (visibleChange)="dialogVisible.set($event)"
  [header]="title()"
  [modal]="true"
  [draggable]="false"
  [resizable]="false"
  [dismissableMask]="true"
  styleClass="w-full max-w-2xl mx-4"
>
  <app-rate-form
    [rate]="editing()"
    [saving]="saving()"
    [resetKey]="resetKey()"
    (saved)="save($event)"
    (cancelled)="dialogVisible.set(false)"
  />
</p-dialog>
```

Los dos `.css` (`rate-form.css`, `rate-list.css`) quedan sin reglas, como los de `layout/` y `shared/ui/`.

![alt text](img-express/crud_tarifas.png)