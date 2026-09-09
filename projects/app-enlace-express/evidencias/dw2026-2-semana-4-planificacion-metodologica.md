# PLANIFICACIÓN METODOLÓGICA SEMANA 04

## Proyecto: EnlaceExpress — Mensajería corporativa

## 1. Identificación del problema

**EnlaceExpress** es un sistema de mensajería corporativa: empresas contratan envíos de paquetes entre múltiples puntos de recogida y entrega, y el sistema debe cubrir todo el ciclo de vida de esa operación — desde que una empresa cliente solicita un envío, pasando por cotización, asignación de mensajero y ruta, seguimiento en tiempo real, hasta la entrega verificada con evidencia, y finalmente la consolidación de esos envíos en una factura periódica.

La idea central del negocio es que nada se marca como completado sin trazabilidad: cada envío deja un rastro de eventos (**EventoTracking**) y no puede cerrarse sin una prueba de entrega verificable. Esto es lo que hace confiable al sistema frente a las empresas clientes, que necesitan evidencia de que su mercancía llegó a la persona correcta.

El flujo natural comienza cuando una empresa se registra y define sus **Contactos** y **Direcciones** habituales → solicita un Envío (que puede contener varios **Paquetes**) especificando origen destino y prioridad → el sistema calcula el costo aplicando una **Tarifa** vigente según zona/peso/prioridad → el área de despacho asigna un **Mensajero** y una **Ruta** → el envío genera EventosTracking en cada etapa (recogido, en tránsito, novedad, etc.) → al llegar a destino se registra la **PruebaEntrega** con receptor y evidencia → periódicamente, los envíos cerrados de cada empresa se agrupan en una **Factura**.

## 2. Objetivo 

- **OBJ-S04** Al finalizar la semana, comprendo el dominio y la arquitectura de **EnlaceExpress** (problema, actores, requisitos, entidades y relaciones), defino la arquitectura por capas, establezco los contratos (DTO/API) y dejo la base del backend NestJS (config, common, database, logging, health, Swagger) lista para construir durante la clase una primera rebanada vertical funcional y continuar su integración en las semanas siguientes.

## 3. Resultados esperados

| **ID** |                     **Resultado esperado**                                         |
|--------|------------------------------------------------------------------------------------|
|R-S04-01|Problema, actores y requisitos del dominio identificados y documentados.            |
|R-S04-02|Modelo de dominio definido (entidades, relaciones, agregados) y diagramado.         |
|R-S04-03|Arquitectura por capas definida (presentation, application, domain, infrastructure).|
|R-S04-04|Contratos (DTO/API) iniciales definidos y documentados.                             |
|R-S04-05|Base del backend NestJS creada: config, common, database, logging, health, Swagger. |
|R-S04-06|SDD (`docs/sdd.md`) y Kanban (`docs/kanban.md`) del proyecto actualizados.          |

## 4. SPEC semanal — SPEC-S04 y requisitos 

**SPEC-S04:** modelar el dominio EnlaceExpress (empresa, contacto, direccion, envio, paquete, EventoTracking,  mensajero, ruta, tarifa, PruebaEntrega y factura con RBAC transversal), definir la arquitectura cliente-servidor y por capas (presentation/application/domain/infrastructure), establecer los contratos iniciales y crear la base del backend NestJS (config, common, database, logging, health y Swagger) sin frontend. Todo queda documentado en `docs/sdd.md` y `docs/kanban.md`.

**Requisitos derivados:**

| **ID** | **Requisito** |
|---|---|
| REQ-S04-01 | Problema, actores y requisitos del dominio documentados (`docs/sdd.md`). |
| REQ-S04-02 | Modelo de dominio con entidades y relaciones definido y diagramado (Empresa → Factura, incluyendo bridge RBAC). |
| REQ-S04-03 | Arquitectura por capas definida y explicada (presentation/application/domain/infrastructure) para `iam/` y `features/business/*`. |
| REQ-S04-04 | Contratos (DTO/API) iniciales definidos y documentados para los casos de uso CU-01 a CU-14. |
| REQ-S04-05 | Base del backend NestJS operativa con Sequelize: config, common, database, logging, health, Swagger. |
| REQ-S04-06 | `docs/sdd.md` y `docs/kanban.md` del proyecto actualizados con trazabilidad. |
 
