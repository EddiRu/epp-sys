import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { MenuService } from 'src/app/services/menu.service';
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

  menuItems = [
    { label: 'Dashboard', icon: 'bar-chart-outline', route: '/dashboard' },
    { label: 'Gestión de Usuarios', icon: 'people-outline', route: '/users' },
    { label: 'Registro de Equipos', icon: 'shield-outline', route: '/epp' },
    { label: 'Reportes', icon: 'document-text-outline', route: '/reports' },
    { label: 'Configuración', icon: 'settings-outline', route: '/configuracion' }
  ];

  constructor(
    private tituloService: TituloService, 
    private menuService: MenuService, 
    private router: Router,
    private authService: AuthService,
    private load: LoadingController
  ) {
    this.menuService.menuColapsado$.subscribe(state => {
      this.menuColapsado = state;
    });

    // Detectar cambios en la navegación y restaurar el estado del menú
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarTitulo();
        this.menuService.setMenuState(false); // Siempre desplegar el menú al cambiar de página
      }
    });
  }

  ngOnInit() {
    
  }

  toggleMenu() {
    this.menuService.toggleMenu();
  }

  actualizarTitulo() {
    const rutaActual = this.router.url;
    const itemEncontrado = this.menuItems.find(item => item.route === rutaActual);
    if (itemEncontrado) {
      this.tituloService.setTitulo(itemEncontrado.label);
    }
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
