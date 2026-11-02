import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { authOnlyGuard } from './core/guards/auth-only-guard';
import { guestGuard } from './core/guards/guest-guard';

/**
 * Rutas de la aplicación.
 */
export const routes: Routes = [
	{
		path: 'login',
		title: 'Iniciar sesión · EnlaceExpress',
		canActivate: [guestGuard],
		loadComponent: () => import('./features/auth/login/login').then((module) => module.Login),
	},
	{
		path: '',
		canActivate: [authGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{
				path: 'dashboard',
				title: 'Panel · EnlaceExpress',
				loadComponent: () =>
					import('./features/construir/construir').then((module) => module.Construir),
			},
			{ path: 'construir', pathMatch: 'full', redirectTo: 'dashboard' },
			{
				path: 'perfil',
				title: 'Perfil · EnlaceExpress',
				canActivate: [authOnlyGuard],
				loadComponent: () =>
					import('./features/auth/profile/profile').then((module) => module.Profile),
			},
			{
				path: 'forbidden',
				title: 'Acceso no autorizado · EnlaceExpress',
				loadComponent: () =>
					import('./features/auth/forbidden/forbidden').then((module) => module.Forbidden),
			},
		],
	},
	{
		path: '**',
		redirectTo: 'construir',
	},
];