---------------------------------------------------------------------------------------------------------
 
## 5. Criterios de aceptación y evidencia esperada (Momento 2 · Especificación SDD)
 
| **ID** | **Criterio de aceptación** | **Evidencia** |
|---|---|---|
| AC-S04-01 | Documento con problema, actores y requisitos del dominio EnlaceExpress. | EVI-S04-01 (`docs/sdd.md`) |
| AC-S04-02 | Diagrama del modelo de dominio (entidades, relaciones, agregado) y del subsistema RBAC. | EVI-S04-02 (diagramas ER) |
| AC-S04-03 | Diagrama de arquitectura por capas con responsabilidades por módulo. | EVI-S04-03 (diagrama de capas) |
| AC-S04-04 | Contratos definidos (DTO/API) con ejemplo de request/response para al menos 3 casos de uso. | EVI-S04-04 (`docs/contratos`) |
| AC-S04-05 | Backend NestJS arranca; `/health` responde; Swagger accesible. | EVI-S04-05 (captura + `/health`) |
| AC-S04-06 | `docs/sdd.md` y `docs/kanban.md` reflejan OBJ/SPEC/REQ/AC/Issues. | EVI-S04-06 (archivos) |
 
*Criterios de calidad comunes: dominio y arquitectura expresados en el lenguaje del proyecto (guía, envío, tracking, tarifa); capas con responsabilidades claras; contratos consistentes con el modelo de dominio; backend arranca en WSL sin Docker para el framework; secretos excluidos; evidencia legible y trazable.*
 
---------------------------------------------------------------------------------------------------------
 
## 6. Matriz de trazabilidad (Momento 2 · Especificación SDD)
 
| **OBJ** | **SPEC** | **REQ** | **AC** | **Issue** | **Evidencia** |
|---|---|---|---|---|---|
| OBJ-S04 | SPEC-S04 | REQ-S04-01 | AC-S04-01 | #01 | EVI-S04-01 |
| OBJ-S04 | SPEC-S04 | REQ-S04-02 | AC-S04-02 | #02 | EVI-S04-02 |
| OBJ-S04 | SPEC-S04 | REQ-S04-03 | AC-S04-03 | #03 | EVI-S04-03 |
| OBJ-S04 | SPEC-S04 | REQ-S04-04 | AC-S04-04 | #04 | EVI-S04-04 |
| OBJ-S04 | SPEC-S04 | REQ-S04-05 | AC-S04-05 | #05 | EVI-S04-05 |
| OBJ-S04 | SPEC-S04 | REQ-S04-06 | AC-S04-06 | #06 | EVI-S04-06 |
 
---------------------------------------------------------------------------------------------------------
 
## 7. Issues de la semana — Momento 3 · Organización Kanban
 
| **Issue** | **Descripción** | **REQ** | **DoR (entrada)** | **DoD (salida)** |
|---|---|---|---|---|
| #01 | Documentar problema, actores y requisitos del dominio EnlaceExpress | REQ-S04-01 | Narrativa asignada (S01) | `docs/sdd.md` con dominio |
| #02 | Modelar dominio: entidades, relaciones y agregados (Empresa, Envío, Tracking, Facturación) + RBAC | REQ-S04-02 | Requisitos definidos (#01) | Diagrama de dominio + RBAC |
| #03 | Definir arquitectura por capas para `iam/` y `features/business/*` | REQ-S04-03 | Modelo de dominio (#02) | Diagrama de arquitectura |
| #04 | Definir contratos (DTO/API) para CU-01 a CU-14 | REQ-S04-04 | Modelo de dominio (#02) | Contratos documentados |
| #05 | Crear base del backend NestJS con Sequelize | REQ-S04-05 | Node LTS + npm (S03) | Backend arranca + `/health` |
| #06 | Actualizar `docs/sdd.md` y `docs/kanban.md` | REQ-S04-06 | #01–#05 | SDD + Kanban trazables |
 
