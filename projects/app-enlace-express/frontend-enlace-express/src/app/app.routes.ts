import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 */
export const routes: Routes = [
	{
		path: 'construir',
		loadComponent: () =>
			import('./features/construir/construir').then((module) => module.Construir),
	},
	{
		path: '',
		loadComponent: () => import('./layout/shell/shell').then((module) => module.Shell),
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'envios' },
			{
				path: 'envios',
				title: 'Envíos · EnlaceExpress',
				loadComponent: () =>
					import('./features/shipments/shipment-list/shipment-list').then(
						(module) => module.ShipmentList,
					),
			},
		],
	},
	{ path: '**', redirectTo: 'envios' },
];
