import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TituloService } from 'src/app/services/titulo.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ],
})
export class MenuComponent  implements OnInit {

  menuColapsado = false;
  // Obtener usuario actual
  user: any;
  
  menuItems = [
    { label: 'Dashboard     ', icon: 'bar-chart-outline', route: '/dashboard' },
    { label: 'Historial & Reportes', icon: 'document-text-outline', route: '/reports' },
    { label: 'Trabajadores', icon: 'people-outline', route: '/trabajadores' },
    { label: 'Inventario de Equipos', icon: 'pricetags-outline', route: '/inventario' },
    { label: 'Gestión de Usuarios', icon: 'person-outline', route: '/users' },
    
    
  ];

  constructor(
    private menuService: MenuService, 
    private router: Router,
    private authService: AuthService,
    private load: LoadingController,
    private storageService: StorageService
  ) {
    this.menuService.menuColapsado$.subscribe(state => {
      this.menuColapsado = state;
    });
  }

  ngOnInit() {
    this.obtenerUsuario();
  }

  async obtenerUsuario(){
    this.user = await this.storageService.get('usuario');
    console.log('Usuario: ', this.user);
  }

  toggleMenu() {
    this.menuService.toggleMenu();
  }

  async cerrarSesion(){
    const loadClose = await this.load.create({
      message: 'Cerrando sesión...',
      translucent: true,
      spinner: 'dots',
      mode: 'ios'
    })
    await loadClose.present();
    await this.authService.logout();
    this.router.navigateByUrl('/login', {replaceUrl: true});
    await loadClose.dismiss();
  }

}
