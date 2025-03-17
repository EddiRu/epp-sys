import { Component } from '@angular/core';
import { MenuService } from './services/menu.service';
import { TituloService } from './services/titulo.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  tituloModulo = 'Dashboard';
  menuColapsado = false;
  usuarioAutenticado: boolean = false;

  constructor(
    private menuService: MenuService,
    private tituloService: TituloService,
    private auth: Auth
  ) {


    onAuthStateChanged(this.auth, (user) => {
      this.usuarioAutenticado = !!user;
    });

    this.menuService.menuColapsado$.subscribe(state => {
      this.menuColapsado = state;
    });

  }
}