---------------------------------------------------------------------------------------------------------
 
## 8. Dependencias entre Issues — Momento 3 · Organización Kanban
 
**Ruta crítica o secuencia mínima:** #01 (dominio/requisitos) → #02 (modelo) → #03 (arquitectura) y #04 (contratos) en paralelo; #05 (backend base) requiere Node de S03; #06 (docs) depende de #01–#05. Todo converge en GATE-S04.
 
**Bloqueos / riesgos principales y plan alterno:**
 
| **Bloqueo / riesgo** | **Plan alterno** |
|---|---|
| No se comprende el dominio de mensajería corporativa multi-punto (múltiples direcciones, contactos, prioridades) | Releer la narrativa y las reglas de negocio antes de modelar. |
| Base de código previa inexistente | Definir primero arquitectura y contratos antes de implementar. |
| NestJS no arranca por configuraciones | Verificar Node/npm, dependencias de Sequelize y documentar en bitácora. |
| Conexión remota a BD pendiente | Se aborda en semana 5; esta semana solo se deja config/database listos. |
 
---------------------------------------------------------------------------------------------------------
 
## 9. Kanban semanal — Momento 3 · Organización Kanban
 
| **Columna** | **Significado** | **Política de entrada / salida** |
|---|---|---|
| Por especificar | Necesidad vinculada a un resultado de aprendizaje. | Sale al completar la especificación SDD. |
| Especificada | OBJ/SPEC/REQ/AC y fuentes definidos. | Sale con aprobación docente (DoR) para iniciar. |
| En desarrollo | Unidad de trabajo dentro del WIP acordado. | Sale con cambio versionado, prueba y evidencia. |
| En revisión humana | Entrega presentada con evidencia. | Sale sin hallazgos bloqueantes. |
| En ajustes | Hallazgos registrados en la revisión. | Sale con correcciones trazables y verificación superada. |
| Aceptada/Evidenciada | Criterios de finalización (DoD) cumplidos. | Evidencia vinculada y decisión de cierre. |
 
| **Issue** | **Columna inicial** | **Responsable** | **Bloqueado** | **Motivo / acción** |
|---|---|---|---|---|
| #01 | Especificada | enlace-express | No | Narrativa asignada (S01) |
| #02 | Especificada | enlace-express | No | Depende de #01 |
| #03 | Por especificar | enlace-express | No | Depende de #02 |
| #04 | Por especificar | enlace-express | No | Depende de #02 |
| #05 | Especificada | enlace-express | No | Node LTS verificado |
| #06 | Por especificar | enlace-express | No | Depende de #01–#05 |
 
---------------------------------------------------------------------------------------------------------
 
## 10. Plan de los momentos académicos — Guion (Momento 3 · Organización Kanban)
 
| **Bloque** | **Duración aprox.** | **Momento MIRIA** | **Actividad** |
|---|---|---|---|
| Apertura | 10 min | 1 | Recapitular S03; presentar OBJ-S04 y AC. |
| Dominio y requisitos | 40 min | 1–2 | Problema, actores y requisitos de EnlaceExpress. |
| Modelo de dominio | 40 min | 2–4 | Entidades, relaciones y agregado; diagrama. |
| Arquitectura por capas | 30 min | 3–4 | Capas y responsabilidades; contratos. |
| Base backend NestJS | 50 min | 4 | config, common, database, logging, health, Swagger. |
| Cierre | 20 min | 5–6 | SDD/Kanban, evidencias y GATE-S04 preliminar. |
 
**Distribución del trabajo del estudiante (Antes / Durante / Después):**
 
| **Momento académico** | **Qué hace el estudiante** | **Dónde se registra y controla** |
|---|---|---|
| ANTES de clase (M1-M3) | Prepara la semana: OBJ, SPEC, REQ, AC, Issues y tablero Kanban. | GitHub personal (`docs/sdd.md`, `docs/kanban.md`). |
| DURANTE la clase (M4) | Ejecuta las fases con apoyo responsable de IA; verifica y documenta. | GitHub personal (código + `docs/proceso.md`). |
| DESPUÉS de clase (M5-M6) | Verifica evidencias, reflexiona y cierra el Gate. Es trabajo fuera de clase. | GitHub personal (`evidencias/` + commit de cierre). Sincroniza Kanban con SDD y actualiza en Akumaja/Moodle Uniguajira. |
 
