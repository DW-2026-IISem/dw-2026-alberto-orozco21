# SDD EnlaceExpress

## 1. Preparación MIRIA
 
| **Elemento** | **Decisión para EnlaceExpress** |
|--------------|---------------------------------|
| M1 | Semana 04: arquitectura por capas y primera capacidad. |
| Objetivo | Construir y explicar una rebanada vertical funcional del backend de mensajería corporativa. |
| Entidades | Empresa, Contacto, Direccion, Envio, Paquete, EventoTracking, Mensajero, Ruta, Tarifa, PruebaEntrega, Factura, User, Role, RoleUser, Resource, ResourceRole, RefreshToken. |
| M2 | Campos, invariantes, relaciones, casos de uso, REQ, AC, errores, permisos y contratos. |
| M3 | Issues dependientes, WIP=1, DoR, DoD, pruebas previstas e incidentes. |
| M4 | IA autorizada solo como apoyo; toda salida se revisa, adapta y registra. |
| M5 | Pruebas de dominio, aplicación, adaptadores, API, integración y seguridad. |
| M6 | Gate, evidencias, reflexión y mejora. |

-----------------------------------------------------------------------------------------------------

## 2. Configuración base

```bash
cat > .env.example <<'EOF'
APP_PORT=3000
DB_DIALECT=postgres
DB_HOST=IP_DEL_HOST
DB_PORT=5433
DB_USERNAME=usuario_remoto
DB_PASSWORD=CAMBIAR_LOCALMENTE
DB_NAME=enlace_express
DB_SCHEMA=
JWT_SECRET=CAMBIAR_LOCALMENTE
JWT_EXPIRES_IN=15m
EOF
cp .env.example .env
printf '\n.env\n' >> .gitignore
```

Valores válidos para `DB_DIALECT`: `mysql`, `postgres`, `mssql` u `oracle`, según el motor asignado en la Semana 02. La validación en tiempo de ejecución (`allowed.includes(dialect)`) es la misma que en el proyecto guía; no se permite que un valor arbitrario llegue al constructor de `SequelizeModule`.

---------------------------------------------------------------------------------------------------------

## 3. Problema, actores y alcance

**Problema:** EnlaceExpress gestiona solicitudes de empresas con múltiples puntos de recogida y entrega. El sistema debe cotizar por zona, peso y prioridad, asignar mensajero y ruta, registrar prueba de entrega y novedades, y consolidar facturación por periodo. Un envío no puede marcarse entregado sin evidencia y receptor.

**Actores del negocio**

| Actor | Rol técnico asociado | Interacción principal |
|-------|----------------------|-----------------------|
| Empresa cliente (vía Contacto) | `CLIENTE_EMPRESA` | Solicita envíos, consulta estado y facturas. |
| Personal de despacho | `DESPACHO` | Cotiza, asigna mensajero y ruta, gestiona novedades. |
| Mensajero | `MENSAJERO` | Ejecuta recogida/entrega, registra tracking y evidencia. |
| Personal de facturación | `FACTURACION` | Consolida y consulta facturas. |
| Administrador | `ADMIN` | Gestiona usuarios, roles y recursos del sistema. |

**Nota de diseño:** *un actor de negocio no equivale automáticamente a una cuenta de acceso*

**Fuera de alcance esta semana:** CRUD completo operando end-to-end contra base de datos, autenticación productiva en producción, RBAC completo verificado con todos los recursos, frontend, despliegue y pruebas de carga. Esta semana se sientan los fundamentos: dominio, arquitectura y base del backend.

---------------------------------------------------------------------------------------------------------

## 4. Modelo de dominio completo

