import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  private tituloSubject = new BehaviorSubject<string>('Dashboard');
  titulo$ = this.tituloSubject.asObservable();

  setTitulo(nuevoTitulo: string) {
    this.tituloSubject.next(nuevoTitulo);
  }
}