*Trabajo fuera de clase con seguimiento y control: subir a GitHub personal el código, la metodología MIRIA aplicada (sdd, kanban, proceso) y las evidencias, con un commit por cada Issue. Se excluyen secretos (`.env`). Se verifica trazabilidad OBJ→SPEC→REQ→AC→Issue→EVI→Gate.*
 
---------------------------------------------------------------------------------------------------------
 
# MOMENTO ACADÉMICO 2
### DURANTE LA CLASE — EJECUTAR · Momento MIRIA 4
 
*Desarrollo con apoyo autorizado de IA y registro de decisiones, con verificación continua, actualización del tablero y recolección de evidencias.*
 
## 11. Investigación con IA y Web — Momento 4 · Desarrollo con IA
 
| **Pregunta / necesidad** | **Fuente autorizada preferente** | **Verificación esperada** |
|---|---|---|
| ¿Cómo modelar el dominio de un sistema (DDD)? | Documentación oficial / libros recomendados | Diagrama de entidades y relaciones |
| ¿Cómo estructurar una arquitectura por capas en NestJS? | Documentación oficial NestJS | Diagrama de capas |
| ¿Qué es un contrato/DTO y cómo definirlo? | Documentación oficial NestJS/OpenAPI | Contratos definidos |
| ¿Cómo configurar Swagger en NestJS? | Documentación oficial NestJS (Swagger) | Swagger accesible |
| ¿Cómo modelar una máquina de estados de negocio (ciclo de vida de `Envio`) en NestJS/Sequelize? | Documentación oficial Sequelize / patrones de estado | Transiciones válidas implementadas en `domain` |
 
*Contraste IA/Web: ante discrepancias, prevalece la fuente oficial; toda decisión se registra en `docs/proceso.md`.*
 
---------------------------------------------------------------------------------------------------------
 
## 12. Bitácora técnica — docs/proceso.md (Momento 4 · Desarrollo con IA y registro de decisiones)
 
| **Entrada** | **Contenido mínimo** |
|---|---|
| Contexto | Fecha, autor, Issue, REQ/AC que se demuestra. |
| Comando / acción | Comando reproducible y salida relevante. |
| Decisión | Qué se decidió y por qué (incluye IA utilizada). |
| Bloqueo | Causa, responsable de seguimiento y próxima acción. |
| Evidencia | Enlace relativo a la carpeta de evidencias. |
 
---------------------------------------------------------------------------------------------------------
 
# MOMENTO ACADÉMICO 3
### DESPUÉS DE LA CLASE — DECIDIR Y MEJORAR · Momentos MIRIA 5 y 6
 
*Verificación de fuentes, razonamiento, originalidad, seguridad y cumplimiento (Momento 5); reflexión, ajuste y documentación de la mejora (Momento 6).*
 
## 13. Evidencias — Momento 5 · Verificación
 
*Ubicación raíz de evidencias: `evidencias/semana-04/` (subcarpetas `evi-s04-XX`).*
 
| **ID** | **AC que demuestra** | **Evidencia esperada** |
|---|---|---|
| EVI-S04-01 | AC-S04-01 | Problema, actores y requisitos del dominio EnlaceExpress |
| EVI-S04-02 | AC-S04-02 | Diagrama del modelo de dominio + RBAC |
| EVI-S04-03 | AC-S04-03 | Diagrama de arquitectura por capas |
| EVI-S04-04 | AC-S04-04 | Contratos (DTO/API) definidos |
| EVI-S04-05 | AC-S04-05 | Backend arranca; `/health` y Swagger |
| EVI-S04-06 | AC-S04-06 | `docs/sdd.md` y `docs/kanban.md` actualizados |
 
---------------------------------------------------------------------------------------------------------
 
## 14. Gate semanal — GATE-S04 (Momento 6 · Reflexión)
 