| **Grupo** | **Entidades** | **Reglas esenciales** |
|---|---|---|
| Clientes corporativos | Empresa, Contacto, Direccion | Empresa activa y con `nit` único; contacto y dirección pertenecen siempre a la misma empresa que el envío que los usa; `zona` en Direccion es obligatoria (clave para tarifa). |
| Envío | Envio, Paquete | Al menos un paquete; `peso_total` calculado (no editable); tarifa aplicada como snapshot; solo se modifica contenido mientras `estado = CREADO`. |
| Tracking y entrega | EventoTracking, PruebaEntrega | `EventoTracking` es append-only; `PruebaEntrega` es obligatoria, única por envío (`envio_id UNIQUE`) y requerida antes de `ENTREGADO`. |
| Operación | Mensajero, Ruta, Tarifa | Mensajero activo y zona compatible con origen/destino; sin solapamiento de vigencia de `Tarifa` para la misma zona/prioridad. |
| Facturación | Factura | Solo agrupa envíos en `ENTREGADO` de una misma empresa; un envío pertenece a una sola factura; inmutable una vez `PAGADA`. |
| Identidad | User, RefreshToken | `username`/`email` únicos; contraseña con hash; token expirado o revocado no sirve; nunca se devuelve el hash. |
| Autorización | Role, RoleUser, Resource, ResourceRole | Asociaciones únicas y activas; solo una cadena activa (`user_activo → rol_activo → recurso_activo`) concede permiso. |

**Relaciones mínimas:**

`Empresa 1:N Contacto`, `Empresa 1:N Direccion`, `Empresa 1:N Envio`, `Empresa 1:N Factura`, `Envio 1:N Paquete`, `Envio 1:N EventoTracking`, `Envio 0..1:1 PruebaEntrega`, `Mensajero 1:N Envio`, `Ruta 1:N Envio`, `Tarifa 1:N Envio`, `Factura N:M Envio` (vía `factura_envios`), `User N:M Role` por `RoleUser`, `Role N:M Resource` por `ResourceRole`, `User 1:N RefreshToken`.

*Nota terminológica: en el dominio, la relación de una guía con sus bultos se llama `Envio–Paquete`; en el modelo Sequelize se persisten como tablas independientes `envios` y `paquetes` con FK simple — no existe ambigüedad de nombres equivalente al caso `SaleItem/ProductSale` del proyecto guía, pero cualquier renombrado futuro debe documentarse igual de explícito.*

---------------------------------------------------------------------------------------------------------

## 5. Arquitectura por capas

Regla de dependencia — tres capas centrales y un adaptador externo:

`presentation → application → domain` y `infrastructure/Sequelize → puertos definidos por application/domain`.

El subsistema `iam` sigue la misma regla y **no depende de `features/business`**; el dominio de negocio no importa la entidad `User`.

```bash
mkdir -p src/config src/common/{filters,interceptors,guards} src/database
mkdir -p src/features/business/corporate-customers/{domain,application,infrastructure,presentation}
mkdir -p src/features/business/shipping/{domain,application,infrastructure,presentation}
mkdir -p src/features/business/dispatch/{domain,application,infrastructure,presentation}
mkdir -p src/features/business/tracking/{domain,application,infrastructure,presentation}
mkdir -p src/features/business/proof-of-delivery/{domain,application,infrastructure,presentation}
mkdir -p src/features/business/invoicing/{domain,application,infrastructure,presentation}
mkdir -p src/iam/{users,roles,role-users,resources,resource-roles,refresh-tokens}/{domain,application,infrastructure,presentation}
mkdir -p src/iam/{services,controllers,dto,strategies}
```

Cada proceso de cada entidad debe mostrar las tres capas centrales: (1) regla y entidad en Domain — por ejemplo, la máquina de estados de `Envio` vive aquí, no en un controlador; (2) caso de uso y puerto en Application — por ejemplo `CotizarEnvioUseCase`, `AsignarMensajeroUseCase`, `RegistrarPruebaEntregaUseCase`; (3) DTO/controlador/contrato en Presentation. Infrastructure no es una cuarta capa de negocio: implementa repositorios, modelos y transacciones Sequelize sin contaminar el dominio.

El dominio no importa NestJS, Sequelize, HTTP ni variables de entorno. Los DTO, controladores, modelos Sequelize, repositorios ORM y guards pertenecen a las capas externas.

---------------------------------------------------------------------------------------------------------
