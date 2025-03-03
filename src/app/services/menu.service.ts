import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  private menuColapsado = new BehaviorSubject<boolean>(false);
  menuColapsado$ = this.menuColapsado.asObservable();

  toggleMenu() {
    this.menuColapsado.next(!this.menuColapsado.value);
  }

  setMenuState(state: boolean) {
    this.menuColapsado.next(state);
  }
}