**Pregunta conductora:** ¿comprendo el dominio y la arquitectura de EnlaceExpress, y dejo la rebanada funcional del backend NestJS arrancando: dominio (Empresa → Factura), aplicación, Sequelize, API, JWT/RBAC, integración y pruebas, sin frontend?
 
| **Criterio de decisión** | **Condición** |
|---|---|
| Aprobado | Los 6 AC evidenciados y verificables. |
| Aprobado con acciones | AC parciales; acciones claras antes de S05. |
| No aprobado | Sin dominio/arquitectura definidos ni backend base. |
 
*Decisión: pendiente de evaluación en clase — se completa con EVI-S04-01…06 y las acciones de mejora correspondientes.*
 
---------------------------------------------------------------------------------------------------------
 
## 15. Gate Learning (Momento 6 · Reflexión)
 
| **Dimensión** | **Pregunta de comprobación** |
|---|---|
| Comprensión | ¿Puedo explicar el problema, los actores (Empresa cliente, Mensajero, Despacho, Facturación) y los requisitos de EnlaceExpress? |
| Diseño | ¿Explico la arquitectura por capas y por qué separo dominio de negocio y subsistema RBAC? |
| Diagnóstico | ¿Identifico por qué el backend no arranca o el Swagger no carga? |
| Transferencia | ¿Aplico el modelado de dominio de EnlaceExpress a las decisiones de implementación de la semana siguiente? |
 
---------------------------------------------------------------------------------------------------------
 
## 16. Retrospectiva semanal (Momento 6 · Reflexión)
 
| **Pregunta** | **Registro** |
|---|---|
| ¿Qué funcionó bien? | … |
| ¿Qué se puede mejorar? | … |
| ¿Qué bloqueo requiere seguimiento? | … |
| ¿Qué se lleva a la semana siguiente? | … |
 
---------------------------------------------------------------------------------------------------------
 
## 17. Seguimiento docente y acciones posteriores (Momento 6 · Reflexión)
 
| **Estudiante / equipo** | **AC evidenciados** | **Pendiente** | **Acción para la semana siguiente** |
|---|---|---|---|
| enlace-express | … | … | … |
 
*Registro de retroalimentación: completar tras la demostración; registrar qué parte de OBJ-S04 fue demostrada, AC no cumplidos, causas y acciones.*
 
---------------------------------------------------------------------------------------------------------
 
## 18. Checklist de cierre semanal (Momento 6 · Reflexión)
 
| **✓** | **Criterio** |
|---|---|
| ☐ | Problema, actores y requisitos documentados. |
| ☐ | Modelo de dominio diagramado. |
| ☐ | Arquitectura por capas definida. |
| ☐ | Contratos (DTO/API) definidos. |
| ☐ | Backend NestJS arranca; `/health` y Swagger accesibles. |
| ☐ | `docs/sdd.md` y `docs/kanban.md` actualizados. |
| ☐ | Evidencias EVI-S04-01…06 enlazadas. |
| ☐ | GATE-S04, Gate Learning y retrospectiva diligenciados. |
 
**Estado final de la semana: PLAN LISTO PARA EJECUCIÓN** — el cierre académico y GATE-S04 quedan pendientes hasta observar evidencias reales.
 
---------------------------------------------------------------------------------------------------------
 
## 19. Adaptación al proyecto (réplica cerrada sobre EnlaceExpress)
 
| **Elemento** | **Docente (StoreLab)** | **Estudiante (EnlaceExpress)** |
|---|---|---|
| Narrativa | StoreLab: clientes, productos, ventas, RBAC | Mensajería corporativa: empresas, envíos, tracking, tarifas, prueba de entrega, facturación, RBAC |
| Dominio | Entidades de negocio StoreLab + RBAC | Empresa, Contacto, Direccion, Envio, Paquete, EventoTracking, Mensajero, Ruta, Tarifa, PruebaEntrega, Factura + RBAC |
| Arquitectura | Capas: presentation/application/domain/infrastructure | Misma arquitectura, aplicada a `iam/` y `features/business/{corporate-customers,shipping,dispatch,tracking,proof-of-delivery,invoicing}` |
| Backend | Base NestJS: config, common, database, logging, health, Swagger | Base NestJS + Sequelize para EnlaceExpress |
| Contratos | DTO/API de StoreLab | DTO/API de CU-01 a CU-14 (registrar empresa, cotizar envío, asignar mensajero, tracking, prueba de entrega, consolidar factura, IAM) |
| Evidencias | EVI-S04-01…06 (StoreLab) | EVI-S04-01…06 (EnlaceExpress) |
| Autor / referencia | Docente (modelo) | enlace-express |
 
