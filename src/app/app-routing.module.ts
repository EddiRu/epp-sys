import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.module').then( m => m.ReportsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'epp',
    loadChildren: () => import('./pages/epp/epp.module').then( m => m.EppPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'inventario',
    loadChildren: () => import('./pages/inventario/inventario.module').then( m => m.InventarioPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'trabajadores',
    loadChildren: () => import('./pages/trabajadores/trabajadores.module').then( m => m.TrabajadoresPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
