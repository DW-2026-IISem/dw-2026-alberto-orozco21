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
	{ path: '', pathMatch: 'full', redirectTo: 'construir' },
	{ path: '**', redirectTo: 'construir' },
];