---------------------------------------------------------------------------------------------------------
 
## 20. Preparación para la construcción funcional en clase
 
Antes de la sesión, debo llegar con el dominio de EnlaceExpress identificado y con la misma estructura de trabajo que se demuestra sobre el proyecto guía. La preparación no consiste en programar un CRUD aislado: deja listos el mapa de dominio, la SDD, el tablero y los datos de conexión para poder construir y verificar una capacidad integrada durante la clase.
 
| **Orden** | **Preparación obligatoria** | **Salida antes de clase** |
|---|---|---|
| 1 | Identificar el proyecto, actores, entidades de negocio, relaciones y roles. | Mapa de dominio de EnlaceExpress. |
| 2 | Definir la capacidad que conectará varias entidades y su resultado observable (p. ej. cotizar → asignar → entregar). | OBJ, SPEC, REQ y AC de una rebanada funcional. |
| 3 | Crear Issues dependientes para base, dominio, aplicación, Sequelize, API, seguridad, integración y pruebas. | Kanban con WIP=1, DoR, DoD y pruebas previstas. |
| 4 | Verificar WSL, Node, repositorio, motor Docker y acceso remoto por IP. | Registro técnico sin secretos. |
| 5 | Preparar `.env.example` con `DB_DIALECT=postgres`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME` y variables JWT. | Configuración reproducible; `.env` queda local y excluido. |
 
---------------------------------------------------------------------------------------------------------
 
## 21. Acuerdo de alcance entre los tres momentos académicos
 
| **Momento** | **Responsabilidad** | **Resultado conectado** |
|---|---|---|
| Antes de clase | Alinear, especificar y organizar; llegar con el diseño completo del dominio y del flujo. | SDD, mapa, contratos iniciales y Kanban. |
| Durante la clase | Resolver el proyecto completo en diseño y código, construyendo por capas e integrando la primera rebanada ejecutable. | Backend NestJS + Sequelize, entidades, casos de uso, API, JWT/RBAC, cotización, asignación, tracking y pruebas. |
| Después de clase | Repetir, verificar y mejorar en el proyecto; documentar evidencias y cerrar hallazgos. | Actividad autónoma resuelta, pruebas, rollback, Gate y reflexión. |
 
**Mapa mínimo de EnlaceExpress para preparar la clase:** `Empresa`, `Contacto`, `Direccion`, `Envio`, `Paquete`, `EventoTracking`, `Mensajero`, `Ruta`, `Tarifa`, `PruebaEntrega`, `Factura`, `User`, `Role`, `RoleUser`, `Resource`, `ResourceRole`, `RefreshToken`. La capacidad integrada debe relacionar empresa cliente, envío, asignación operativa, tracking, evidencia de entrega, identidad y autorización; no se prepara una colección de CRUD independientes.
 
**Convención de implementación que se aplicará durante la clase:** cada proceso se resuelve en Domain (reglas del negocio, p. ej. la máquina de estados de `Envio`), Application (casos de uso y puertos, p. ej. `CotizarEnvioUseCase`, `AsignarMensajeroUseCase`) y Presentation (DTO, controlador y contrato), mientras Infrastructure/Sequelize implementa los adaptadores, relaciones y transacciones. Esta separación se repite para `Empresa`, `Contacto`, `Direccion`, `Envio`, `Paquete`, `EventoTracking`, `Mensajero`, `Ruta`, `Tarifa`, `PruebaEntrega`, `Factura`, `User`, `Role`, `RoleUser`, `Resource`, `ResourceRole` y `RefreshToken`.
