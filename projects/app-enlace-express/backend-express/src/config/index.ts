import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/companies/companies.model";
import "../features/business/contact/contact.model";
import "../features/business/address/address.model";
import "../features/business/messenger/messenger.model";
import "../features/business/rate/rate.model";
import "../features/business/route/route.model";
import "../features/business/shipment/shipment.model";
import "../features/business/package/package.model";
import "../features/business/tracking-event/tracking-event.model";
import "../features/business/delivery-proof/delivery-proof.model";
import "../features/business/invoice/invoice.model";
import "../features/auth/users/user.model";
import "../features/auth/roles/role.model";
import "../features/auth/resources/resource.model";
import "../features/auth/role-users/role-user.model";
import "../features/auth/resource-roles/resource-role.model";
import "../features/auth/refresh-tokens/refresh-token.model";
import "../features/business/route/route.associations";
import "../features/business/shipment/shipment.associations";
import "../features/business/package/package.associations";
import "../features/business/tracking-event/tracking-event.associations";
import "../features/business/delivery-proof/delivery-proof.associations";
import "../features/business/invoice/invoice.associations";
import "../features/auth/rbac.associations";
import { Routes } from "../routes/index";
import "../features/business/contact/contact.associations";
import "../features/business/address/address.associations";
import "../features/business/companies/company.associations";
import { setupSwagger } from "../swagger/index";

dotenv.config();

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.docs();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.routePrv.companiesRoutes.routes(this.app);
    this.routePrv.contactRoutes.routes(this.app);
    this.routePrv.addressRoutes.routes(this.app);
    this.routePrv.messengerRoutes.routes(this.app);
    this.routePrv.rateRoutes.routes(this.app);
    this.routePrv.routeRoutes.routes(this.app);
    this.routePrv.shipmentRoutes.routes(this.app);
    this.routePrv.packageRoutes.routes(this.app);
    this.routePrv.trackingEventRoutes.routes(this.app);
    this.routePrv.deliveryProofRoutes.routes(this.app);
    this.routePrv.invoiceRoutes.routes(this.app);
    this.routePrv.usersRoutes.routes(this.app);
  }

  private docs(): void {
    setupSwagger(this.app);
  }

  private async dbConnection(): Promise<void> {
    try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // Por defecto evitamos `alter: true` porque MySQL falla con índices duplicados/64 keys
      // cuando la BD ya existe y se intenta re-alterar el esquema. `sync` aún crea tablas
      // faltantes sin tocar las existentes.
      const syncOptions = {
        force: false,
        alter: process.env.DB_SYNC_ALTER === "true",
      };

      try {
        await sequelize.sync(syncOptions);
        console.log(`📦 Base de datos sincronizada exitosamente`);
      } catch (error: any) {
        const errNo = error?.original?.errno ?? error?.errno ?? error?.parent?.errno;
        if (errNo === 1069 || error?.code === "ER_TOO_MANY_KEYS") {
          console.warn(
            "⚠️ Se omite el ALTER automático por incompatibilidad de índices en MySQL. La aplicación continuará con la BD existente."
          );
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
