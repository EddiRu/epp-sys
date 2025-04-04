import { Injectable } from '@angular/core';
import {
  doc,
  collection,
  collectionData,
  docData,
  Firestore,
  updateDoc
} from '@angular/fire/firestore';
import {
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiredatabaseService {

  constructor(
    private firestore: Firestore
  ) { }

  getUsuarios(): Observable<any[]> {
    const registroRef = collection(this.firestore, 'usuarios');
    return collectionData(registroRef, { idField: 'id' }) as Observable<any[]>;
  }


  /*
    Gestión de equipo
  */

  getEquipos(): Observable<any[]> {
    const registroRef = collection(this.firestore, 'equipos');
    return collectionData(registroRef, { idField: 'id' }) as Observable<any[]>;
  }

  getEquipoById(id: string): Observable<any> {
    const registroRef = doc(this.firestore, `equipos/${id}`);
    return docData(registroRef) as Observable<any>;
  }

  addEquipo(reporte: any): Promise<any> {
    return addDoc(collection(this.firestore, 'equipos'), reporte);
  }

  deleteEquipo(id: string) {
    const registroRef = doc(this.firestore, `equipos/${id}`);
    return deleteDoc(registroRef);
  }

  updateEquipo(reporte: any): Promise<any> {
    const registroRef = doc(this.firestore, `equipos/${reporte.id}`);
    return updateDoc(registroRef, {
      nombre: reporte.nombre,
      tipo: reporte.tipo,
      cantidad_disponible: reporte.cantidad_disponible,
      fecha_ingreso: reporte.fecha_ingreso,
      descripcion: reporte.descripcion,
      estado: reporte.estado
    });
  }

  /*
    Gestión de trabajadores
  */

  getTrabajadores(): Observable<any[]> {
    const registroRef = collection(this.firestore, 'trabajadores');
    return collectionData(registroRef, { idField: 'id' }) as Observable<any[]>;
  }

  getTrabajadorById(id: string): Observable<any> {
    const registroRef = doc(this.firestore, `trabajadores/${id}`);
    return docData(registroRef) as Observable<any>;
  }

  addTrabajador(reporte: any): Promise<any> {
    return addDoc(collection(this.firestore, 'trabajadores'), reporte);
  }

  deleteTrabajador(id: string) {
    const registroRef = doc(this.firestore, `trabajadores/${id}`);
    return deleteDoc(registroRef);
  }

  updateTrabajador(reporte: any): Promise<any> {
    const registroRef = doc(this.firestore, `trabajadores/${reporte.id}`);
    return updateDoc(registroRef, {
      nombre: reporte.nombre,
      puesto: reporte.puesto,
      departamento: reporte.departamento,
      fecha_registro: reporte.fecha_registro,
      estado: reporte.estado
    });
  }

  /*
    Asignaicones de equipos
  */

  getAsignaciones(): Observable<any[]> {
    const registroRef = collection(this.firestore, 'asignaciones');
    return collectionData(registroRef, { idField: 'id' }) as Observable<any[]>;
  }

  getAsignacionById(id: string): Observable<any> {
    const registroRef = doc(this.firestore, `asignaciones/${id}`);
    return docData(registroRef) as Observable<any>;
  }

  addAsignacion(reporte: any): Promise<any> {
    return addDoc(collection(this.firestore, 'asignaciones'), reporte);
  }

  deleteAsignacion(id: string) {
    const registroRef = doc(this.firestore, `asignaciones/${id}`);
    return deleteDoc(registroRef);
  }

  updateAsignacion(reporte: any): Promise<any> {
    const registroRef = doc(this.firestore, `asignaciones/${reporte.id}`);
    return updateDoc(registroRef, {
      fecha_asignacion: reporte.fecha_asignacion,
      turno: reporte.turno,
      trabajador_id: reporte.trabajador_id,
      equipo_id: reporte.equipo_id,
      cantidad: reporte.cantidad,
      motivo: reporte.motivo,
      firmado: reporte.firmado,
      usuario_asigna_id: reporte.usuario_asigna_id,
      nombre_usuario_asigna: reporte.nombre_usuario_asigna
    });
  }
}
